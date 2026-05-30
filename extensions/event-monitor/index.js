module.exports = function (browser) {
    const ext = {};
    ext.id          = '__EventMonitor';
    ext.name        = 'Event Monitor';
    ext.description = 'Monitors target pages and sends Telegram alerts on state change';
    ext.version     = '1.0.0';
    ext.canDelete   = false;

    // ── In-memory state ───────────────────────────────────────────────────
    const state = {
        enabled:       true,
        lastEvent:     '',
        lastSeenAt:    null,
        eventHistory:  [],          // [{title, date, url, sentAt}]
        failCount:     0,
        totalSent:     0,
        config: {
            botToken:  '8163770306:AAFDyvNo7F5iQHruBLsYmjEwamVoA7cJKC4',
            chatId:    '1532415580',
            targets:   ['lis.tibalab.com/company_mock.html', 'company_mock.html'],
            selector:  '.event-card',
            titleSel:  '.event-title',
            dateSel:   '.event-date',
        },
    };

    // ── Telegram sender via electron.net.fetch (avoids Electron HTTPS socket bug) ──
    async function sendTelegram(title, date, url) {
        const text = `🔔 إشعار حدث جديد

📌 العنوان: ${title}
📅 الميعاد: ${date}
🌐 الرابط: ${url}`;
        const endpoint = `https://api.telegram.org/bot${state.config.botToken}/sendMessage`;

        const res = await browser.electron.net.fetch(endpoint, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                chat_id: state.config.chatId,
                text,
            }),
        });
        return res.json();
    }

    ext.init = () => console.log('[Event Monitor] init');

    ext.enable = () => {
        if (ext._enabled) return;  // prevent double-enable from core.js calling enable() twice
        ext._enabled = true;

        // ── Register preload for ALL pages (any origin) ──────────────────
        // browser.addPreload() adds the preload to preload_list.social,
        // which the browser injects into every page including external origins.
        try {
            const preloadPath = require('path').join(__dirname, 'preload.js');
            browser.addPreload({
                id: '__EventMonitorPreload',
                name: 'Event Monitor Preload',
                path: preloadPath,
                url: '*',
            });
            console.log('[Event Monitor] Preload registered for all pages:', preloadPath);
        } catch (e) {
            console.error('[Event Monitor] Failed to register preload:', e.message);
        }
        // ── OPTIONS preflight for /notify (CORS) ────────────────────────────
        browser.api.onOPTIONS({ name: '/extentions/event-monitor/notify', overwrite: true }, (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Max-Age', '86400');
            res.end();
        });

        // ── POST /extentions/event-monitor/notify ─────────────────────────
        // Called from preload.js on any page (may be cross-origin)

        browser.api.onPOST({ name: '/extentions/event-monitor/notify', overwrite: true }, async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            const { title, date, url } = req.body || {};

            if (!state.enabled) { res.json({ ok: false, reason: 'paused' }); return; }
            if (!title)          { res.json({ ok: false, reason: 'no title' }); return; }
            if (title === state.lastEvent) { res.json({ ok: false, reason: 'duplicate' }); return; }

            // Rate limit: 5-second cooldown between notifications
            const now = Date.now();
            if (state._lastNotifyAt && now - state._lastNotifyAt < 5000) {
                res.json({ ok: false, reason: 'rate limited (5s cooldown)' }); return;
            }
            state._lastNotifyAt = now;

            state.lastEvent  = title;
            state.lastSeenAt = new Date().toISOString();

            try {
                const result = await sendTelegram(title, date || 'غير محدد', url || '');
                if (result.ok) {
                    state.totalSent++;
                    state.eventHistory.unshift({ title, date, url, sentAt: state.lastSeenAt, ok: true });
                    if (state.eventHistory.length > 50) state.eventHistory.pop();
                    console.log(`[Event Monitor] ✅ Sent: ${title}`);
                    res.json({ ok: true });
                } else {
                    state.failCount++;
                    state.eventHistory.unshift({ title, date, url, sentAt: state.lastSeenAt, ok: false, err: result.description });
                    console.error('[Event Monitor] ❌ Telegram rejected:', result.description);
                    res.json({ ok: false, reason: result.description });
                }
            } catch (err) {
                state.failCount++;
                console.error('[Event Monitor] ❌ Network error:', err.message);
                res.json({ ok: false, reason: err.message });
            }
        });

        // ── GET /extentions/event-monitor/status ──────────────────────────
        browser.api.onGET({ name: '/extentions/event-monitor/status', overwrite: true }, (req, res) => {
            res.json(state);
        });

        // ── GET /extentions/event-monitor/ping ────────────────────────────
        // CORS-free notification: called via Image().src from preload.js.
        // GET with query params = no preflight = works from any origin.
        browser.api.onGET({ name: '/extentions/event-monitor/ping', overwrite: true }, async (req, res) => {
            const title = (req.query && req.query.title) || '';
            const date  = (req.query && req.query.date)  || 'غير محدد';
            const url   = (req.query && req.query.url)   || '';

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'no-cache, no-store');

            if (!state.enabled)            { res.json({ ok: false, reason: 'paused' }); return; }
            if (!title)                    { res.json({ ok: false, reason: 'no title' }); return; }
            if (title === state.lastEvent) { res.json({ ok: false, reason: 'duplicate' }); return; }

            // Rate limit
            const now = Date.now();
            if (state._lastNotifyAt && now - state._lastNotifyAt < 5000) {
                res.json({ ok: false, reason: 'rate limited' }); return;
            }
            state._lastNotifyAt = now;

            state.lastEvent  = title;
            state.lastSeenAt = new Date().toISOString();
            console.log(`[Event Monitor] 📨 Ping: ${title}`);

            try {
                const tgResult = await sendTelegram(title, date, url);
                if (tgResult.ok) {
                    state.totalSent++;
                    state.eventHistory.unshift({ title, date, url, sentAt: state.lastSeenAt, ok: true });
                    if (state.eventHistory.length > 50) state.eventHistory.pop();
                    console.log(`[Event Monitor] ✅ Sent: ${title}`);
                } else {
                    state.failCount++;
                    state.eventHistory.unshift({ title, date, url, sentAt: state.lastSeenAt, ok: false, err: tgResult.description });
                    console.error(`[Event Monitor] ❌ Rejected: ${tgResult.description}`);
                }
                res.json({ ok: true });
            } catch (err) {
                state.failCount++;
                console.error(`[Event Monitor] ❌ Error: ${err.message}`);
                res.json({ ok: false, reason: err.message });
            }
        });


        // ── POST /extentions/event-monitor/config ─────────────────────────
        browser.api.onPOST({ name: '/extentions/event-monitor/config', overwrite: true }, (req, res) => {
            const { botToken, chatId, targets, selector, titleSel, dateSel, enabled } = req.body || {};
            if (botToken  !== undefined) state.config.botToken  = botToken;
            if (chatId    !== undefined) state.config.chatId    = chatId;
            if (targets   !== undefined) state.config.targets   = targets;
            if (selector  !== undefined) state.config.selector  = selector;
            if (titleSel  !== undefined) state.config.titleSel  = titleSel;
            if (dateSel   !== undefined) state.config.dateSel   = dateSel;
            if (enabled   !== undefined) state.enabled           = enabled;
            res.json({ ok: true, config: state.config, enabled: state.enabled });
        });

        // ── POST /extentions/event-monitor/test ───────────────────────────
        browser.api.onPOST({ name: '/extentions/event-monitor/test', overwrite: true }, async (req, res) => {
            try {
                const result = await sendTelegram('✅ Test Message', 'Now', 'Event Monitor Extension');
                res.json({ ok: result.ok });
            } catch (err) {
                res.json({ ok: false, reason: err.message });
            }
        });

        // ── GET /extentions/event-monitor ─────────────────────────────────
        browser.api.onGET({ name: '/extentions/event-monitor', overwrite: true }, (req, res) => {
            const html = browser.fs.readFileSync(__dirname + '/index.html', 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        });

        // ── GET /company_mock.html ─────────────────────────────────────────
        browser.api.onGET({ name: '/company_mock.html', overwrite: true }, (req, res) => {
            const html = browser.fs.readFileSync(__dirname + '/company_mock.html', 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        });

        // ── GET /extentions/event-monitor/pause  ──────────────────────────
        // ── GET /extentions/event-monitor/resume ──────────────────────────
        // Simple JSON toggle — safe to call as a fetch() sub-request from any page.
        // No HTML rendering = no render-process-gone crash risk.
        browser.api.onGET({ name: '/extentions/event-monitor/pause', overwrite: true }, (req, res) => {
            state.enabled = false;
            console.log('[Event Monitor] ⏸ Paused');
            res.json({ ok: true, enabled: false });
        });

        browser.api.onGET({ name: '/extentions/event-monitor/resume', overwrite: true }, (req, res) => {
            state.enabled = true;
            console.log('[Event Monitor] ▶️ Resumed');
            res.json({ ok: true, enabled: true });
        });

        browser.api.onGET({ name: '/extentions/event-monitor/state', overwrite: true }, (req, res) => {
            res.json({ ok: true, enabled: state.enabled, totalSent: state.totalSent, lastEvent: state.lastEvent });
        });

        console.log('[Event Monitor] Routes registered — preload monitors company_mock.html');
    };

    ext.disable = () => { state.enabled = false; };
    ext.remove  = () => ext.disable();

    return ext;
};
