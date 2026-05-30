const os = require('os');
const process2 = process;

module.exports = function (browser) {
    const ext = {};
    ext.id   = '__SystemMonitor';
    ext.name = 'System Monitor';
    ext.description = 'Live system stats dashboard';
    ext.version = '1.0.0';
    ext.canDelete = false;

    ext.init = () => {
        console.log('[System Monitor] init');
    };

    ext.enable = () => {
        // ── API endpoint: returns live JSON stats ──────────────────────────
        browser.api.onGET({ name: '/extentions/system-monitor/stats', overwrite: true }, (req, res) => {
            const cpus      = os.cpus();
            const totalMem  = os.totalmem();
            const freeMem   = os.freemem();
            const usedMem   = totalMem - freeMem;
            const memPct    = Math.round((usedMem / totalMem) * 100);
            const uptime    = os.uptime();
            const procMem   = process2.memoryUsage();

            // CPU load: average across all cores (idle vs total ticks)
            const cpuUsages = cpus.map(cpu => {
                const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
                const idle  = cpu.times.idle;
                return Math.round(((total - idle) / total) * 100);
            });
            const avgCpu = Math.round(cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length);

            res.json({
                cpu: {
                    model:   cpus[0]?.model || 'Unknown',
                    cores:   cpus.length,
                    speed:   cpus[0]?.speed || 0,
                    usage:   avgCpu,
                    perCore: cpuUsages,
                },
                mem: {
                    total:   totalMem,
                    used:    usedMem,
                    free:    freeMem,
                    pct:     memPct,
                },
                proc: {
                    rss:      procMem.rss,
                    heapUsed: procMem.heapUsed,
                    heapTotal:procMem.heapTotal,
                    pid:      process2.pid,
                    version:  process2.versions.electron || process2.version,
                },
                system: {
                    platform: os.platform(),
                    arch:     os.arch(),
                    hostname: os.hostname(),
                    uptime:   uptime,
                },
            });
        });

        // ── Main page ──────────────────────────────────────────────────────
        browser.api.onGET({ name: '/extentions/system-monitor', overwrite: true }, (req, res) => {
            res.render(__dirname + '/index.html', {}, { parser: 'html css js', parserDir: __dirname });
        });

        console.log('[System Monitor] Routes registered');
    };

    ext.disable = () => {};
    ext.remove  = () => ext.disable();

    return ext;
};
