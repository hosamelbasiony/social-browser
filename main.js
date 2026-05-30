(async function init() {
    [('SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK')].forEach((signal) => {
        process.on(signal, () => {
            console.log('Request signal :: ' + signal);
            process.exit(1);
        });
    });

    process.on('uncaughtException', function (error) {
        console.error(error, 'Uncaught Exception thrown');
    });

    process.on('uncaughtRejection', function (error) {
        console.error(error, 'Uncaught Rejection thrown');
    });

    process.on('unhandledRejection', function (error, promise) {
        console.error(error, 'Unhandled Rejection thrown');
    });

    process.on('multipleResolves', (type, promise, reason) => {
        console.error(type, promise, reason);
    });

    process.on('warning', (warning) => {
        console.warn(warning.stack);
    });

    const requestedLink = process.argv[process.argv.length - 1];

    console.log(' [ Browser Start ] [ * ] ', requestedLink);

    if (requestedLink.endsWith('core.js')) {
        console.log('[ App Start ] [ browserAPP ] ', requestedLink);
        require(requestedLink);
        return;
    }
    process.setMaxListeners(0);
    console.log(' [ Browser Start ] [ Browser Manager ] ');
    var browserManager = {
        speedMode: false,
        electron: require('electron'),
        http: require('node:http'),
        https: require('node:https'),
        path: require('node:path'),
        os: require('node:os'),
        url: require('node:url'),
        fs: require('node:fs'),
        md5: require('md5'),
        child_process: require('node:child_process'),
        WebSocket: require('ws'),
        package: require('./package.json'),
        id: process.pid,
        windowList: [],
        files: [],
        var: {
            core: { id: '' },
            overwrite: {
                urls: [],
            },
            sites: [],
            session_list: [],
            blocking: { javascript: {}, privacy: {}, youtube: {}, social: {}, popup: { white_list: [] } },
            facebook: {},
            white_list: [],
            black_list: [],
            open_list: [],
            preload_list: [],
            context_menu: { dev_tools: true, inspect: true },
            customHeaderList: [],
        },
        varRaw: {},
        content_list: [],
        log: (...args) => {
            console.log(...args);
        },
        startTime: new Date().getTime(),
    };

    const isFirstInstance = browserManager.electron.app.requestSingleInstanceLock();
    if (!isFirstInstance) {
        console.warn('App Will Close & open in first instance', requestedLink);
        browserManager.electron.app.quit();
        return;
    }

    browserManager.electron.app.clearRecentDocuments();

    // if (process.platform !== 'win32') {
    //     browserManager.electron.app.commandLine.appendSwitch('no-sandbox');
    //     browserManager.electron.app.commandLine.appendSwitch('disable-setuid-sandbox');
    //     browserManager.electron.app.commandLine.appendSwitch('in-process-gpu');
    //     browserManager.electron.app.disableHardwareAcceleration();
    // }

    browserManager.dir = process.resourcesPath + '/app.asar';
    if (browserManager.fs.existsSync(browserManager.dir)) {
        browserManager.data_dir = browserManager.path.join(browserManager.path.dirname(process.resourcesPath), 'social-data');
        if (!browserManager.fs.existsSync(browserManager.data_dir)) {
            browserManager.data_dir = browserManager.path.join(browserManager.os.homedir(), 'social-data');
        }
        if (browserManager.data_dir[0] !== browserManager.dir[0]) {
            browserManager.data_dir = browserManager.path.join(browserManager.path.dirname(process.resourcesPath), 'social-data');
        }
    } else {
        browserManager.dir = process.cwd();
        browserManager.data_dir = browserManager.path.join(process.cwd(), 'social-data');
    }

    browserManager.files_dir = browserManager.dir + '/browser_files';

    if (process.cwd().indexOf('-portal') !== -1 || process.cwd().indexOf('-accounts') !== -1 || process.cwd().indexOf('-users') !== -1) {
        browserManager.data_dir = browserManager.path.join(process.cwd(), 'social-data');
        browserManager.isPortalMode = true;
    }

    if (process.argv.some((x) => x == '--auto-startup')) {
        browserManager.isAutoStartup = true;
    }

    browserManager.Partitions_data_dir = browserManager.path.join(browserManager.data_dir, 'default', 'Partitions');
    browserManager.electron.app.setPath('userData', browserManager.path.join(browserManager.data_dir, 'default'));

    require(browserManager.path.join(browserManager.dir, '/browser_manager/core.js'))(browserManager);

    browserManager.electron.app.setAppUserModelId('social.browser');

    browserManager.electron.Menu.setApplicationMenu(null);

    if (browserManager.electron.app.setUserTasks) {
        browserManager.electron.app.setUserTasks([]);
    }

    if (browserManager.electron.app.dock) {
        browserManager.electron.app.dock.hide();
    }

    browserManager.electron.protocol.registerSchemesAsPrivileged([
        { scheme: 'browser', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true, allowServiceWorkers: true, corsEnabled: true, stream: true, allowExtensions: true } },
    ]);

    /* App Ready */

    browserManager.electron.app.whenReady().then(async () => {
        browserManager.electron.powerSaveBlocker.start('prevent-app-suspension');
        browserManager.electron.powerMonitor.on('suspend', () => {
            console.log('System is about to go to sleep (suspend)');
        });

        browserManager.electron.powerMonitor.on('resume', () => {
            console.log('System is resuming from sleep (resume)');
        });
        browserManager.electron.powerMonitor.on('lock-screen', () => {
            console.log('System is (Lock Screen)');
        });

        await browserManager.handleSession();

        // ====================================================================
        // 🛠️ DEVMODE & SCRAPER EXTENSION INJECTION
        // ====================================================================
        console.log('🚀 [PATCH] Injecting DevMode hooks and scraper extension...');

        // 1. Force DevTools to open automatically on every newly created window
        browserManager.electron.app.on('browser-window-created', (event, window) => {
            window.webContents.once('did-frame-finish-load', () => {
                try {
                    window.webContents.openDevTools({ mode: 'detach' });
                    console.log('✨ [PATCH] DevTools successfully attached to window.');
                } catch (devToolsErr) {
                    console.error('❌ [PATCH] Failed to open DevTools:', devToolsErr);
                }
            });
        });

        // 2. Load extensions — both test-extension and extensions/ folder
        function loadExt(relPath) {
            try {
                const p = browserManager.path.join(browserManager.dir, relPath);
                const loaded = browserManager.loadExtension({ path: p });
                if (loaded) console.log(`✅ [PATCH] Loaded: ${loaded.name}`);
            } catch (e) {
                console.error(`❌ [PATCH] Failed to load ${relPath}:`, e.message);
            }
        }

        loadExt('test-extension');
        loadExt('extensions/system-monitor');
        loadExt('extensions/event-monitor');

        // ====================================================================

        browserManager.electron.protocol.handle('browser', browserManager.handleProtocolRequest);
        // NOTE: https & http handlers intentionally omitted here — browser_app handles them per-session

        if (requestedLink.like('*Social Browser.exe*')) {
            browserManager.log('Set As Default Protocal : browser:// : ' + requestedLink);
            browserManager.electron.app.setAsDefaultProtocolClient('browser');
        } else {
            browserManager.log('Not Set Default Protocal : browser:// : ' + requestedLink);
        }

        browserManager.electron.app.setAccessibilitySupportEnabled(true);
        if (!browserManager.var.core.id.like('*developer*')) {
            browserManager.electron.app.setLoginItemSettings({
                openAtLogin: true,
                args: ['--auto-startup'],
                path: process.execPath,
            });
        }

        browserManager.electron.globalShortcut.unregisterAll();
        // browserManager.setupTray();

        browserManager.electron.app.on('network-connected', () => {
            browserManager.log('network-connected');
        });

        browserManager.electron.app.on('network-disconnected', () => {
            browserManager.log('network-disconnected');
        });

        browserManager.electron.app.on('window-all-closed', (e) => {
            e.preventDefault();
        });

        browserManager.electron.app.on('open-url', function (event, url) {
            browserManager.log('open-url', url);
            event.preventDefault();
            browserManager.createChildProcess({
                url: url,
                windowType: 'popup',
                partition: browserManager.var.core.session.name,
                center: true,
                alwaysOnTop: true,
            });
        });

        browserManager.newTabData = {
            name: '[open new tab]',
            url: requestedLink.like('browser*|http*|file*') ? requestedLink : browserManager.var.core.home_page,
            partition: browserManager.var.core.session.partition,
            user_name: browserManager.var.core.session.user_name,
            active: true,
        };

        if (browserManager.isAutoStartup) {
        } else {
            if (requestedLink.like('browser*|http*|file*')) {
                browserManager.log('Open Requestd Link : ' + requestedLink);
                browserManager.createChildProcess({
                    url: requestedLink,
                    windowType: 'popup',
                    partition: browserManager.var.core.session.name,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else {
                browserManager.createChildProcess({
                    url: 'http://127.0.0.1:60080/home',
                    vip: true,
                    windowType: 'main',
                    partition: 'persist:social',
                });
            }
        }

        setTimeout(() => {
            browserManager.createChildProcess({
                windowType: 'files',
                vip: true,
                partition: 'persist:file',
            });
            browserManager.createChildProcess({
                windowType: 'none',
                vip: true,
                partition: 'ghost',
            });
        }, 1000 * 3);
    });

    browserManager.electron.app.on('second-instance', (event, commandLine, workingDirectory) => {
        browserManager.log('second-instance', commandLine);

        let url = commandLine.pop();

        if (!url || url.like('*--*') || url == '.') {
            url = browserManager.var.core.home_page;
        }

        if (url && !url.like('http*') && !url.like('file*') && !url.like('browser*')) {
            url = 'file://' + url;
        }

        browserManager.newTabData = {
            name: '[open new tab]',
            url: url,
            partition: browserManager.var.core.session.partition,
            user_name: browserManager.var.core.session.user_name,
            active: true,
        };

        browserManager.createChildProcess({
            url: 'http://127.0.0.1:60080/home',
            vip: true,
            windowType: 'main',
            partition: 'persist:social',
        });
    });
})();
