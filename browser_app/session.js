module.exports = function (browserApp) {
    browserApp.cookieList = [];
    browserApp.session_name_list = [];
    browserApp.allowSessionHandle = false;

    browserApp.changeProxy = async function (proxy, sessionName) {
        return new Promise((resolve, reject) => {
            browserApp.electron.app
                .setProxy(proxy)
                .then(() => {
                    browserApp.log(`App Session ${sessionName} Proxy Mode : ${proxy.mode} , ${proxy.proxyRules}`);
                })
                .catch((err) => {
                    browserApp.log(err);
                });
            let session = browserApp.electron.session.fromPartition(sessionName);
            session.proxy = proxy;
            session.closeAllConnections().then(() => {
                session
                    .setProxy(proxy)
                    .then(() => {
                        browserApp.log(` Session ${sessionName} Proxy Mode : ${proxy.mode} , ${proxy.proxyRules}`);
                        resolve();
                    })
                    .catch((err) => {
                        browserApp.log(err);
                        reject(err);
                    });
            });
        });
    };

    browserApp.loadGoogleExtension = function (extensionInfo) {
        console.log('Load Google Extension', extensionInfo);
        return true;
        browserApp.session_name_list.forEach((sessionInfo) => {
            let session = browserApp.electron.session.fromPartition(sessionInfo.name) || browserApp.electron.session.defaultSession;
            if (session.isPersistent()) {
                session.extensions
                    .loadExtension(extensionInfo.path, { allowFileAccess: true })
                    .then((extension) => {
                        browserApp.log(extension);
                    })
                    .catch((err) => {
                        browserApp.log(err);
                    });
            }
        });
    };
    browserApp.removeGoogleExtension = function (extension) {
        return true;
        browserApp.session_name_list.forEach((sessionInfo) => {
            let session = browserApp.electron.session.fromPartition(sessionInfo.name) || browserApp.electron.session.defaultSession;
            if (session.isPersistent()) {
                if (extension) {
                    session.extensions.removeExtension(extension.id);
                } else {
                    session.getAllExtensions().forEach((ex) => {
                        session.extensions.removeExtension(ex.id);
                    });
                }
            }
        });
    };

    browserApp.busySessionList = [];

    browserApp.handleSession = async function (sessionOptions = {}) {
        console.log('Handle Session', sessionOptions);
        let sessionUUID = browserApp.api.md5(JSON.stringify(sessionOptions));

        if (browserApp.busySessionList.some((s) => s.uuid === sessionUUID)) {
            console.log('Session Busy : ', sessionOptions);
            return;
        }
        browserApp.busySessionList.push({ uuid: sessionUUID });

        sessionOptions.name = sessionOptions.name || browserApp.partition;

        let name = sessionOptions.name;

        if (name.like('*_off')) {
            browserApp.busySessionList = browserApp.busySessionList.filter((s) => s.uuid !== sessionUUID);
            return;
        }

        let user = browserApp.coreData.var.session_list.find((s) => s.name == name) || browserApp.coreData.var.session_list.find((s) => s.name == browserApp.partition) || {};
        user.privacy = user.privacy || browserApp.coreData.var.blocking.privacy;
        user.privacy.vpc = user.privacy.vpc || {};
        if (!user.privacy.allowVPC) {
            user.privacy = browserApp.coreData.var.blocking.privacy;
        }
        user.defaultUserAgent = sessionOptions.defaultUserAgent || user.defaultUserAgent || { url: sessionOptions.userAgentURL } || {};

        if (!user.defaultUserAgent.url || user.defaultUserAgent.edit) {
            user.defaultUserAgent = { ...browserApp.coreData.var.core.defaultUserAgent, edit: true };
        }

        let ss = sessionOptions.isDefault ? browserApp.electron.session.defaultSession : browserApp.electron.session.fromPartition(name);

        ss.setUserAgent(user.defaultUserAgent.url);

        let scopeList = Object.values(ss.serviceWorkers.getAllRunning()).map((info) => info.scope);
        scopeList.forEach((scope) => {
            browserApp.workerScopeList.push(scope);
        });

        if (browserApp.coreData.var.core.autoClearCacheStorage) {
            ss.clearStorageData({
                storages: [('appcache', 'filesystem', 'shadercache', 'serviceworkers', 'cachestorage')],
            }).finally(() => {
                ss.clearCache().finally(() => {
                    ss.clearCodeCaches({}).finally(() => {
                        console.log('Session Clear All Cache : ' + name);
                    });
                });
            });
        }

        let sessionIndex = -1;
        if (sessionOptions.isDefault) {
            sessionIndex = browserApp.session_name_list.findIndex((s) => s.isDefault === true);
        } else {
            sessionIndex = browserApp.session_name_list.findIndex((s) => s.name === name);
        }

        if (sessionIndex !== -1) {
            browserApp.session_name_list[sessionIndex].user = user;
            browserApp.allowSessionHandle = false;
        } else {
            browserApp.allowSessionHandle = true;
            ss.registerPreloadScript({
                type: 'frame',
                id: 'frame-preload',
                filePath: browserApp.coreData.files_dir + '/js/preload.js',
            });

            ss.registerPreloadScript({
                type: 'service-worker',
                id: 'service-preload',
                filePath: browserApp.coreData.files_dir + '/js/preload-sw.js',
            });

            ss.serviceWorkers.on('console-message', (event, messageDetails) => {
                console.log('Got service worker message : ', messageDetails.message);
            });

            browserApp.session_name_list.push({
                name: sessionOptions.isDefault ? null : name,
                user: user,
                proxy: {},
                isDefault: sessionOptions.isDefault || false,
            });
            sessionIndex = browserApp.session_name_list.length - 1;
            // ss.setSpellCheckerLanguages(['en-US']);
            ss.allowNTLMCredentialsForDomains('*');
        }

        if ((preloads = true)) { /** for speed reading files */
            browserApp.coreData.var.preload_list.forEach((p) => {
                if (!ss.getPreloadScripts().some((pr) => pr.id === 'frame-preload_' + p.id)) {
                    ss.registerPreloadScript({
                        type: 'frame',
                        id: 'frame-preload_' + p.id,
                        filePath: p.path.replace('{dir}', browserApp.coreData.dir),
                    });
                }
            });

            ss.getPreloadScripts().forEach((pr) => {
                if (!browserApp.coreData.var.preload_list.some((p) => pr.id === 'frame-preload_' + p.id)) {
                    if (pr.id !== 'frame-preload' && pr.id !== 'service-preload') {
                        ss.unregisterPreloadScript(pr.id);
                    }
                }
            });
        }

        let proxy = null;

        if (sessionOptions.proxy) {
            proxy = sessionOptions.proxy;
        } else if (user.proxy && user.proxyEnabled) {
            proxy = user.proxy;
        } else if (browserApp.coreData.var.proxy && browserApp.coreData.var.core.proxyEnabled) {
            proxy = browserApp.coreData.var.proxy;
        }
        proxy = browserApp.handleProxy(proxy);

        if (proxy && JSON.stringify(browserApp.session_name_list[sessionIndex].proxy) !== JSON.stringify(proxy)) {
            browserApp.session_name_list[sessionIndex].proxy = proxy;
            await browserApp.changeProxy(proxy, name);
        } else if (!proxy) {
            await browserApp.changeProxy(
                {
                    mode: 'system',
                    proxyBypassRules: 'localhost,127.0.0.1,::1,192.168.*',
                },
                name,
            );
        }

        const filter = {
            urls: ['*://*/*'],
        };

        if (browserApp.allowSessionHandle === true) {
            browserApp.log(`\n\n [ Start allow Handle Session ......  ( ${name} ) ]  / ${browserApp.session_name_list.length} \n\n `);

            ss.protocol.handle('browser', browserApp.handleProtocolRequest);
            // ss.protocol.handle('https', browserApp.handleProtocolRequest);
            // ss.protocol.handle('http', browserApp.handleProtocolRequest);

            ss.setDisplayMediaRequestHandler((request, callback) => {
                callback({ video: request.frame });

                // browserApp.electron.desktopCapturer.getSources({ types: ['window', 'screen'] }).then((sources) => {
                //     callback({ video: sources[0], audio: 'loopback' });
                // });
            });

            ss.webRequest.onBeforeRequest(filter, function (details, callback) {
                let url = details.url;
                let mainURL = url;
                let win = null;
                let customSetting = {};
                let refererURL = '';
                details.requestHeaders = details.requestHeaders || {};
                let urlObject = browserApp.newURL(url);
                let mainURLObject = browserApp.newURL(mainURL);
                let domainName = urlObject.hostname.split('.');
                domainName = domainName.slice(domainName.length - 2).join('.');

                refererURL = details.requestHeaders['host'] || details.requestHeaders['origin'] || details['referrer'];

                if (!refererURL && details.webContents) {
                    refererURL = details.webContents.getURL();
                }
                if (!refererURL) {
                    refererURL = url;
                }

                if (details.webContents) {
                    win = browserApp.electron.BrowserWindow.fromWebContents(details.webContents);
                    if (win) {
                        mainURL = win.getURL();
                        mainURLObject = browserApp.newURL(mainURL);
                        customSetting = win.customSetting || {};
                        if (win.customSetting && (win.customSetting.allowRequests || win.customSetting.off || win.customSetting.enginOFF)) {
                            callback({
                                cancel: false,
                            });
                            return;
                        }
                    }
                }

                if (
                    browserApp.coreData.var.core.enginOFF ||
                    urlObject.hostname?.like('*localhost*|127.0.0.1|social-browser.com') ||
                    mainURLObject.hostname?.like('*localhost*|127.0.0.1|social-browser.com')
                ) {
                    callback({
                        cancel: false,
                    });
                    return;
                }

                // Handle Block Resources
                if ((blockResources = true)) {
                    let url2 = url.split('?')[0];
                    let query = '';
                    if (url.split('?')[1]) {
                        query += url.split('?')[1] + '&x-url=' + url.split('?')[0];
                    } else {
                        query += 'x-url=' + url;
                    }

                    if ((customSetting.blockJS || browserApp.coreData.var.blocking.blockJS) && (url2.like('*.js') || details.resourceType.like('script'))) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://js/fake.js?' + query,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });

                        return;
                    } else if ((customSetting.blockCSS || browserApp.coreData.var.blocking.blockCSS) && (url2.like('*.css') || details.resourceType.like('stylesheet'))) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://css/fake.css?' + query,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });

                        return;
                    } else if ((customSetting.blockImages || browserApp.coreData.var.blocking.blockImages) && (url2.like('*.ico|*.jpg|*.png|*.webp') || details.resourceType.like('image'))) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://images/fake.png?' + query,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });

                        return;
                    } else if ((customSetting.blockMedia || browserApp.coreData.var.blocking.blockMedia) && (url2.like('*.mp4|*.mp3|*.ts|*videoplayback') || details.resourceType.like('media'))) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockFonts || browserApp.coreData.var.blocking.blockFonts) && details.resourceType.like('font')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockXHR || browserApp.coreData.var.blocking.blockXHR) && details.resourceType.like('xhr')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockWebSocket || browserApp.coreData.var.blocking.blockWebSocket) && details.resourceType.like('webSocket')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockSubFrame || browserApp.coreData.var.blocking.blockSubFrame) && details.resourceType.like('subFrame')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockCspReport || browserApp.coreData.var.blocking.blockCspReport) && details.resourceType.like('cspReport')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockObject || browserApp.coreData.var.blocking.blockObject) && details.resourceType.like('object')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockOther || browserApp.coreData.var.blocking.blockOther) && details.resourceType.like('other')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    } else if ((customSetting.blockPing || browserApp.coreData.var.blocking.blockPing) && details.resourceType.like('ping')) {
                        callback({
                            cancel: true,
                        });
                        browserApp.sendToWindow(win, '[show-user-message]', { message: 'Block Site Resource: ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                        return;
                    }
                }

                let enginOFF = browserApp.coreData.var.blocking.vip_site_list.some((site) => site.url.length > 2 && mainURL.like(site.url));
                let isWhiteSite = browserApp.coreData.var.blocking.white_list.some((site) => site.url.length > 2 && mainURL.like(site.url));

                if (enginOFF || isWhiteSite) {
                    callback({
                        cancel: false,
                    });

                    return;
                }
                if (mainURL) {
                    if (browserApp.newURL(mainURL).hostname.like(browserApp.newURL(url).hostname)) {
                        callback({
                            cancel: false,
                        });
                        return;
                    }
                }

                if (browserApp.isWhiteURL(mainURL)) {
                    callback({
                        cancel: false,
                    });
                    return;
                }
                if (win && win.customSetting) {
                    if (win.customSetting.allowAds || win.customSetting.isWhiteSite) {
                        callback({
                            cancel: false,
                        });
                        return;
                    }

                    if (win.customSetting.blockURLs) {
                        if (url.like(win.customSetting.blockURLs) || details.resourceType.like(win.customSetting.blockURLs)) {
                            callback({
                                cancel: false,
                                redirectURL: 'browser://html/logo.html',
                            });
                            return;
                        }
                    }
                    if (win.customSetting.allowURLs) {
                        if (!url.like(win.customSetting.allowURLs) && !details.resourceType.like(win.customSetting.allowURLs)) {
                            callback({
                                cancel: false,
                                redirectURL: 'browser://html/logo.html',
                            });
                            return;
                        }
                    }
                }

                let _ss = browserApp.session_name_list.find((s) => s.name == name);
                _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};

                if ((info = browserApp.getOverwriteInfo(url))) {
                    if (info.overwrite) {
                        callback({
                            cancel: false,
                            redirectURL: info.new_url,
                        });
                        return;
                    }
                }

                if (url.indexOf('localhost') === 0) {
                    callback({
                        cancel: true,
                        redirectURL: details.url.replace('localhost', 'http://localhost'),
                    });
                    return;
                } else if (url.indexOf('127.0.0.1') === 0) {
                    callback({
                        cancel: true,
                        redirectURL: details.url.replace('127.0.0.1', 'http://127.0.0.1'),
                    });
                    return;
                }

                // return js will crach if needed request not js
                if (!browserApp.isAllowURL(url)) {
                    browserApp.log('Session Not Allow URL : ', url);

                    if (win && !win.isDestroyed() && !win.webContents.isDestroyed()) {
                        win.webContents.send('[show-user-message]', { message: 'Not Allow URL : ' + details.resourceType + ' <p><a>' + url + '</a></p>' });
                    }

                    let url2 = url.split('?')[0];
                    let query = '';
                    if (url.split('?')[1]) {
                        query += url.split('?')[1] + '&x-url=' + url.split('?')[0];
                    } else {
                        query += 'x-url=' + url;
                    }

                    if (url2.like('*.js') || details.resourceType.like('script')) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://js/fake.js?' + query,
                        });
                    } else if (url2.like('*.css') || details.resourceType.like('stylesheet')) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://css/fake.css?' + query,
                        });
                    } else if (url2.like('*.ico|*.jpg|*.jpeg|*.png|*.webp') || details.resourceType.like('image')) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://images/fake.png?' + query,
                        });
                    } else if (url2.like('*.json')) {
                        let query = '';

                        callback({
                            cancel: false,
                            redirectURL: 'browser://json/fake.json?' + query,
                        });
                    } else if (url2.like('*.html')) {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://html/fake.html?' + query,
                        });
                    } else {
                        callback({
                            cancel: false,
                            redirectURL: 'browser://txt/fake.txt?' + query,
                        });
                    }
                    return;
                }

                callback({
                    cancel: false,
                });
            });

            ss.webRequest.onBeforeSendHeaders(filter, async function (details, callback) {
                let url = details.url;
                let mainURL = url;
                let urlObject = browserApp.newURL(url);
                let win = null;
                let domainName = urlObject.hostname.split('.');
                domainName = domainName.slice(domainName.length - 2).join('.');

                let refererURL = details.requestHeaders['referrer'] || details.requestHeaders['origin'] || details.requestHeaders['host'];

                if (!refererURL && details.webContents) {
                    refererURL = details.webContents.getURL();
                }
                if (!refererURL) {
                    refererURL = url;
                }

                let refererObject = browserApp.newURL(refererURL);
                // let refererName = refererObject.hostname.split('.');
                // refererName = refererName.slice(refererName.length - 2).join('.');
                // details.requestHeaders['origin'] = details.requestHeaders['origin'] || refererURL;

                if (domainName.like(browserApp.api.f1('46788654433817652538237345794774423921684178866749183759483932524273825445787591')) || urlObject.hostname.like('*localhost*|127.0.0.1')) {
                    if (!details.requestHeaders['X-Browser']) {
                        details.requestHeaders['X-Browser'] = (browserApp.coreData.var.core.brand || 'social') + '.' + browserApp.coreData.var.core.id;
                    }
                }

                if (browserApp.coreData.var.core.enginOFF || urlObject.hostname.like('*localhost*|127.0.0.1')) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                if (details.webContents) {
                    win = browserApp.electron.BrowserWindow.fromWebContents(details.webContents);

                    if (win) {
                        mainURL = win.getURL();
                        if (win.customSetting) {
                            if (win.customSetting.off || win.customSetting.enginOFF) {
                                callback({
                                    cancel: false,
                                    requestHeaders: details.requestHeaders,
                                });
                                return;
                            }
                        }
                    }
                }

                details.requestHeaders = details.requestHeaders || {};
                let _ss = browserApp.session_name_list.find((s) => s.name == name);
                _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};
                details.requestHeaders['User-Agent'] = _ss.user.defaultUserAgent.url;

                let domainCookie = details.requestHeaders['Cookie'] || '';
                let domainCookieObject = browserApp.cookieParse(domainCookie);

                let enginOFF = browserApp.coreData.var.blocking.vip_site_list.some((site) => site.url.length > 2 && mainURL.like(site.url));
                if (enginOFF) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                if (win && win.customSetting) {
                    if (win.customSetting.$userAgentURL) {
                        details.requestHeaders['User-Agent'] = win.customSetting.$userAgentURL;
                    } else if (win.customSetting.$defaultUserAgent) {
                        details.requestHeaders['User-Agent'] = win.customSetting.$defaultUserAgent.url;
                    } else if (win.customSetting.userAgent) {
                        details.requestHeaders['User-Agent'] = win.customSetting.userAgent;
                    }

                    if (win.customSetting.headers) {
                        for (const key in win.customSetting.headers) {
                            for (const key2 in details.requestHeaders) {
                                if (key2.like(key)) {
                                    delete details.requestHeaders[key2];
                                }
                            }
                            details.requestHeaders[key] = win.customSetting.headers[key];
                        }
                    }

                    if (win.customSetting.vip) {
                        // browserApp.log('VIP Ignore cookieList');
                    } else if (Array.isArray(win.customSetting.cookieList)) {
                        if (win.customSetting.cookieList.length > 0) {
                            let cookieIndex = win.customSetting.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
                            if (cookieIndex !== -1) {
                                // Cookie Mode 0=fixed , 1=overwrite , else=default
                                if (win.customSetting.cookieList[cookieIndex].mode === 0) {
                                    domainCookieObject = { ...browserApp.cookieParse(win.customSetting.cookieList[cookieIndex].cookie) };
                                    details.requestHeaders['Cookie'] = win.customSetting.cookieList[cookieIndex].cookie;
                                } else if (win.customSetting.cookieList[cookieIndex].mode === 1) {
                                    domainCookieObject = { ...domainCookieObject, ...browserApp.cookieParse(win.customSetting.cookieList[cookieIndex].cookie) };
                                    details.requestHeaders['Cookie'] = browserApp.cookieStringify({ ...domainCookieObject });
                                } else if (win.customSetting.cookieList[cookieIndex].mode === -1) {
                                    domainCookieObject = { ...browserApp.cookieParse(win.customSetting.cookieList[cookieIndex].cookie), ...domainCookieObject };
                                    details.requestHeaders['Cookie'] = browserApp.cookieStringify({ ...domainCookieObject });
                                }
                            }
                        } else {
                            let cookieIndex = browserApp.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
                            if (cookieIndex !== -1) {
                                browserApp.cookieList.splice(cookieIndex, 1);
                            }
                        }
                    } else if (Array.isArray(browserApp.cookieList)) {
                        let cookieIndex = browserApp.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
                        if (cookieIndex === -1) {
                            if (domainName && domainCookie) {
                                let co = {
                                    partition: name,
                                    domain: domainName,
                                    cookie: domainCookie,
                                    time: new Date().getTime(),
                                };
                                let cookieDomain = domainName.split('.');
                                cookieDomain = cookieDomain[cookieDomain.length - 2] + '.' + cookieDomain[cookieDomain.length - 1];
                                browserApp.cookieList.push(co);
                                browserApp.sendMessage({
                                    type: '[cookieList-set]',
                                    cookie: co,
                                });
                            }
                        } else {
                            if (browserApp.cookieList[cookieIndex].off) {
                                console.log('Cookie OFF');
                            } else {
                                // Cookie Mode 0=fixed , 1=overwrite , else=default
                                if (browserApp.cookieList[cookieIndex].mode === 0) {
                                    domainCookieObject = { ...browserApp.cookieParse(browserApp.cookieList[cookieIndex].cookie) };
                                    details.requestHeaders['Cookie'] = browserApp.cookieList[cookieIndex].cookie;
                                } else if (browserApp.cookieList[cookieIndex].mode === 1) {
                                    domainCookieObject = { ...domainCookieObject, ...browserApp.cookieParse(browserApp.cookieList[cookieIndex].cookie) };
                                    details.requestHeaders['Cookie'] = browserApp.cookieStringify({ ...domainCookieObject });
                                } else if (browserApp.cookieList[cookieIndex].mode === -1) {
                                    domainCookieObject = { ...browserApp.cookieParse(browserApp.cookieList[cookieIndex].cookie), ...domainCookieObject };
                                    details.requestHeaders['Cookie'] = browserApp.cookieStringify({ ...domainCookieObject });
                                }

                                if (browserApp.cookieList[cookieIndex].cookie !== details.requestHeaders['Cookie']) {
                                    browserApp.cookieList[cookieIndex].cookie = details.requestHeaders['Cookie'];
                                    let cookieDomain = domainName.split('.');
                                    cookieDomain = cookieDomain[cookieDomain.length - 2] + '.' + cookieDomain[cookieDomain.length - 1];
                                    browserApp.sendMessage({
                                        type: '[cookieList-set]',
                                        cookie: browserApp.cookieList[cookieIndex],
                                    });
                                }
                            }
                        }
                    }
                }

                if (_ss.user.privacy.allowVPC && _ss.user.privacy.vpc && _ss.user.privacy.vpc.maskUserAgentURL) {
                    if (!details.requestHeaders['User-Agent'].like('*[xx-*')) {
                        let code = name;
                        code += urlObject.hostname;
                        code += browserApp.coreData.var.core.id;
                        details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') [xx-' + browserApp.api.md5(code) + '] ');
                    }
                }

                // custom header request
                browserApp.coreData.var.customHeaderList.forEach((r) => {
                    if (r.type == 'request' && url.like(r.url)) {
                        r.list.forEach((v) => {
                            if (v && v.name && v.value) {
                                delete details.requestHeaders[v.name];
                                delete details.requestHeaders[v.name.toLowerCase()];
                                details.requestHeaders[v.name] = v.value.replace('{{url}}', refererURL).replace('{{host}}', refererObject.hostname);
                            }
                        });
                        r.ignore.forEach((key) => {
                            if (key) {
                                delete details.requestHeaders[key];
                                delete details.requestHeaders[key.toLowerCase()];
                            }
                        });
                        if (r.log) {
                            browserApp.log(url, details.requestHeaders);
                        }
                    }
                });

                if (browserApp.isWhiteURL(mainURL)) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                if (browserApp.coreData.var.blocking.core.send_browser_id && !details.requestHeaders['X-Browser']) {
                    details.requestHeaders['X-Browser'] = (browserApp.coreData.var.core.brand || 'social') + '.' + browserApp.coreData.var.core.id;
                }

                if (_ss.user.privacy.vpc.dnt) {
                    details.requestHeaders['DNT'] = '1'; // dont track me
                }

                if (url.like('browser*') || url.like('*127.0.0.1*')) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                // continue loading url
                callback({
                    cancel: false,
                    requestHeaders: details.requestHeaders,
                });
            });

            ss.webRequest.onHeadersReceived(filter, function (details, callback) {
                let statusLine = details.statusLine;
                if (browserApp.coreData.var.core.enginOFF) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                        statusLine: statusLine,
                    });
                    return;
                }

                let url = details.url;
                let mainURL = url;
                let urlObject = browserApp.newURL(url);
                let _ss = browserApp.session_name_list.find((s) => s.name == name);
                _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};
                let win = null;

                // if(url.like('*fake.js*')){
                //     details.responseHeaders['Content-Length'.toLowerCase()] = 50 * 1000;
                // }

                if (details.webContents) {
                    win = browserApp.electron.BrowserWindow.fromWebContents(details.webContents);
                    if (win) {
                        mainURL = win.getURL() || mainURL;
                        if (win.customSetting && (win.customSetting.off || win.customSetting.enginOFF)) {
                            callback({
                                cancel: false,
                                responseHeaders: {
                                    ...details.responseHeaders,
                                },
                                statusLine: statusLine,
                            });
                            return;
                        }
                    }
                }
                if (details.frame && details.frame.url) {
                    mainURL = details.frame.url;
                }
                let enginOFF = browserApp.coreData.var.blocking.vip_site_list.some((site) => site.url.length > 2 && mainURL.like(site.url));
                if (enginOFF) {
                    callback({
                        cancel: false,
                        responseHeaders: {
                            ...details.responseHeaders,
                        },
                        statusLine: statusLine,
                    });
                    return;
                }

                if (win && win.customSetting) {
                    if (win.customSetting.blockURLs) {
                        if (url.like(win.customSetting.blockURLs) || details.resourceType.like(win.customSetting.blockURLs)) {
                            callback({
                                cancel: false,
                                responseHeaders: {
                                    ...details.responseHeaders,
                                },
                                statusLine: statusLine,
                            });
                            return;
                        }
                    }
                    if (win.customSetting.allowURLs) {
                        if (!url.like(win.customSetting.allowURLs) && !details.resourceType.like(win.customSetting.allowURLs)) {
                            callback({
                                cancel: false,
                                responseHeaders: {
                                    ...details.responseHeaders,
                                },
                                statusLine: statusLine,
                            });
                            return;
                        }
                    }
                }

                // custom header response
                browserApp.coreData.var.customHeaderList.forEach((r) => {
                    if (r.type == 'response' && url.like(r.url)) {
                        r.ignore.forEach((key) => {
                            if (key) {
                                delete details.responseHeaders[key];
                                delete details.responseHeaders[key.toLowerCase()];
                            }
                        });

                        r.list.forEach((v) => {
                            if (v && v.name && v.value) {
                                delete details.responseHeaders[v.name];
                                delete details.responseHeaders[v.name.toLowerCase()];
                                details.responseHeaders[v.name.toLowerCase()] = v.value;
                            }
                        });
                    }
                });

                // if (url.like('*youtube.com*')) {
                //   console.log(details.responseHeaders);
                //   delete details.responseHeaders['content-security-policy'];
                //   delete details.responseHeaders['x-frame-options'];
                // }

                // must delete values before re set
                if ((headers = true)) {
                    let a_orgin = details.responseHeaders['Access-Control-Allow-Origin'] || details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()];
                    let a_expose = details.responseHeaders['Access-Control-Expose-Headers'] || details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()];
                    let a_Methods = details.responseHeaders['Access-Control-Allow-Methods'] || details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()];
                    let a_Headers = details.responseHeaders['Access-Control-Allow-Headers'] || details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()];
                    let s_policy = details.responseHeaders['Content-Security-Policy'] || details.responseHeaders['Content-Security-Policy'.toLowerCase()];
                    let s_policy_report = details.responseHeaders['Content-Security-Policy-Report-Only'] || details.responseHeaders['content-security-policy-report-only'.toLowerCase()];
                    let s_policy_resource = details.responseHeaders['Cross-Origin-Resource-Policy'] || details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()];
                    let s_policy_opener = details.responseHeaders['Cross-Origin-Opener-Policy-Report-Only'] || details.responseHeaders['Cross-Origin-Opener-Policy-Report-Only'.toLowerCase()];

                    // Must Delete Before set new values [duplicate headers]
                    let propertyList = [
                        //'Cross-Origin-Embedder-Policy',
                        // 'Cross-Origin-Opener-Policy',
                        //  'Strict-Transport-Security',
                        // 'X-Content-Type-Options',
                        'Access-Control-Allow-Private-Network',
                        'Content-Security-Policy',
                        // 'Content-Security-Policy-Report-Only', // Error With Capatcha
                        // 'X-Content-Security-Policy',// Error With Capatcha
                        //'Cross-Origin-Resource-Policy',// Error With Capatcha
                        //'Cross-Origin-Opener-Policy-Report-Only',// Error With Capatcha
                        'Access-Control-Allow-Credentials',
                        'Access-Control-Allow-Methods',
                        'Access-Control-Allow-Headers',
                        'Access-Control-Allow-Origin',
                        'Access-Control-Expose-Headers',
                        _ss.user.privacy.vpc.removeXFrameOptions ? 'X-Frame-Options' : '',
                    ].join('|');

                    for (const key in details.responseHeaders) {
                        if (Object.hasOwn(details.responseHeaders, key) && key.contain(propertyList)) {
                            details.responseHeaders[key] = undefined;
                            delete details.responseHeaders[key];
                        }
                    }

                    details.responseHeaders['Access-Control-Allow-Private-Network'.toLowerCase()] = 'true';
                    details.responseHeaders['Access-Control-Allow-Credentials'.toLowerCase()] = 'true';

                    let mainURLobject = browserApp.newURL(mainURL);
                    details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()] =
                        a_Methods || 'POST,GET,DELETE,PUT,OPTIONS,VIEW,HEAD,CONNECT,TRACE,PROPFIND,PATCH,PROPPATCH,COPY,LOCK,UNLOCK,MKCOL,SEARCH,REPORT,MOVE';

                    details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()] =
                        a_Headers ||
                        'Upgrade-Insecure-Requests,Authorization ,Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept, Content-Length, Accept-Encoding, X-CSRF-Token';

                    details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [a_orgin || mainURLobject.protocol + '//' + mainURLobject.hostname];

                    if (win && win.customSetting && win.customSetting.allowCrossOrigin) {
                        if (details.method.like('options')) {
                            statusLine = '200';
                        }

                        details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [mainURLobject.protocol + '//' + mainURLobject.hostname];
                    }

                    if (a_expose) {
                        details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()] = a_expose;
                    }

                    if (s_policy) {
                        let pList = [
                            'default-src',
                            'script-src',
                            'script-src-elem',
                            'browserApp-src',
                            // 'frame-ancestors',
                            'frame-src',
                            'img-src',
                            'style-src',
                            'style-src-attr',
                            'style-src-elem',
                            'font-src',
                            'connect-src',
                            'media-src',
                            'object-src',
                            'worker-src',
                            'manifest-src',
                            'prefetch-src',
                        ];

                        if (Array.isArray(s_policy)) {
                            s_policy.forEach((value, key) => {
                                // if (win) {
                                //     if (s_policy[key].like('*sha256*')) {
                                //         win.customSetting.$sha256 = s_policy[key];
                                //     }
                                //     if (s_policy[key].like('*nonce*')) {
                                //         win.customSetting.$nonce = s_policy[key];
                                //     }
                                // }

                                if (!s_policy[key].contain('browser://') && !s_policy[key].contain("'none'")) {
                                    pList.forEach((p) => {
                                        if (!s_policy[key].contain('nonce-') && !s_policy[key].contain("'unsafe-inline'")) {
                                            s_policy[key] = s_policy[key].replaceAll(p + ' ', p + " browser://* 'nonce-social'");
                                        } else {
                                            s_policy[key] = s_policy[key].replaceAll(p + ' ', p + ' browser://* ');
                                        }
                                    });
                                }
                            });
                        } else if (typeof s_policy == 'string') {
                            // if (win) {
                            //     if (s_policy.like('*sha256*')) {
                            //         win.customSetting.$sha256 = s_policy;
                            //     }
                            //     if (s_policy.like('*nonce*')) {
                            //         win.customSetting.$nonce = s_policy;
                            //     }
                            // }
                            if (!s_policy.contain('browser://') && !s_policy.contain("'none'")) {
                                pList.forEach((p) => {
                                    if (!s_policy.contain('nonce-') && !s_policy.contain("'unsafe-inline'")) {
                                        s_policy = s_policy.replaceAll(p + ' ', p + " browser://* 'nonce-social'");
                                    } else {
                                        s_policy = s_policy.replaceAll(p + ' ', p + ' browser://* ');
                                    }
                                });
                            }
                        } else {
                            console.log(typeof s_policy, s_policy);
                        }
                        details.responseHeaders['Content-Security-Policy'] = s_policy;
                    }
                }

                if (browserApp.isWhiteURL(mainURL)) {
                    callback({
                        cancel: false,
                        responseHeaders: {
                            ...details.responseHeaders,
                        },
                        statusLine: statusLine,
                    });
                    return;
                }

                if ((info = browserApp.getOverwriteInfo(url))) {
                    if (url.like(info.to) && info.rediect_from) {
                        details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [mainURLobject.protocol + '//' + mainURLobject.hostname];
                    }
                }

                callback({
                    cancel: false,
                    responseHeaders: {
                        ...details.responseHeaders,
                    },
                    statusLine: statusLine,
                });
            });

            ss.webRequest.onSendHeaders(filter, function (details) {});
            ss.webRequest.onResponseStarted(filter, function (details) {});
            ss.webRequest.onBeforeRedirect(filter, function (details) {});
            ss.webRequest.onCompleted(filter, function (details) {});
            ss.webRequest.onErrorOccurred(filter, function (details) {
                console.log(details.error);
            });

            ss.setCertificateVerifyProc((request, callback) => {
                callback(0);
            });

            ss.setPermissionRequestHandler((webContents, permission, callback) => {
                if (permission === 'local-fonts') {
                    return callback(true);
                }
                if (webContents) {
                    let win = browserApp.electron.BrowserWindow.fromWebContents(webContents);
                    if (win && win.customSetting && win.customSetting.allowAllPermissions) {
                        return callback(true);
                    }
                }

                if (!browserApp.coreData.var.blocking.permissions) {
                    return callback(false);
                }
                if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*|http://localhost*|https://localhost*')) {
                    return callback(true);
                } else {
                    let allow = browserApp.coreData.var.blocking.permissions[permission] || false;
                    return callback(allow);
                }
            });
            ss.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
                if (webContents) {
                    let win = browserApp.electron.BrowserWindow.fromWebContents(webContents);
                    if (win && win.customSetting && win.customSetting.allowAllPermissions) {
                        return true;
                    }
                }

                if (!browserApp.coreData.var.blocking.permissions) {
                    return false;
                }
                if (webContents && webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*|http://localhost*|https://localhost*')) {
                    return true;
                } else {
                    let allow = browserApp.coreData.var.blocking.permissions[permission] || false;
                    return allow;
                }
            });

            ss.on('will-download', (event, item, webContents) => {
                item.showDownloadCompleteDialog = !browserApp.coreData.var.blocking.downloader.hideDownloadCompleteDialog;
                item.showDownloadInformation = !browserApp.coreData.var.blocking.downloader.hideDownloadInformation;

                if (webContents && !webContents.isDestroyed()) {
                    webContents.send('[will-download]', { url: item.getURL() });
                    let win = browserApp.electron.BrowserWindow.fromWebContents(webContents);

                    if (win) {
                        if (!win.customSetting.allowDownload) {
                            event.preventDefault();
                            browserApp.log('Download OFF');
                            return;
                        }

                        item.showDownloadCompleteDialog = win.customSetting.showDownloadCompleteDialog ?? item.showDownloadCompleteDialog;
                        item.showDownloadInformation = win.customSetting.showDownloadInformation ?? item.showDownloadInformation;
                        item.allowExternalDownloader = win.customSetting.allowExternalDownloader;

                        if (win.customSetting.defaultDownloadPath) {
                            item.setSavePath(browserApp.path.join(win.customSetting.defaultDownloadPath, item.getFilename()));
                            item.setingdefaultSavePath = true;
                        }
                    }
                }

                let dl = {
                    id: new Date().getTime(),
                    date: new Date(),
                    status: 'waiting',
                    Partition: name,
                    item: item,
                    url: item.getURL() || '',
                    canResume: item.canResume(),
                    urlChain: item.getURLChain(),
                    path: item.getSavePath(),
                    name: item.getFilename() || '',
                    mimeType: item.getMimeType() || '',
                    length: item.getTotalBytes(),
                    eTag: item.getETag(),
                    startTime: item.getStartTime(),
                    lastModified: item.getLastModifiedTime(),
                };

                if (browserApp.coreData.var.blocking.downloader.defaultDownloadPath && !item.setingdefaultSavePath) {
                    item.setSavePath(browserApp.path.join(browserApp.coreData.var.blocking.downloader.defaultDownloadPath, dl.name));
                }

                if (
                    dl.name.like('*.html|*.htm|*.js|*.css|*.json') ||
                    dl.mimeType.like('text/html|application/javascript|text/css|application/json') ||
                    dl.url.like('data*|blob*|browser*|http://127.0.0.1*|http://localhost*')
                ) {
                    item.allowExternalDownloader = false;
                }

                if (item.allowExternalDownloader) {
                    let ok = false;
                    if (browserApp.coreData.var.blocking.downloader.enabled) {
                        browserApp.coreData.var.blocking.downloader.apps.forEach((app) => {
                            if (ok) {
                                return;
                            }
                            let app_name = app.name.replace('$username', browserApp.os.userInfo().username);
                            if (browserApp.isFileExistsSync(app_name)) {
                                event.preventDefault();
                                ok = true;
                                let params = app.params.split(' ');
                                for (const i in params) {
                                    params[i] = params[i].replace('$url', decodeURI(dl.url)).replace('$file_name', dl.name);
                                }
                                browserApp.exe(app_name, params);
                                browserApp.electron.clipboard.writeText(decodeURI(dl.url));
                                return;
                            }
                        });
                    }
                    if (ok) {
                        return;
                    }
                }

                if (browserApp.coreData.var.blocking.downloader.blockDownload) {
                    event.preventDefault();
                    webContents.send('[show-user-message]', { message: 'Download Blocked <p><a>' + dl.url + '</a></p>' });
                    browserApp.log('block Download / from setting');
                    return;
                }

                browserApp.coreData.var.download_list.push(browserApp.cloneObject(dl));
                if (item.showDownloadInformation) {
                    browserApp.sendMessage({ type: '$download_item', data: dl });
                }

                browserApp.downloadingBusy = true;
                item.on('updated', (event, state) => {
                    if (!item.getSavePath()) {
                        return;
                    }
                    let index = browserApp.coreData.var.download_list.findIndex((d) => d.id == dl.id);
                    if (index !== -1) {
                        browserApp.coreData.var.download_list[index].canResume = item.canResume();
                        browserApp.coreData.var.download_list[index].urlChain = item.getURLChain();
                        browserApp.coreData.var.download_list[index].path = item.getSavePath();
                        browserApp.coreData.var.download_list[index].name = item.getFilename();
                        browserApp.coreData.var.download_list[index].mimeType = item.getMimeType();
                        browserApp.coreData.var.download_list[index].length = item.getTotalBytes();
                        browserApp.coreData.var.download_list[index].eTag = item.getETag();
                        browserApp.coreData.var.download_list[index].startTime = item.getStartTime();
                        browserApp.coreData.var.download_list[index].lastModified = item.getLastModifiedTime();

                        if (state === 'interrupted') {
                            browserApp.coreData.var.download_list[index].status = 'error';
                        } else if (state === 'progressing') {
                            browserApp.coreData.var.download_list[index].total = item.getTotalBytes();
                            browserApp.coreData.var.download_list[index].received = item.getReceivedBytes();
                            if (item.isPaused()) {
                                browserApp.coreData.var.download_list[index].status = 'paused';
                            } else {
                                browserApp.coreData.var.download_list[index].status = 'downloading';
                            }
                        }
                        browserApp.coreData.var.download_list[index] = browserApp.cloneObject(browserApp.coreData.var.download_list[index]);
                        if (item.showDownloadInformation) {
                            browserApp.sendMessage({ type: '$download_item', data: browserApp.coreData.var.download_list[index] });
                        }
                    }
                });

                item.once('done', (event, state) => {
                    browserApp.downloadingBusy = false;
                    if (!item.getSavePath()) {
                        return;
                    }
                    let index = browserApp.coreData.var.download_list.findIndex((d) => d.id == dl.id);
                    if (index !== -1) {
                        if (state === 'completed') {
                            browserApp.coreData.var.download_list[index].name = item.getFilename();
                            browserApp.coreData.var.download_list[index].type = item.getMimeType();
                            browserApp.coreData.var.download_list[index].total = item.getTotalBytes();
                            browserApp.coreData.var.download_list[index].canResume = item.canResume();
                            browserApp.coreData.var.download_list[index].received = item.getReceivedBytes();
                            browserApp.coreData.var.download_list[index].status = 'completed';
                            browserApp.coreData.var.download_list[index].path = item.getSavePath();
                            browserApp.coreData.var.download_list[index] = browserApp.cloneObject(browserApp.coreData.var.download_list[index]);
                            if (item.showDownloadInformation) {
                                browserApp.sendMessage({ type: '$download_item', data: browserApp.coreData.var.download_list[index] });
                            } else {
                                browserApp.coreData.var.download_list.splice(index, 1);
                            }
                            let _path = item.getSavePath();
                            let _url = item.getURL();
                            if (item.showDownloadCompleteDialog) {
                                browserApp.dialog
                                    .showMessageBox({
                                        title: 'Download Complete',
                                        type: 'info',
                                        buttons: ['Open File', 'Open Folder', 'Close'],
                                        message: `Saved URL \n ${_url} \n To \n ${_path} `,
                                    })
                                    .then((result) => {
                                        browserApp.shell.beep();
                                        if (result.response == 1) {
                                            browserApp.shell.showItemInFolder(_path);
                                        }
                                        if (result.response == 0) {
                                            browserApp.shell.openPath(_path);
                                        }
                                    });
                            }
                        } else {
                            browserApp.coreData.var.download_list[index].name = item.getFilename();
                            browserApp.coreData.var.download_list[index].type = item.getMimeType();
                            browserApp.coreData.var.download_list[index].total = item.getTotalBytes();
                            browserApp.coreData.var.download_list[index].canResume = item.canResume();
                            browserApp.coreData.var.download_list[index].received = item.getReceivedBytes();
                            browserApp.coreData.var.download_list[index].status = state;
                            browserApp.coreData.var.download_list[index].path = item.getSavePath();
                            browserApp.coreData.var.download_list[index] = browserApp.cloneObject(browserApp.coreData.var.download_list[index]);
                            if (item.showDownloadInformation) {
                                browserApp.sendMessage({ type: '$download_item', data: browserApp.coreData.var.download_list[index] });
                            }
                        }
                    }
                });
            });
        }
        browserApp.busySessionList = browserApp.busySessionList.filter((s) => s.uuid !== sessionUUID);
        return ss;
    };

    browserApp.sessionConfig = async (partition) => {
        await browserApp.handleSession({ name: partition || browserApp.partition });
    };
};
