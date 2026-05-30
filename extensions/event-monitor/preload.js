// ── Event Monitor Preload ──────────────────────────────────────────────────
// Detects new DOM event cards and POSTs to the local /notify route.
// The server checks state.enabled (pause flag) before forwarding to Telegram.
// Uses same-origin fetch to http://127.0.0.1:60080.
(function () {
    'use strict';

    // ── Config ────────────────────────────────────────────────────────────
    var TARGET_PATTERNS = ['lis.tibalab.com/company_mock.html', 'company_mock.html', 'standalone_mock.html'];
    var SEL_CARD  = '.event-card';
    var SEL_TITLE = '.event-title';
    var SEL_DATE  = '.event-date';

    // ── Menu item ─────────────────────────────────────────────────────────
    if (typeof SOCIALBROWSER !== 'undefined') {
        try {
            SOCIALBROWSER.addMenu({
                label: '🔔 Event Monitor',
                click: function () { document.location.href = 'http://127.0.0.1:60080/extentions/event-monitor'; },
            });
            SOCIALBROWSER.addMenu({ type: 'separator' });
        } catch (_) { }
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    function isTarget() {
        try { return TARGET_PATTERNS.some(function (p) { return location.href.indexOf(p) !== -1; }); }
        catch (_) { return false; }
    }

    function sendNotify(title, date) {
        var API = 'http://127.0.0.1:60080';
        var isSameOrigin = false;
        try { isSameOrigin = location.origin === API || location.origin === 'http://localhost:60080'; } catch(_) {}

        if (isSameOrigin) {
            // Same-origin: use fetch POST (richer response)
            try {
                fetch(API + '/extentions/event-monitor/notify', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ title: title, date: date || 'غير محدد', url: location.href }),
                }).then(function (r) { return r.json(); })
                  .then(function (result) {
                    if (result.ok) console.log('[Event Monitor] \u2705 Notified: ' + title);
                    else console.log('[Event Monitor] \u2139\ufe0f Skipped (' + (result.reason || '') + ')');
                }).catch(function (err) {
                    console.error('[Event Monitor] \u274C notify error:', err);
                });
            } catch (e) { console.error('[Event Monitor] sendNotify error:', e); }
        } else {
            // Cross-origin: use Image().src GET — completely bypasses CORS
            try {
                var params = 'title=' + encodeURIComponent(title)
                           + '&date=' + encodeURIComponent(date || 'غير محدد')
                           + '&url='  + encodeURIComponent(location.href)
                           + '&_t='   + Date.now(); // cache-bust
                var img = new Image();
                img.src = API + '/extentions/event-monitor/ping?' + params;
                console.log('[Event Monitor] \ud83d\udce1 Ping sent: ' + title);
            } catch (e) { console.error('[Event Monitor] ping error:', e); }
        }
    }


    // ── DOM scanner ───────────────────────────────────────────────────────
    var lastSeen = '';

    function scan() {
        if (!isTarget()) return;
        try {
            var cards = document.querySelectorAll(SEL_CARD);
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                // Skip cards already notified by inline JS (prevents double-send)
                if (card.getAttribute('data-notified')) continue;
                var titleEl = card.querySelector(SEL_TITLE);
                var dateEl = card.querySelector(SEL_DATE);
                var title = titleEl ? (titleEl.innerText || titleEl.textContent || '').trim() : '';
                var date = dateEl ? (dateEl.innerText || dateEl.textContent || '').trim() : '';
                if (!title || title === lastSeen) continue;
                lastSeen = title;
                card.setAttribute('data-notified', '1');
                console.log('[Event Monitor] \uD83D\uDFE3 New event detected: ' + title);
                sendNotify(title, date);
                break; // one at a time
            }
        } catch (_) { }
    }

    // ── Start monitoring ──────────────────────────────────────────────────
    function startMonitoring() {
        console.log("Event Monitor is running in preload.js");
        if (!isTarget()) return;
        console.log('[Event Monitor] \u2705 Active on this page');
        scan();
        try {
            var root = document.body || document.documentElement;
            if (root) {
                new MutationObserver(function () { scan(); }).observe(root, {
                    childList: true, subtree: true,
                });
            }
        } catch (_) { }
        setInterval(scan, 2000);
    }

    // ── Bootstrap ─────────────────────────────────────────────────────────
    try {
        if (typeof SOCIALBROWSER !== 'undefined') {
            SOCIALBROWSER.onLoad(startMonitoring);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startMonitoring);
        } else {
            startMonitoring();
        }
    } catch (_) {
        setTimeout(startMonitoring, 500);
    }

})();
