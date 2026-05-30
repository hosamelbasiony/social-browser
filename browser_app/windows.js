module.exports = function (browserApp) {
    browserApp.offset = {
        x: 8,
        y: 78 + 42,
        y2: 70 + 42,
        width: 0,
        width2: -15,
        height: 84 + 45 + 35 ,
        height2: 72 + 40 + 35,
    };

    browserApp.showAddressbarWindow = async function (op, show = true) {
        let win = browserApp.getAllWindows().find((w) => w && w.customSetting.windowType === 'main');

        if (!win || win.isDestroyed()) {
            return;
        }

        if (!browserApp.addressbarWindow || browserApp.addressbarWindow.isDestroyed()) {
            browserApp.addressbarWindow = await browserApp.createNewWindow({
                url: browserApp.url.format({
                    pathname: browserApp.path.join(browserApp.coreData.files_dir, 'html', 'address-bar.html'),
                    protocol: 'file:',
                    slashes: true,
                }),
                windowType: 'addressbar',
                vip: true,
                allowMenu: browserApp.isDeveloperMode(),
                show: false,
                width: win.getBounds().width - 200,
                height: 500,
                x: win.getBounds().x - 90,
                y: win.getBounds().y - 70,
                alwaysOnTop: false,
                skipTaskbar: true,
                resizable: false,
                fullscreenable: false,
                title: 'Address-bar',
                frame: false,
                webPreferences: {
                    contextIsolation: false,
                    partition: 'addressbar',
                    nativeWindowOpen: false,
                    nodeIntegration: true,
                    experimentalFeatures: false,
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    plugins: true,
                },
            });
        }

        if (show && browserApp.addressbarWindow && !browserApp.addressbarWindow.isDestroyed()) {
            browserApp.addressbarWindow.send('[set-address-url]', op);
            browserApp.addressbarWindow.setBounds({
                width: win.getBounds().width - 200,
                height: 500,
                x: win.getBounds().x + 120,
                y: win.getBounds().y + 30,
            });
            browserApp.addressbarWindow.show();
        }
    };

    browserApp.showProfilesWindow = async function (show = true) {
        let win = browserApp.getAllWindows().find((w) => w && w.customSetting.windowType === 'main');

        if (!win || win.isDestroyed()) {
            return;
        }

        if (!browserApp.profilesWindow || browserApp.profilesWindow.isDestroyed()) {
            browserApp.profilesWindow = await browserApp.createNewWindow({
                url: browserApp.url.format({
                    pathname: browserApp.path.join(browserApp.coreData.files_dir, 'html', 'user-profiles.html'),
                    protocol: 'file:',
                    slashes: true,
                }),
                windowType: 'profiles',
                vip: true,
                allowMenu: browserApp.isDeveloperMode(),
                show: false,
                width: win.getBounds().width / 2,
                height: win.getBounds().height - 30,
                x: win.getBounds().x + win.getBounds().width / 2 + 15,
                y: (win.getBounds().y == -8 ? 0 : win.getBounds().y - 5) + 30,
                alwaysOnTop: false,
                resizable: false,
                fullscreenable: false,
                title: 'profiles',
                frame: false,
                skipTaskbar: true,
                webPreferences: {
                    contextIsolation: false,
                    partition: 'profiles',
                    nativeWindowOpen: false,
                    nodeIntegration: true,
                    experimentalFeatures: false,
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    plugins: true,
                },
            });
        }
        if (show && browserApp.profilesWindow && !browserApp.profilesWindow.isDestroyed()) {
            browserApp.profilesWindow.setBounds({
                width: win.getBounds().width / 2,
                height: win.getBounds().height - 30,
                x: win.getBounds().x + win.getBounds().width / 2 + 15,
                y: (win.getBounds().y == -8 ? 0 : win.getBounds().y - 5) + 30,
            });
            browserApp.profilesWindow.show();
        }
    };

    browserApp.shareMainWindowData = async function (win) {
        if (browserApp.allowShareMainWindowData) {
            browserApp.allowShareMainWindowData = false;

            if (win && !win.isDestroyed()) {
                let data = {
                    type: '[main-window-data-changed]',
                    mainWindow: {
                        id: win.id,
                        bounds: win.getBounds(),
                        isMaximized: win.isMaximized(),
                        hide: win.isMinimized() || !win.isVisible(),
                    },
                    screen: {
                        bounds: browserApp.electron.screen.getPrimaryDisplay().bounds,
                    },
                };

                browserApp.sendMessage(data);
            }
        }

        setTimeout(() => {
            browserApp.shareMainWindowData(win);
        }, 10);
    };

    browserApp.createNewWindow = async function (setting) {
        delete setting.name;
        delete setting.id;
        setting.webPreferences = setting.webPreferences || {};

        let bounds = browserApp.electron.screen.getPrimaryDisplay().bounds;

        if (setting.windowType !== 'view') {
            delete setting.tabID;
        }

        setting.partition = setting.partition || setting.session?.name || browserApp.partition || browserApp.coreData.var.core.session.name;
        setting.windowType = setting.windowType || 'popup';
        setting.url = setting.url || '';

        let defaultSetting = {
            showDevTools: false,
            vip: false,
            session: undefined,
            iframe: true,
            trackingID: 'main_tracking_' + new Date().getTime(),
            sandbox: true,
            chrome: false,
            cookie: undefined,
            cookies: undefined,
            cookieObject: undefined,
            cookieList: undefined,
            localStorageList: undefined,
            sessionStorageList: undefined,

            urlList: [],

            allowOpenExternal: true,
            allowMenu: true,
            allowDevTools: true,
            allowAds: false,
            allowNewWindows: true,
            allowSaveUserData: true,
            allowSaveUrls: true,
            allowRedirect: true,
            allowSelfRedirect: true,
            allowSelfWindow: false,
            allowJavascript: true,
            allowAudio: true,
            allowPopup: false,

            allowGoogleTranslate: false,
            allowCrossOrigin: false,
            allowCorePopup: false,

            allowDownload: true,
            allowExternalDownloader: true,
            defaultDownloadPath: '',
            showDownloadCompleteDialog: undefined,
            showDownloadInformation: undefined,

            cloudFlare: false,
            off: false,
            show: setting.show === true ? true : false,
            alwaysOnTop: false,
            skipTaskbar: setting.skipTaskbar || false,
            resizable: true,
            width: bounds.width / 1.5,
            height: bounds.height / 1.5,
            x: 0,
            y: 0,
            minWidth: 280,
            minHeight: 200,
            fullscreenable: true,
            title: 'New Window',
            backgroundColor: setting.backgroundColor || (browserApp.theme == 'light' ? '#ffffff' : '#07111f'),
            color: setting.color || (browserApp.theme == 'light' ? '#07111f' : '#ffffff'),
            icon: browserApp.coreData.icon,
            frame: true,
            autoHideMenuBar: true,
            enableLargerThanScreen: true,
            hasShadow: false,
            roundedCorners: false,
            webPreferences: {
                backgroundThrottling: false, // play videos and timers in background windows
                defaultEncoding: 'UTF8',
                enableRemoteModule: false,
                devTools: true,
                spellcheck: false,
                contextIsolation: setting.contextIsolation ?? false, // false -> can access preload window functions

                javascript: true,
                nativeWindowOpen: false,
                nodeIntegration: false,
                nodeIntegrationInSubFrames: true, // google login error
                nodeIntegrationInWorker: false,
                // experimentalCanvasFeatures: true,
                // experimentalFeatures: true,
                // enableBlinkFeatures: 'ExecutionContext',
                navigateOnDragDrop: setting.windowType.contains('view|popup') ? true : false,
                webSecurity: true,
                allowRunningInsecureContent: false,
                plugins: true,
                ...setting.webPreferences,
                partition: setting.partition,
                preload: setting.preload,
            },
        };

        delete setting.webPreferences;

        if (setting.windowType === 'main') {
            setting.show = true;
            setting.frame = false;
            setting.transparent = false;
            defaultSetting.webPreferences.nodeIntegration = true;
            defaultSetting.webPreferences.nodeIntegrationInWorker = true;
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
        } else if (setting.windowType === 'youtube') {
            // setting.url = 'browser://youtube-view?url=' + setting.url;
            // setting.iframe = false;
            setting.show = true;
            setting.alwaysOnTop = true;
            setting.width = 550;
            setting.height = 330;
            setting.x = browserApp.mainWindowDataMessage?.screen.bounds.width - 550;
            setting.y = browserApp.mainWindowDataMessage?.screen.bounds.height - 380;
            setting.center = false;
            // setting.sandbox = false;
            // defaultSetting.webPreferences.allowRunningInsecureContent = true;
            // defaultSetting.webPreferences.webSecurity = false;
        } else if (setting.windowType.like('*popup*')) {
            setting.frame = true;
            setting.transparent = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.transparent = false;
        } else if (setting.windowType === 'view') {
            defaultSetting.show = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.frame = false;
            defaultSetting.transparent = false;
            defaultSetting.hasShadow = true;
            defaultSetting.resizable = false;
        } else if (setting.windowType === 'addressbar') {
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = false;
            defaultSetting.frame = false;
            defaultSetting.fullscreenable = false;
            defaultSetting.allowAudio = false;
        } else if (setting.windowType === 'profiles') {
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = false;
            defaultSetting.fullscreenable = false;
            defaultSetting.frame = false;
            defaultSetting.allowAudio = false;
        } else if (setting.windowType === 'updates') {
            defaultSetting.sandbox = false;
            setting.transparent = false;
            setting.sandbox = false;
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = true;
            defaultSetting.frame = true;
            defaultSetting.allowAudio = false;
            defaultSetting.center = true;
        } else if (setting.windowType === 'none') {
            setting.frame = true;
            setting.transparent = false;
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = true;
            defaultSetting.allowAudio = false;
            defaultSetting.center = true;
        } else {
            setting.frame = true;
            setting.transparent = false;
        }

        if (setting.show === false) {
            defaultSetting.show = false;
        }
        if (setting.alwaysOnTop === false) {
            defaultSetting.alwaysOnTop = false;
        }
        if (setting.trusted === true) {
            defaultSetting.webPreferences.nodeIntegration = true;
            defaultSetting.webPreferences.nodeIntegrationInWorker = true;
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
            setting.sandbox = false;
        }

        if (setting.eval) {
            setting.sandbox = false;
        }

        if (setting.sandbox === false) {
            defaultSetting.webPreferences.sandbox = false;
        } else {
            defaultSetting.webPreferences.sandbox = defaultSetting.sandbox;
        }

        if (setting.security === false) {
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
        }

        if ((handleCookies = true)) {
            let domainName = browserApp.newURL(setting.url.replace('blob:', '')).hostname?.split('.') || ['domainName', 'com'];
            domainName = domainName.slice(domainName.length - 2).join('.');

            if (Array.isArray(setting.cookieList) && setting.cookieList.length > 0) {
                setting.cookieList.forEach((cookieObject, index) => {
                    setting.cookieList[index].domain = setting.cookieList[index].domain || domainName;
                    setting.cookieList[index].partition = setting.cookieList[index].partition || setting.partition;
                });
            }

            if (setting.cookieObject) {
                setting.cookieList = [];
                setting.cookieObject.domain = setting.cookieObject.domain || domainName;
                setting.cookieObject.partition = setting.cookieObject.partition || setting.partition;
                setting.cookieObject.mode = setting.cookieObject.mode || 0;
                setting.cookieList.push(setting.cookieObject);
            }

            if (setting.cookie) {
                setting.cookieList = [];
                let cookieObject = { cookie: setting.cookie, mode: 0 };
                cookieObject.domain = domainName;
                cookieObject.partition = setting.partition;
                setting.cookieList.push(cookieObject);
            }

            if (Array.isArray(setting.cookies) && setting.cookies.length > 0) {
                setting.cookies.forEach((cookie) => {
                    const scheme = cookie.secure ? 'https' : 'http';
                    const host = cookie.domain[0] === '.' ? cookie.domain.substr(1) : cookie.domain;
                    cookie.url = cookie.url || scheme + '://' + host + cookie.path;
                    browserApp.electron.session
                        .fromPartition(setting.partition)
                        .cookies.set(cookie)
                        .then(() => {
                            browserApp.log('Cookie Added', setting.partition, cookie);
                        })
                        .catch((error) => {
                            browserApp.log(error);
                        });
                });
            }
        }

        let customSetting = { ...defaultSetting, ...setting };

        customSetting.$cloudFlare = customSetting.cloudFlare;

        if (customSetting.iframe === false) {
            customSetting.webPreferences.nodeIntegrationInSubFrames = false;
        }

        customSetting.webPreferences.javascript = customSetting.allowJavascript;
        customSetting.webPreferences.webaudio = customSetting.allowAudio;

        customSetting.loading_icon = 'browser://images/loading.gif';
        customSetting.iconErrorURL = 'browser://images/no.jpg';

        if (customSetting.vip) {
            customSetting.allowSaveUrls = false;
            customSetting.allowSaveUserData = false;
        }

        let parentWindow = null;
        if (customSetting.parentWindowID) {
            parentWindow = browserApp.electron.BrowserWindow.fromId(customSetting.parentWindowID);
        }

        let win = new browserApp.electron.BrowserWindow({ ...customSetting, parent: parentWindow });

        if ((customFunctions = true)) {
            win.injectHTML = function (htmlString) {
                win.webContents.executeJavaScript(`document.body.insertAdjacentHTML('beforeend', \`${htmlString}\`);`).catch((err) => {
                    browserApp.log(err);
                });
                return true;
            };
            win.injectCSS = function (css) {
                win.webContents.insertCSS(css).catch((err) => {
                    browserApp.log(err);
                });
                return true;
            };
            win.injectJS = function (js) {
                if (typeof js === 'function') {
                    js = js.toString();
                    js = js.slice(js.indexOf('{') + 1, js.lastIndexOf('}'));
                }
                win.webContents.executeJavaScript(js).catch((err) => {
                    browserApp.log(err);
                });
                return true;
            };

            win.webContents.on('did-frame-finish-load', (event, isMainFrame, frameProcessId, frameRoutingId) => {
                //  win.injectCSS(browserApp.coreData.injectedCSS);
                // const frame = browserApp.electron.webFrameMain.fromId(frameProcessId, frameRoutingId)
                //   frame.executeJavaScript(`document.body.insertAdjacentHTML('beforeend', \`${browserApp.coreData.injectedHTML}\`);`).catch((err) => {
                //     browserApp.log(err);
                // });
            });
        }

        customSetting.windowID = win.id;
        win.customSetting = customSetting;
        win.customSetting.windowSetting = win.customSetting.windowSetting || [];

        win.customSetting.session = win.customSetting.session ||
            browserApp.coreData.var.session_list.find((s) => s.name == win.customSetting.partition) || {
                name: win.customSetting.partition,
                display: win.customSetting.user_name || win.customSetting.partition,
            };

        if (win.customSetting.vpc) {
            win.customSetting.session.privacy = {
                allowVPC: true,
                vpc: win.customSetting.vpc,
            };
        }
        if (win.customSetting.userAgentURL) {
            win.customSetting.$defaultUserAgent = browserApp.coreData.var.userAgentList.find((u) => u.url == win.customSetting.userAgentURL) || { url: win.customSetting.userAgentURL };
            win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
        } else if (win.customSetting.defaultUserAgent) {
            win.customSetting.$defaultUserAgent = win.customSetting.defaultUserAgent;
            win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
        } else {
            if (win.customSetting.session && win.customSetting.session.defaultUserAgent) {
                win.customSetting.$defaultUserAgent = win.customSetting.session.defaultUserAgent;
                win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
            } else {
                win.customSetting.$defaultUserAgent = browserApp.coreData.var.core.defaultUserAgent;
                win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
            }
        }

        if (!browserApp.coreData.var.core.browser.activated && win.customSetting.windowType == 'view') {
            if (!win.customSetting.url.like('browser://*|*social*browser*|*127.0.0.1*|*localhost*')) {
                win.customSetting.url = browserApp.coreData.var.core.browser.url || 'http://127.0.0.1:60080/setting';
            }
        }

        if (win.customSetting.timeout) {
            setTimeout(() => {
                if (win && !win.isDestroyed()) {
                    win.close();
                }
            }, win.customSetting.timeout);
        }

        if (!browserApp.window) {
            browserApp.window = win;
        }

        if (win.customSetting.center) {
            win.center();
        }
        if (win.customSetting.maximize) {
            win.maximize();
        }
        if (win.customSetting.minimize) {
            win.minimize();
        }

        win.setContentProtection(win.customSetting.contentProtection || false);

        if (win.customSetting.windowType === 'main') {
            browserApp.mainWindow = win;
            win.center();
            // win.focusable = true;
            // win.fullScreenable = false;
        } else if (win.customSetting.windowType === 'view') {
            if (browserApp.speedMode) {
                if (!browserApp.currentView) {
                    browserApp.currentView = win.customSetting;
                }

                if ((mainWindow = browserApp.mainWindow)) {
                    let bounds = mainWindow.getBounds();
                    let new_bounds = {
                        x: mainWindow.isMaximized() ? bounds.x + browserApp.offset.x : bounds.x,
                        y: mainWindow.isMaximized() ? bounds.y + browserApp.offset.y : bounds.y + browserApp.offset.y2,
                        width: mainWindow.isMaximized() ? bounds.width - browserApp.offset.width : bounds.width - browserApp.offset.width2,
                        height: mainWindow.isMaximized() ? bounds.height - browserApp.offset.height : bounds.height - browserApp.offset.height2,
                    };
                    win.setBounds(new_bounds);
                }
            } else {
                if ((mainWindow = browserApp.mainWindowDataMessage?.mainWindow)) {
                    let bounds = mainWindow.bounds;
                    let new_bounds = {
                        x: mainWindow.isMaximized ? bounds.x + browserApp.offset.x : bounds.x,
                        y: mainWindow.isMaximized ? bounds.y + browserApp.offset.y : bounds.y + browserApp.offset.y2,
                        width: mainWindow.isMaximized ? bounds.width - browserApp.offset.width : bounds.width - browserApp.offset.width2,
                        height: mainWindow.isMaximized ? bounds.height - browserApp.offset.height : bounds.height - browserApp.offset.height2,
                    };

                    win.setBounds(new_bounds);
                }
            }
        }

        if (win.customSetting.trackingID) {
            browserApp.sendMessage({ type: '[tracking-info]', trackingID: win.customSetting.trackingID, windowID: win.id, created: true });
        }

        win.webContents.audioMuted = !win.customSetting.allowAudio;
        win.customSetting.title = win.customSetting.title || win.customSetting.url;

        win.once('ready-to-show', async function () {
            browserApp.updateTab(win);
            if (win.customSetting.showDevTools) {
                win.openDevTools();
            }
            if (win.customSetting.windowType === 'main') {
                win.show();

                await browserApp.showAddressbarWindow({}, false);
                await browserApp.showProfilesWindow(false);
                win.webContents.send('[open new tab]', win.customSetting.newTabData);
            } else if (win.customSetting.windowType === 'view') {
                browserApp.updateTab(win);

                browserApp.sendMessage({
                    type: '[request-main-window-data]',
                });
                if (win.customSetting.allowSaveUrls) {
                    browserApp.sendMessage({
                        type: '[add-window-url]',
                        url: browserApp.decodeURI(win.getURL()),
                        title: win.getTitle(),
                        logo: win.customSetting.favicon,
                    });
                }
            } else if (win.customSetting.windowType === 'none') {
                win.close();
            }
        });

        win.setMenuBarVisibility(false);

        if ((proxy = browserApp.handleProxy(win.customSetting.proxy))) {
            await browserApp.changeProxy(proxy, win.customSetting.partition);
        } else {
            await browserApp.handleSession({ name: win.customSetting.partition });
        }

        win.on('blur', function () {
            if (win.customSetting.windowType == 'addressbar' || win.customSetting.windowType == 'profiles') {
                win.hide();
            }
        });

        if (win.customSetting.windowType === 'main') {
            browserApp.shareMainWindowData(win);
        }

        function sendCurrentData() {
            if (win.customSetting.windowType === 'main') {
                browserApp.allowShareMainWindowData = true;
            }
        }
        win.on('move', function () {
            sendCurrentData();
        });
        win.on('resize', function () {
            sendCurrentData();
        });

        win.on('restore', function () {
            sendCurrentData();
        });
        win.on('minimize', function () {
            sendCurrentData();
        });
        win.on('unmaximize', function () {
            sendCurrentData();
        });
        win.on('maximize', function () {
            sendCurrentData();
        });
        win.on('hide', function () {
            sendCurrentData();
        });
        win.on('show', function () {
            sendCurrentData();
        });
        win.on('focus', function () {
            sendCurrentData();
        });

        win.webContents.on('will-prevent-unload', async (event) => {
            event.preventDefault();

            // if (win.customSetting.windowType == 'view') {
            //     const choice = await browserApp.electron.dialog.showMessageBox(win, {
            //         type: 'question',
            //         buttons: ['Leave', 'Stay'],
            //         title: 'Do you want to leave this site?',
            //         message: 'Changes you made may not be saved.',
            //         defaultId: 0,
            //         cancelId: 1,
            //     });
            //     console.log(choice);
            //     if (choice.response === 0) {
            //         event.preventDefault();
            //         console.log('will leave ........');
            //         event.returnValue = true;
            //     }
            // } else {
            //     event.preventDefault();
            // }
        });

        win.on('close', (e) => {
            // can be cancel here
            if (win.customSetting.trackingID) {
                browserApp.sendMessage({ type: '[tracking-info]', trackingID: win.customSetting.trackingID, windowID: win.id, isClosed: true });
            }

            browserApp.getAllWindows().forEach((win2) => {
                if (win2 && win2.customSetting && win2.customSetting.parentWindowID == win.id && !win2.isDestroyed()) {
                    win2.close();
                }
            });

            setTimeout(() => {
                if (win && !win.isDestroyed()) {
                    win.destroy();
                }
            }, 1000);
        });

        win.on('closed', () => {
            // win = null;
        });

        win.on('app-command', (e, cmd) => {
            // Navigate the window back when the user hits their mouse back button
            // APPCOMMAND_BROWSER_BACKWARD converted to browser-backward
            if (cmd === 'browser-backward' && win.webContents.navigationHistory.canGoBack()) {
                win.webContents.navigationHistory.goBack();
            } else if (cmd === 'browser-forward' && win.webContents.navigationHistory.canGoForward()) {
                win.webContents.navigationHistory.goForward();
            }
        });

        win.on('enter-full-screen', (e) => {
            setTimeout(() => {
                browserApp.handleWindowBounds();
            }, 100);

            setTimeout(() => {
                if (win && !win.isDestroyed()) {
                    win.show();
                    setTimeout(() => {
                        win.setAlwaysOnTop(true);
                        win.show();
                    }, 20);
                }
            }, 200);
        });
        win.on('leave-full-screen', (e) => {
            setTimeout(() => {
                browserApp.handleWindowBounds();
                if (win && !win.isDestroyed()) {
                    win.show();

                    win.setAlwaysOnTop(win.customSetting.alwaysOnTop);
                }
            }, 100);
        });
        win.on('enter-html-full-screen', (e) => {
            setTimeout(() => {
                browserApp.handleWindowBounds();
            }, 100);

            setTimeout(() => {
                if (win && !win.isDestroyed()) {
                    win.show();
                    setTimeout(() => {
                        win.setAlwaysOnTop(true);
                        win.show();
                    }, 20);
                }
            }, 200);
        });
        win.on('leave-html-full-screen', (e) => {
            setTimeout(() => {
                browserApp.handleWindowBounds();
                if (win && !win.isDestroyed()) {
                    win.setAlwaysOnTop(win.customSetting.alwaysOnTop);
                    win.show();
                }
            }, 100);
        });

        win.webContents.on('login2', (event, details, authInfo, callback) => {
            console.log('webContents login', authInfo);

            if (authInfo.isProxy) {
                let proxy = undefined;
                proxy = win.customSetting.proxy;
                if (proxy && proxy.username && proxy.password) {
                    event.preventDefault();
                    callback(proxy.username, proxy.password);
                    browserApp.log(proxy);
                    return;
                }

                let index2 = browserApp.coreData.var.session_list.findIndex((s) => s.name == win.customSetting.partition && s.proxy && s.proxyEnabled);

                if (index2 !== -1) {
                    proxy = browserApp.coreData.var.session_list[index2].proxy;
                    if (proxy && proxy.username && proxy.password) {
                        event.preventDefault();
                        callback(proxy.username, proxy.password);
                        browserApp.log(proxy);
                        return;
                    }
                }

                let index3 = browserApp.coreData.var.proxy_list.findIndex((p) => p.ip == authInfo.host);
                if (index3 !== -1) {
                    proxy = browserApp.coreData.var.proxy_list[index3];
                    if (proxy && proxy.username && proxy.password) {
                        event.preventDefault();
                        callback(proxy.username, proxy.password);
                        browserApp.log(proxy);
                        return;
                    }
                }
            } else {
                //code here
            }
        });

        win.on('system-context-menu', (event, point) => {
            // event.preventDefault();
        });

        win.webContents.on('context-menu', (event, params) => {
            event.preventDefault();

            if (win && !win.isDestroyed()) {
                win.webContents.send('context-menu', params);
                return;
            }

            const menu = new browserApp.electron.Menu();

            // Add each spelling suggestion
            for (const suggestion of params.dictionarySuggestions) {
                event.preventDefault();
                menu.append(
                    new browserApp.electron.MenuItem({
                        label: suggestion,
                        click: () => win.webContents.replaceMisspelling(suggestion),
                    }),
                );
            }

            // Allow users to add the misspelled word to the dictionary
            if (params.misspelledWord) {
                menu.append(
                    new browserApp.electron.MenuItem({
                        label: 'Add to dictionary',
                        click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
                    }),
                );
            }

            menu.append(
                new browserApp.electron.MenuItem({
                    label: 'Refresh',
                    click: () => win.webContents.reload(),
                }),
            );
            menu.append(
                new browserApp.electron.MenuItem({
                    type: 'separator',
                }),
            );
            menu.append(
                new browserApp.electron.MenuItem({
                    label: 'Developer Tools',
                    click: () => win.openDevTools(),
                }),
            );

            menu.popup();
        });

        win.webContents.on('before-input-event', (event, input) => {
            //  console.log('input : ' , input);
            // For example, only enable application menu keyboard shortcuts when
            // Ctrl/Cmd are down.
            // if (win && !win.isDestroyed()) {
            //   win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);
            // }
        });

        win.on('page-title-updated', (e, title) => {
            win.customSetting.title = title;
            browserApp.updateTab(win);
            if (win.customSetting.allowSaveUrls) {
                browserApp.sendMessage({
                    type: '[add-window-url]',
                    url: browserApp.decodeURI(win.getURL()),
                    title: title,
                    logo: win.customSetting.favicon,
                    ignoreCounted: true,
                });
            }
        });

        win.webContents.on('page-favicon-updated', (e, urls) => {
            let iconURL = urls.pop();
            if (iconURL) {
                win.customSetting.iconURL = iconURL;
                win.customSetting.favicon = iconURL;
                browserApp.updateTab(win);
                if (win.customSetting.allowSaveUrls) {
                    browserApp.sendMessage({
                        type: '[add-window-url]',
                        url: browserApp.decodeURI(win.getURL()),
                        title: win.getTitle(),
                        logo: win.customSetting.favicon,
                        ignoreCounted: true,
                    });
                }
            }
        });

        win.webContents.on('did-start-loading', () => {
            win.customSetting.iconURL = win.customSetting.loading_icon;
            browserApp.updateTab(win);
        });
        win.webContents.on('did-stop-loading', () => {
            win.customSetting.iconURL = win.customSetting.favicon;
            browserApp.updateTab(win);
        });
        win.webContents.on('did-finish-load', () => {
            win.customSetting.iconURL = win.customSetting.favicon;
            browserApp.updateTab(win);
        });
        win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) => {
            event.preventDefault();
            if (isMainFrame && validatedURL == win.getURL()) {
                if (browserApp.coreData.var.blocking.removeProxyOnLoadingError && win.customSetting.proxy) {
                    browserApp.sendMessage({
                        type: '[remove-proxy]',
                        proxy: win.customSetting.proxy,
                    });
                }

                if (win.customSetting.windowType.like('*popup*')) {
                    if (win.customSetting.proxy && browserApp.coreData.var.blocking.closeWindowOnProxyLoadingError) {
                        return win.close();
                    }
                } else {
                    win.customSetting.iconURL = win.customSetting.iconErrorURL;
                }
            }
            browserApp.updateTab(win);
        });

        win.webContents.on('update-target-url', (e, url) => {
            if (win && !win.isDestroyed()) {
                win.webContents.send('[send-render-message]', {
                    name: 'update-target-url',
                    url: browserApp.decodeURI(url),
                });
            }
        });

        win.webContents.on('frame-created', (e, details) => {
            if (details.frame) {
                const frameToken = details.frame.frameToken;
                const processId = details.frame.processId;
                details.frame.on('dom-ready', (e) => {
                    const frame = browserApp.electron.webFrameMain.fromFrameToken(processId, frameToken);
                    if (frame && !frame.isDestroyed()) {
                        frame.send('[dom-ready]');
                    } else {
                        browserApp.log('Frame Not Exists : ' + frameToken);
                    }
                });
            }
        });

        win.webContents.on('dom-ready', (e) => {
            browserApp.updateTab(win);
            if (win.customSetting.loadTimeoutID) {
                clearTimeout(win.customSetting.loadTimeoutID);
                win.customSetting.loadTimeoutID = undefined;
            }
            if (win.customSetting.trackingID) {
                browserApp.sendMessage({ type: '[tracking-info]', trackingID: win.customSetting.trackingID, windowID: win.id, loaded: true });
            }
            if (win && !win.isDestroyed()) {
                // win.setBounds({ width: win.getBounds().width + 1 });
                // win.setBounds({ width: win.getBounds().width - 1 });

                if (win.customSetting.allowSaveUrls) {
                    browserApp.sendMessage({
                        type: '[add-window-url]',
                        url: browserApp.decodeURI(win.getURL()),
                        title: win.getTitle(),
                        logo: win.customSetting.favicon,
                    });
                }
            }
        });

        win.on('unresponsive', async () => {
            browserApp.log('window unresponsive');
            win.customSetting.unresponsive = true;
            if (win.customSetting.windowType.like('*popup*')) {
                let timeout = win.customSetting.$cloudFlare ? 1000 : 1000 * 15;
                setTimeout(() => {
                    if (win && !win.isDestroyed() && win.customSetting.unresponsive) {
                        win.webContents.forcefullyCrashRenderer();
                        win.webContents.reload();
                    }
                }, timeout);
            }
        });
        win.on('responsive', async () => {
            win.customSetting.unresponsive = false;
        });
        win.on('session-end', async () => {
            if (win && !win.isDestroyed()) {
                win.destroy();
            }
        });
        win.webContents.on('render-process-gone', (e, details) => {
            browserApp.log('render-process-gone');
            // win.customSetting.reloadCount = win.customSetting.reloadCount || 0;
            // win.customSetting.reloadCount++;
            // if (win.customSetting.reloadCount < 3) {
            //     if (win && !win.isDestroyed()) {
            //         win.webContents.forcefullyCrashRenderer();
            //         win.webContents.reload();
            //     }
            // }
        });

        win.webContents.on('did-start-navigation', (e) => {
            if (e.url.like('data:*|about:*|chrome:*|file:*|devtools:*')) {
                return;
            }
            console.log('did-start-navigation : MainFrame=' + e.isMainFrame + ' : ' + e.url);

            browserApp.handleCustomSeting(e.url, win, e.isMainFrame);
        });
        win.webContents.on('will-redirect', async (e) => {
            let url = e.url;

            browserApp.log('will-redirect : ', url);
            browserApp.handleCustomSeting(url, win, e.isMainFrame);

            if ((redirectTruestedWindow = true)) {
                if (
                    url.like('javascript:*|*accounts.google*|*account.facebook*|*login.microsoft*|*appleid.apple*') &&
                    e.isMainFrame &&
                    win.customSetting.windowType === 'view'
                ) {
                    e.preventDefault();
                    let old_customeSetting = { ...win.customSetting };

                    delete old_customeSetting.$defaultUserAgent;
                    delete old_customeSetting.defaultUserAgent;
                    delete old_customeSetting.userAgentURL;
                    delete old_customeSetting.$userAgentURL;

                    let newWin = await browserApp.createNewWindow({
                        old_customeSetting,
                        parentWindowID: win.id,
                        defaultUserAgent: {
                            url: 'Mozilla/5.0 (MacIntel) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.2038.57  Safari/537.36',
                            device: {
                                name: 'PC',
                            },
                            engine: { name: 'Opera' },
                            platform: 'MacIntel',
                            vendor: 'Apple Computer, Inc.',
                            name: 'Opera PC MacIntel',
                        },
                        webPreferences: undefined,
                        iframe: true, // Must , if not set will be unsafty browser
                        skipTaskbar: false,
                        windowType: 'popup',
                        alwaysOnTop: true,
                        resizable: true,
                        show: win.customSetting.windowType == 'view' ? true : win.isVisible(),
                        width: undefined,
                        height: undefined,
                        x: undefined,
                        y: undefined,
                        url: url,
                    });

                    newWin.on('close', (e) => {
                        if (win && !win.isDestroyed()) {
                            win.loadURL(newWin.getURL());
                        }
                    });

                    return;
                }
            }

            if ((!win.customSetting.allowAds && !browserApp.isAllowURL(url)) || !win.customSetting.allowRedirect) {
                e.preventDefault();
                browserApp.log('Block-redirect', url);
                win.webContents.send('[show-user-message]', { message: 'Blocked Redirect URL <p><a>' + url + '</a></p>' });
            }

            if (win.customSetting.allowSelfRedirect && (win.getURL().contains(browserApp.newURL(url).hostname) || url.contains(browserApp.newURL(win.getURL()).hostname))) {
                return;
            }

            if ((info = browserApp.getOverwriteInfo(url))) {
                if (info.overwrite) {
                    if (win && !win.isDestroyed()) {
                        e.preventDefault();
                        win.loadURL(info.new_url);
                    }
                }
            }
        });
        win.webContents.on('will-navigate', (e) => {
            browserApp.log('will-navigate : ' + e.url);
            win.customSetting.title = e.url;
            win.customSetting.iconURL = win.customSetting.loading_icon;
            browserApp.handleCustomSeting(e.url, win, e.isMainFrame);
        });

        win.webContents.on('will-frame-navigate', (e) => {
            if (!win.customSetting.urlList.some((u) => e.url == u.url)) {
                win.customSetting.urlList.push({ url: e.url });
            }

            browserApp.log('will-frame-navigate : ' + e.url);

            if (e.url.like('*.user.js') && e.isMainFrame) {
                win.webContents.send('[install-user.js]', { url: e.url });
                e.preventDefault();
                return false;
            }

            if (browserApp.handleCustomSeting(e.url, win, e.isMainFrame) === false) {
                e.preventDefault();
                return false;
            }

            if (!e.url.like('http*|data*|about*|browser*|file*|chrome*|blob*|ws*|wss*')) {
                e.preventDefault();
                if (win.customSetting.allowOpenExternal) {
                    browserApp.openExternal(e.url);
                    win.webContents.send('[show-user-message]', { message: 'Open External URL  <p><a>' + e.url + '</a></p>' });
                } else {
                    win.webContents.send('[show-user-message]', { message: 'Open External URL  <p><a>' + e.url + '</a></p>' });
                }
                return;
            }

            if (!win.customSetting.allowRedirect || (!win.customSetting.allowAds && !browserApp.isAllowURL(e.url))) {
                e.preventDefault();
                win.webContents.send('[show-user-message]', { message: 'Blocked URL : <p><a>' + e.url + '</a></p>' });
                browserApp.log('Block-frame-navigate', e.url);
                return;
            }

            if (e.isMainFrame) {
                if (win.customSetting.loadTimeout) {
                    win.customSetting.loadTimeoutID = setTimeout(() => {
                        if (win && !win.isDestroyed()) {
                            browserApp.sendMessage({ type: '[tracking-info]', trackingID: win.customSetting.trackingID, windowID: win.id, loadTimeoutError: true });
                            win.close();
                        }
                    }, win.customSetting.loadTimeout);
                }
            }
        });

        if (win.webContents.setWindowOpenHandler) {
            // handle window.open ...
            win.webContents.setWindowOpenHandler(({ url, frameName, features, disposition, referrer, postBody }) => {
                browserApp.log('try setWindowOpenHandler : ' + url);

                if (url.like('ftp*|mail*')) {
                    if (win.customSetting.allowOpenExternal) {
                        browserApp.openExternal(url);
                    }
                    return { action: 'deny' };
                }

                if (url.like('https://www.youtube.com/watch*')) {
                    // url = 'https://www.youtube.com/embed/' + url.split('=')[1].split('&')[0];

                    browserApp.createNewWindow({
                        windowType: 'youtube',
                        alwaysOnTop: true,
                        title: 'YouTube',
                        url: url,
                        partition: win.customSetting.partition,
                        user_name: win.customSetting.user_name,
                        referrer: win.getURL(),
                    });

                    return { action: 'deny' };
                } else if (url.like('https://www.youtube.com/embed*')) {
                    browserApp.createNewWindow({
                        windowType: 'youtube',
                        alwaysOnTop: true,
                        title: 'YouTube',
                        url: url,
                        partition: win.customSetting.partition,
                        user_name: win.customSetting.user_name,
                        referrer: win.getURL(),
                    });
                    return { action: 'deny' };
                } else if (url.like('https://www.youtube.com/shorts*')) {
                    browserApp.createNewWindow({
                        url: url,
                        windowType: 'popup',
                        title: 'YouTube',
                        alwaysOnTop: true,
                        center: true,
                        width: 550,
                        height: 850,
                        show: true,
                        partition: win.customSetting.partition,
                        user_name: win.customSetting.user_name,
                        referrer: win.getURL(),
                    });
                    return { action: 'deny' };
                }

                let isPopup = false;
                if (frameName) {
                    isPopup = true;
                } else if (disposition && (disposition == 'new-window' || disposition == 'other')) {
                    isPopup = true;
                } else if (features && features.contains('width|height|top|left|popup')) {
                    isPopup = true;
                } else if (win.customSetting.windowType == 'popup') {
                    isPopup = true;
                }

                if (win.customSetting.allowSelfWindow && win.customSetting.allowRedirect) {
                    browserApp.log('load in self window', url);
                    win.loadURL(url);
                    return { action: 'deny' };
                }

                let allow = false;

                if ((newDeafultWindow = true)) {
                    if (
                        (url.like('*about:*') && browserApp.coreData.var.blocking.popup.allow_blank) ||
                        url.like('javascript:*|*accounts.google*|*account.facebook*|*login.microsoft*|*appleid.apple*')
                    ) {
                        browserApp.log('Run Default window', url);
                        return {
                            action: 'allow',
                            overrideBrowserWindowOptions: {
                                ...win.customSetting,
                                customSetting: win.customSetting,
                                parentWindowID: win.id,
                                parent: win,
                                alwaysOnTop: true,
                                skipTaskbar: false,
                                show: win.customSetting.windowType == 'view' ? true : win.isVisible(),
                                frame: true,
                                fullscreenable: false,
                                webPreferences: {
                                    defaultEncoding: 'UTF8',
                                    enableRemoteModule: false,
                                    devTools: true,
                                    spellcheck: false,
                                    sandbox: true,
                                    contextIsolation: win.customSetting.contextIsolation ?? false, // false -> can access preload window functions
                                    partition: setting.partition,
                                    preload: setting.preload,
                                    javascript: true,
                                    nativeWindowOpen: false,
                                    nodeIntegration: false,
                                    nodeIntegrationInSubFrames: false, // google login error
                                    nodeIntegrationInWorker: false,
                                    experimentalFeatures: false,
                                    experimentalCanvasFeatures: false,
                                    navigateOnDragDrop: true,
                                    webSecurity: true,
                                    allowRunningInsecureContent: false,
                                    plugins: true,
                                },
                            },
                        };
                    }
                }

                if (!allow) {
                    if (win.customSetting.allowPopup) {
                        allow = true;
                    } else {
                        let url_parser = browserApp.newURL(url);
                        let current_url_parser = browserApp.newURL(win.getURL());

                        if (!allow) {
                            allow =
                                win.customSetting.isWhiteSite || browserApp.coreData.var.blocking.white_list.some((d) => url_parser.hostname.like(d.url) || current_url_parser.hostname.like(d.url));
                        }
                        if (!allow) {
                            if (browserApp.coreData.var.blocking.popup.allow_internal && url_parser.hostname.contains(current_url_parser.hostname)) {
                                allow = true;
                            } else if (browserApp.coreData.var.blocking.popup.allow_external && !url_parser.hostname.contains(current_url_parser.hostname)) {
                                allow = true;
                            }
                        }
                        if (!allow) {
                            if (!win.customSetting.allowNewWindows || (isPopup && !win.customSetting.allowPopup) || (!win.customSetting.allowAds && !browserApp.isAllowURL(url))) {
                                browserApp.log('Block-open-window', url);
                                win.webContents.send('[show-user-message]', { message: 'Blocked Open Window <p><a>' + url + '</a></p>' });
                                return { action: 'deny' };
                            }
                        }
                    }
                }

                if (allow) {
                    if (!isPopup && win.customSetting.windowType == 'view') {
                        browserApp.sendMessage({
                            type: '[open new tab]',
                            data: {
                                ...win.customSetting,
                                url: url,
                                referrer: win.getURL(),
                            },
                        });
                    } else {
                        browserApp.createNewWindow({
                            ...win.customSetting,
                            windowType: 'popup',
                            center: true,
                            show: true,
                            modal: true,
                            parentWindowID: win.id,
                            url: url,
                            referrer: win.getURL(),
                        });
                    }
                } else {
                    browserApp.log('Not Allowed Block-open-window', url);
                }

                return { action: 'deny' };
            });

            win.webContents.on('did-create-window', (win, { url, frameName, options, disposition, referrer, postData }) => {
                browserApp.log('did-create-window', url);
                win.center();
            });
        }
        win.webContents.on('new-window', async function (event, url, frameName, disposition, options, referrer, postBody) {
            event.preventDefault();

            if (!win || win.isDestroyed()) {
                return;
            }

            let real_url = url || event.url || '';
            browserApp.log('\n new-window', real_url);
            if (real_url.like('https://www.youtube.com/watch*')) {
                // real_url = 'https://www.youtube.com/embed/' + real_url.split('=')[1].split('&')[0];

                await browserApp.createNewWindow({
                    windowType: 'youtube',
                    alwaysOnTop: true,
                    title: 'YouTube',
                    url: real_url,
                    partition: win.customSetting.partition,
                    user_name: win.customSetting.user_name,
                });

                return;
            } else if (real_url.like('https://www.youtube.com/embed*')) {
                await browserApp.createNewWindow({
                    windowType: 'youtube',
                    alwaysOnTop: true,
                    title: 'YouTube',
                    url: real_url,
                    partition: win.customSetting.partition,
                    user_name: win.customSetting.user_name,
                });
                return;
            }

            if (!win.customSetting.allowAds && !browserApp.isAllowURL(real_url)) {
                browserApp.log('Block-redirect', real_url);
                win.webContents.send('[show-user-message]', { message: 'Blocked Redirect URL  <p><a>' + real_url + '</a></p>' });
                return false;
            }

            if (real_url.like('*about:*')) {
                browserApp.log('Block-redirect', real_url);
                return false;
            }

            const loadOptions = {
                httpReferrer: referrer,
            };

            if (postBody) {
                const { data, contentType, boundary } = postBody;
                loadOptions.postData = postBody.data;
                loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
            }

            let url_parser = browserApp.newURL(real_url);
            let current_url_parser = browserApp.newURL(win.getURL());

            let allow = false;

            allow = win.customSetting.isWhiteSite || browserApp.coreData.var.blocking.white_list.find((d) => url_parser.hostname.like(d.url) || current_url_parser.hostname.like(d.url));

            if (allow) {
                browserApp.sendMessage({
                    type: '[open new tab]',
                    data: {
                        url: real_url,
                        partition: win.customSetting.partition,
                        user_name: win.customSetting.user_name,
                        options: browserApp.coreData.options,
                    },
                });
                return;
            }

            if (browserApp.coreData.var.blocking.popup.allow_internal && url_parser.hostname.contains(current_url_parser.hostname)) {
                browserApp.sendMessage({
                    type: '[open new tab]',
                    data: {
                        url: real_url,
                        partition: win.customSetting.partition,
                        user_name: win.customSetting.user_name,
                        options: browserApp.coreData.options,
                    },
                });
            } else if (browserApp.coreData.var.blocking.popup.allow_external && !url_parser.hostname.contains(current_url_parser.hostname)) {
                browserApp.sendMessage({
                    type: '[open new tab]',
                    data: {
                        url: real_url,
                        partition: win.customSetting.partition,
                        user_name: win.customSetting.user_name,
                        options: browserApp.coreData.options,
                    },
                });
            }
        });

        if (win.customSetting.url) {
            browserApp.handleCustomSeting(win.customSetting.url, win, true);
            if (browserApp.coreData.var.core.enginOFF || win.customSetting.off) {
                win.loadURL(win.customSetting.url, {
                    httpReferrer: win.customSetting.referrer || win.customSetting.referer,
                });
            } else {
                win.loadURL(win.customSetting.url, {
                    httpReferrer: win.customSetting.referrer || win.customSetting.referer,
                    userAgent: win.customSetting.$userAgentURL,
                });
            }
        }

        return win;
    };
};
