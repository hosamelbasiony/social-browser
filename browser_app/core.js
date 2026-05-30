[('SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK')].forEach((signal) => {
    process.on(signal, () => {
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

process.setMaxListeners(100);
require('events').EventEmitter.defaultMaxListeners = 0;
require('events').EventEmitter.prototype._maxListeners = 100;

var browserApp = {
    index: parseInt(process.argv[1].replace('--index=', '')),
    uuid: process.argv[2].replace('--uuid=', ''),
    partition: process.argv[3].replace('--partition=', ''),
    dir: process.argv[4].replace('--dir=', ''),
    data_dir: process.argv[5].replace('--data_dir=', ''),
    speedMode: Boolean(process.argv[6].replace('--speed=', '')),
    theme: process.argv[7].replace('--theme=', ''),

    electron: require('electron'),

    url: require('node:url'),
    path: require('node:path'),
    os: require('node:os'),
    http: require('node:http'),
    https: require('node:https'),
    fs: require('node:fs'),

    api: require('isite')({
        port: [60081],
        name: 'Social API',
        stdin: false,
        apps: false,
        help: false,
        _0x14xo: !0,
        public: true,
        lang: 'en',
        https: {
            enabled: true,
            port: 60043,
        },
        cache: {
            enabled: false,
        },
        mongodb: {
            enabled: false,
            db: 'social-browser-browserApp-db',
            limit: 100000,
            identity: {
                enabled: true,
            },
        },
        session: {
            enabled: false,
            save: false,
        },
        security: {
            enabled: true,
        },
        proto: {
            object: false,
        },
    }),

    child_process: require('node:child_process'),
    WebSocket: require('ws'),

    id: process.pid,
    windowList: [],
    option_list: [],
    assignWindows: [],
    log: (...args) => {
        if (browserApp.coreData) {
            console.log(...args);
        }
    },
    cookies: {},
    shared: {},
    startTime: new Date().getTime(),
    getWindow: () => {
        if (browserApp.window && !browserApp.window.isDestroyed()) {
            return browserApp.window;
        }
        return null;
    },
};

browserApp.send = browserApp.sendMessage = async function (message) {
    if (process.send) {
        if (typeof message === 'string') {
            message = { type: message };
        }
        message.uuid = browserApp.uuid;
        process.send(message);
    }
};

browserApp.ipcMain = browserApp.electron.ipcMain;

browserApp.electron.app.commandLine.appendSwitch(
  'enable-features',
  'FontAccess'
);
browserApp.electron.app.commandLine.appendSwitch(
  'enable-blink-features',
  'LocalFontAccess'
);

// browserApp.electron.app.commandLine.appendSwitch('host-resolver-rules', 'MAP * ~NOTFOUND , EXCLUDE 127.0.0.1');
// browserApp.electron.app.commandLine.appendSwitch('force-webrtc-ip-handling-policy', 'disable_non_proxied_udp');
// browserApp.electron.app.commandLine.appendSwitch('webrtc-ip-handling-policy', 'disable_non_proxied_udp');
// browserApp.electron.app.commandLine.appendSwitch('enable-features', 'WebRTCHideLocalIpsWithMdns');

// browserApp.electron.app.commandLine.appendSwitch('disable-blink-features' , 'AutomationControlled');
// browserApp.electron.app.commandLine.appendSwitch('in-process-gpu');
// if (process.platform !== 'win32') {
//     browserApp.electron.app.commandLine.appendSwitch('no-sandbox');
//     browserApp.electron.app.commandLine.appendSwitch('disable-setuid-sandbox');
//     browserApp.electron.app.disableHardwareAcceleration();
// }

// browserApp.electron.app.commandLine.appendSwitch('disable-dev-mode');
// browserApp.electron.app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
// browserApp.electron.app.commandLine.appendSwitch('proxy-bypass-list', '<local>')

// browserApp.electron.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
// browserApp.electron.app.commandLine.appendSwitch('disable-features', 'UserAgentClientHint');
// browserApp.electron.app.commandLine.appendSwitch('disable-debug-mode');
// browserApp.electron.app.disableHardwareAcceleration(); ## real human has this //

if (browserApp.uuid == 'x-ghost') {
    browserApp.userDataDir = browserApp.path.join(browserApp.data_dir, 'sessionData', browserApp.uuid);
} else {
    browserApp.userDataDir = browserApp.path.join(browserApp.data_dir, browserApp.uuid);
}

require(browserApp.path.join(browserApp.dir, 'browser_app', 'shared'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'fn'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'vars'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'windows'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'adsManager'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'ipc'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'session'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'proxy_check'))(browserApp);
require(browserApp.path.join(browserApp.dir, 'browser_app', 'messages'))(browserApp);

browserApp.shell = browserApp.electron.shell;
browserApp.dialog = browserApp.electron.dialog;

if (browserApp.theme == 'light') {
    browserApp.electron.nativeTheme.themeSource = 'light';
} else {
    browserApp.electron.nativeTheme.themeSource = 'dark';
}

if (browserApp.uuid == 'user-file') {
    browserApp.log('Files Working ....');
    setInterval(() => {
        if (browserApp.saveBrowserVar_quee.length > 0) {
            let name = browserApp.saveBrowserVar_quee.shift();
            browserApp.saveBrowserVar_quee = browserApp.saveBrowserVar_quee.filter((s) => s !== name);
            browserApp.saveBrowserVar(name);
        }
    }, 1000 * 2);
}

// browserApp.electron.app.setAppUserModelId('social.browser');
browserApp.electron.app.clearRecentDocuments();

if (browserApp.electron.app.setUserTasks) {
    browserApp.electron.app.setUserTasks([]);
}
if (browserApp.electron.app.dock) {
    // browserApp.electron.app.dock.hide();
}

//browserApp.electron.app.commandLine.appendSwitch('enable-experimental-web-platform-features');
//browserApp.electron.app.commandLine.appendSwitch('disable-software-rasterizer');
//browserApp.electron.app.commandLine.appendSwitch('enable-webgl');
// browserApp.electron.app.commandLine.appendSwitch('disable-dev-shm-usage');
// browserApp.electron.app.commandLine.appendSwitch('disable-gpu');

//browserApp.electron.app.commandLine.appendSwitch('disable-web-security');
// browserApp.electron.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
//browserApp.electron.app.commandLine.appendSwitch('disable-site-isolation-trials');
//browserApp.electron.app.commandLine.appendSwitch('enable-features', 'PDFViewerUpdate');

browserApp.mkdirSync(browserApp.userDataDir);
browserApp.electron.app.setName('Social Browser - ' + browserApp.partition);
browserApp.electron.app.setPath('userData', browserApp.userDataDir);

browserApp.electron.protocol.registerSchemesAsPrivileged([
    { scheme: 'browser', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true, allowServiceWorkers: true, corsEnabled: true, stream: true, allowExtensions: true } },
]);

browserApp.electron.app.whenReady().then(() => {
    browserApp.electron.protocol.handle('browser', browserApp.handleProtocolRequest);
    browserApp.electron.protocol.handle('https', browserApp.handleProtocolRequest);
    browserApp.electron.protocol.handle('http', browserApp.handleProtocolRequest);

    browserApp.electron.globalShortcut.unregisterAll();
    browserApp.electron.app.setAccessibilitySupportEnabled(false);

    browserApp.workerScopeList = [];

    browserApp.electron.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        event.preventDefault();
        callback(true);
    });
    browserApp.electron.app.on('select-client-certificate', (event, webContents, url, list, callback) => {
        event.preventDefault();
        callback(list[0]);
    });

    browserApp.electron.app.on('web-contents-created', (event, contents) => {
        contents.on('will-attach-webview', (event, webPreferences, params) => {
            webPreferences.nodeIntegration = false;
            delete webPreferences.preloadURL;
            event.preventDefault();
        });
    });

    browserApp.tryClosing = function () {
        if (!browserApp.downloadingBusy && browserApp.partition.contains('persist:') && browserApp.electron.BrowserWindow.getAllWindows().length === 0) {
            if (process.platform !== 'darwin') {
                browserApp.log('window-all-closed :  app.quit() : ' + browserApp.partition + ' : ' + browserApp.index);
                browserApp.electron.app.quit();
            }
        }
    };

    browserApp.electron.app.on('window-all-closed', (e) => {
        e.preventDefault();
        browserApp.tryClosing();
    });
    browserApp.electron.app.on('activate', () => {
        if (browserApp.getAllWindows().length === 0) {
            if (browserApp.coreData.windowType == 'main') {
                if (browserApp.mainWindow && !browserApp.mainWindow.isDestroyed()) {
                    browserApp.mainWindow.show();
                    browserApp.mainWindow.webContents.send('[open new tab]', message.newTabData);
                } else {
                    browserApp.createNewWindow({ ...browserApp.coreData.options });
                }
            }
        }
    });

    browserApp.electron.app.on('login', async (event, webContents, details, authInfo, callback) => {
        event.preventDefault();

        if (details.responseHeaders) {
            let connectionStatus = details.responseHeaders['connection'] || '';
            if (Array.isArray(connectionStatus)) {
                connectionStatus = connectionStatus.join('\n');
            }
            if (connectionStatus.like('*close*')) {
                if (webContents) {
                    webContents.send('[show-user-message]', {
                        message: 'Proxy Authentication Failed. Connection closed by proxy server.',
                    });
                }
            } else {
                if (webContents && connectionStatus) {
                    webContents.send('[show-user-message]', {
                        message: connectionStatus,
                    });
                }
            }
        }

        if (authInfo.isProxy) {
            let proxy = null;

            if (webContents) {
                let win = browserApp.electron.BrowserWindow.fromWebContents(webContents);

                if (win && win.customSetting) {
                    proxy = win.customSetting.proxy;
                    if (proxy) {
                        callback(proxy.username, proxy.password);
                        return;
                    }
                }

                let index2 = browserApp.coreData.var.session_list.findIndex((s) => s.name == webContents.session.name && s.proxy && s.proxyEnabled);
                if (index2 !== -1) {
                    proxy = browserApp.coreData.var.session_list[index2].proxy;
                    callback(proxy.username, proxy.password);
                    return;
                }
            }

            let index3 = browserApp.coreData.var.proxy_list.findIndex((p) => p.ip == authInfo.host && p.port == authInfo.port);
            if (index3 !== -1) {
                proxy = browserApp.coreData.var.proxy_list[index3];
                callback(proxy.username, proxy.password);
                return;
            }
        }

        if (webContents) {
            let win = browserApp.electron.BrowserWindow.fromWebContents(webContents);
            if (win && win.customSetting && win.customSetting.autoMode) {
                callback();
                return;
            }
        }

        let info = await browserApp.login({ domain: authInfo.host, message: authInfo.isProxy ? `Authentication required for Proxy ${authInfo.host}:${authInfo.port}` : details.url });
        if (info) {
            callback(info.username, info.password);
        } else {
            callback();
        }
    });

    browserApp.getAllWindows = function () {
        return browserApp.electron.BaseWindow.getAllWindows() || [];
    };
    browserApp.sendToMainWindow = function (...args) {
        browserApp.getAllWindows().forEach((win) => {
            if (win && win.customSetting && win.customSetting.windowType == 'main' && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
                win.webContents.send(...args);
            }
        });
    };

    browserApp.sendToAllWindows = function (...args) {
        browserApp.getAllWindows().forEach((win) => {
            if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
                win.webContents.send(...args);
            }
        });
    };

    browserApp.handleWindowBounds = function () {
        if (browserApp.handleWindowBoundsBusy || !browserApp.mainWindowDataMessage) {
            return;
        }

        browserApp.handleWindowBoundsBusy = true;

        let mainWindow = browserApp.mainWindowDataMessage.mainWindow;
        let screen = browserApp.mainWindowDataMessage.screen;

        if (!mainWindow || !screen) {
            browserApp.handleWindowBoundsBusy = false;
            return;
        }

        browserApp
            .getAllWindows()
            .filter((win) => win && !win.isDestroyed() && win.isCurrentView && win.customSetting.windowType == 'view')
            .forEach((win) => {
                if (mainWindow.hide) {
                    win.hide();
                    browserApp.isCurrentView = false;
                }

                if (win.isFullScreen()) {
                    let width = screen.bounds.width;
                    let height = screen.bounds.height;
                    win.setBounds({
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    });
                } else {
                    let bounds = mainWindow.bounds;
                    let new_bounds = {
                        x: mainWindow.isMaximized ? bounds.x + browserApp.offset.x : bounds.x,
                        y: mainWindow.isMaximized ? bounds.y + browserApp.offset.y : bounds.y + browserApp.offset.y2,
                        width: mainWindow.isMaximized ? bounds.width - browserApp.offset.width : bounds.width - browserApp.offset.width2,
                        height: mainWindow.isMaximized ? bounds.height - browserApp.offset.height : bounds.height - browserApp.offset.height2,
                    };
                    let old_bounds = win.getBounds();
                    if (old_bounds.width != new_bounds.width || old_bounds.height != new_bounds.height || old_bounds.y != new_bounds.y || old_bounds.x != new_bounds.x) {
                        win.setBounds(new_bounds);
                    }
                }
            });

        browserApp.handleWindowBoundsBusy = false;
    };

    browserApp.send({ type: 'ready' });
});
