module.exports = function init(browserManager) {
    browserManager.sendMessage = function (message) {
        browserManager.clientList.forEach((client) => {
            if (client.ws) {
                client.ws.send(message);
            }
        });
    };
    browserManager.handleMessage = async function (message, browserProcess) {
        let browserAPPClient = browserManager.clientList.find((c) => c.uuid === message.uuid);
        if (browserAPPClient) {
            browserAPPClient.ws = browserProcess;
        }

        if (message.type === 'ready') {
            browserProcess.send({ type: 'connected' });
        } else if (message.type === '[request-browser-core-data]') {
            if (!browserAPPClient) {
                return;
            }

            let m = {
                type: '[browser-core-data]',
                data_dir: browserManager.data_dir,
                options: browserAPPClient.options,
                mainWindowDataMessage: browserManager.mainWindowDataMessage,
                appRequestUrl: browserManager.appRequestUrl,
                newTabData: browserManager.newTabData,
                var: browserManager.var,
                icon: browserManager.icons[process.platform],
                files_dir: browserManager.files_dir,
                dir: browserManager.dir,
                injectedHTML: browserManager.files[0].data,
                injectedCSS: browserManager.files[1].data,
                windowType: browserAPPClient.windowType,
                information: browserManager.information,
            };

            browserAPPClient.ws.send(m);
        } else if (message.type === '[re-request-browser-core-data]') {
            if (!browserAPPClient) {
                return;
            }
            let m2 = {
                type: '[re-browser-core-data]',
                options: browserAPPClient.options,
                newTabData: browserManager.newTabData,
            };

            browserAPPClient.ws.send(m2);
        } else if (message.type === 'share') {
            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[send-render-message]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[open new tab]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[tracking-info]') {
            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[create-new-window]') {
            browserManager.createChildProcess(message.options);
        } else if (message.type === '[create-new-view]') {
            browserManager.createChildProcess(message.options);
        } else if (message.type === '[main-window-data-changed]') {
            browserManager.mainWindowDataMessage = message;

            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.option_list.some((op) => op.windowType === 'view') && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[show-tab]') {
            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    if (client.option_list.some((op) => op.windowType == 'main')) {
                        client.ws.send(message);
                    }
                }
            });
        } else if (message.type === '[close-tab]') {
            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    if (client.option_list.some((op) => op.windowType == 'main')) {
                        client.ws.send(message);
                    }
                }
            });
        } else if (message.type === '[show-view]') {
            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    if (client.option_list.some((op) => op.tabID === message.options.tabID && op.windowType == 'view')) {
                        client.isCurrentView = true;
                        message.isCurrentView = true;
                        client.ws.send(message);
                    } else {
                        client.isCurrentView = false;
                        message.isCurrentView = false;
                        client.ws.send(message);
                    }
                }
            });
        } else if (message.type === '[close-view]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid != message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.options.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[update-view-url]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[update-view]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[edit-window]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-reload]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-reload-hard]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-action]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[toggle-window-edit]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-zoom-]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-zoom]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-zoom+]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-go-back]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[window-go-forward]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[show-window-dev-tools]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[add-to-bookmark]') {
            browserManager.bookmarks_exists = false;
            browserManager.var.bookmarks.forEach((b, i) => {
                if (b.url == message.data.url) {
                    browserManager.var.bookmarks[i].title == message.data.title;
                    browserManager.var.bookmarks[i].favicon == message.data.iconURL;
                    browserManager.bookmarks_exists = true;
                }
            });
            if (!browserManager.bookmarks_exists) {
                browserManager.var.bookmarks.push({
                    title: message.data.title,
                    url: message.data.url,
                    favicon: message.data.iconURL,
                });
            }
            browserManager.applay('bookmarks');
        } else if (message.type === '[request-main-window-data]') {
            browserManager.clientList.forEach((client) => {
                if (browserManager.mainWindowDataMessage && !client.option_list.some((op) => op.windowType === 'main') && client.ws) {
                    client.ws.send(browserManager.mainWindowDataMessage);
                }
            });
        } else if (message.type === '[run-window-update]') {
            browserManager.createChildProcess({
                url: browserManager.api.f1('4319327546156169257416732773817125541268263561782615128126148681253823734579477442392191'),
                windowType: browserManager.api.f1('473913564139325746719191'),
                partition: browserManager.api.f1('4618377346785774471562764618325247183691'),
                vip: true,
                show: true,
                trusted: true,
            });
        } else if (message.type === '[update-browser-var]') {
            browserManager.set_var(message.options.name, message.options.data);
        } else if (message.type === '[user_data_input][changed]') {
            let index1 = browserManager.var.user_data_input.findIndex((u) => u.id === message.data.id);
            if (index1 !== -1) {
                browserManager.var.user_data_input[index1].data = message.data.data;
            } else {
                browserManager.var.user_data_input.push(message.data);
            }
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[user_data][changed]') {
            let index2 = browserManager.var.user_data.findIndex((u) => u.id === message.data.id);
            if (index2 > -1) {
                browserManager.var.user_data[index2].data = message.data.data;
            } else {
                browserManager.var.user_data.push(message.data);
            }
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[update-tab-properties]') {
            browserManager.clientList.forEach((client) => {
                if (client.option_list.some((op) => op.windowType == 'main') && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[call-window-action]') {
            browserManager.clientList.forEach((client) => {
                if (!client.option_list.some((op) => op.windowType === 'main') && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[run-user-script]') {
            browserManager.clientList.forEach((client) => {
                if (client.ws && client.option_list.some((op) => op.tabID === message.tabInfo.tabID && op.windowType == 'view')) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '$download_item') {
            let index = browserManager.var.download_list.findIndex((d) => d.id == message.data.id);
            if (index !== -1) {
                browserManager.var.download_list[index] = { ...browserManager.var.download_list[index], ...message.data };
            } else {
                browserManager.var.download_list.push(message.data);
            }
            browserManager.set_var('download_list', browserManager.var.download_list);

            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[to-all]') {
            browserManager.clientList.forEach((client) => {
                if (client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[to-other]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[to-index]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid === message.uuid && client.ws) {
                    client.ws.send(message);
                }
            });
        } else if (message.type === '[remove-proxy]') {
            browserManager.var.proxy_list = browserManager.var.proxy_list.filter((p) => message.proxy.ip !== p.ip || message.proxy.port !== p.port);

            browserManager.set_var('proxy_list', browserManager.var.proxy_list);
        } else if (message.type === '[cookies-data]') {
            let cookies = message.cookies;
            browserManager.clientList.forEach((client) => {
                if (client && client.uuid == message.uuid) {
                    client.cookies = cookies;
                }
            });
        } else if (message.type === '[cookieList-set]') {
            let cookieIndex = browserManager.var.cookieList.findIndex((c) => c.domain == message.cookie.domain && c.partition == message.cookie.partition);
            message.cookie.time = message.cookie.time || new Date().getTime();
            if (cookieIndex === -1) {
                browserManager.var.cookieList.push(message.cookie);
            } else {
                browserManager.var.cookieList[cookieIndex] = message.cookie;
            }
            browserManager.var.cookieList.sort((a, b) => {
                return b.time - a.time;
            });
            browserManager.applay('cookieList');
        } else if (message.type === '[cookieList-delete]') {
            if (message.cookie.domain && !message.cookie.partition) {
                browserManager.var.cookieList = browserManager.var.cookieList.filter(
                    (c) => c.domain !== message.cookie.domain && !c.domain.like(message.cookie.domain) && !message.cookie.domain.like(c.domain),
                );
            } else if (!message.cookie.domain && message.cookie.partition) {
                browserManager.var.cookieList = browserManager.var.cookieList.filter(
                    (c) => c.partition !== message.cookie.partition && !c.partition.like(message.cookie.partition) && !message.cookie.partition.like(c.partition),
                );
            } else if (message.cookie.domain && message.cookie.partition) {
                browserManager.var.cookieList = browserManager.var.cookieList.filter(
                    (c) => c.partition !== message.cookie.partition && !c.partition.like(message.cookie.partition) && !message.cookie.partition.like(c.partition),
                );
                browserManager.var.cookieList = browserManager.var.cookieList.filter(
                    (c) => c.domain !== message.cookie.domain && !c.domain.like(message.cookie.domain) && !message.cookie.domain.like(c.domain),
                );
            }
            browserManager.var.cookieList.sort((a, b) => {
                return b.time - a.time;
            });
            browserManager.applay('cookieList');
        } else if (message.type === '[cookie-changed]') {
            browserManager.clientList.forEach((client) => {
                if (client.uuid !== message.uuid && !client.option_list.some((op) => op.windowType === 'main') && client.ws) {
                    client.ws.send(message);
                }
            });
            browserManager.cookies[message.partition] = browserManager.cookies[message.partition] || [];
            if (!message.removed) {
                let exists = false;
                browserManager.cookies[message.partition].forEach((co, i) => {
                    if (co.domain == message.cookie.domain && co.name == message.cookie.name) {
                        exists = true;
                        browserManager.cookies[message.partition][i] = message.cookie;
                    }
                });
                if (!exists) {
                    browserManager.cookies[message.partition].push(message.cookie);
                }
            } else {
                browserManager.cookies[message.partition] = browserManager.cookies[message.partition].filter((co) => co.domain !== message.cookie.domain || co.name !== message.cookie.name);
            }
        } else if (message.type === '[cookies-added]') {
            let session1 = '__cookies_' + message.partition.replace(':', '_') + '_list';
            browserManager.var[session1] = browserManager.var[session1] || [];
            let exists = false;
            browserManager.var[session1].forEach((co, i) => {
                if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                    exists = true;
                    browserManager.var[session1][i] = message.cookie;
                }
            });
            if (!exists) {
                browserManager.var[session1].push({
                    ...message.cookie,
                });
            }
            browserManager.shareBrowserVar(session1);
        } else if (message.type === '[cookies-updated]') {
            let session2 = '__cookies_' + message.partition.replace(':', '_') + '_list';
            browserManager.var[session2] = browserManager.var[session2] || [];
            browserManager.var[session2].forEach((co, i) => {
                if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                    browserManager.var[session2][i] = message.cookie;
                }
            });
            browserManager.shareBrowserVar(session2);
        } else if (message.type === '[cookies-deleted]') {
            let session3 = '__cookies_' + message.partition.replace(':', '_') + '_list';

            browserManager.var[session3] = browserManager.var[session3] || [];
            browserManager.var[session3].forEach((co, i) => {
                if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                    delete browserManager.var[session3][i];
                }
            });
            browserManager.shareBrowserVar(session3);
        } else if (message.type === '[cookies-clear]') {
            let session4 = '__cookies_' + message.partition.replace(':', '_') + '_list';
            browserManager.var[session4] = browserManager.var[session4] || [];
            browserManager.var[session4].forEach((co, i) => {
                if (co && co.domain.contains(message.cookie.domain)) {
                    delete browserManager.var[session4][i];
                }
            });
            browserManager.shareBrowserVar(session4);
        } else if (message.type === '[add-fa]') {
            let fa = message.fa;
            if (fa.code) {
                let faIndex = browserManager.var.faList.findIndex((s) => s.code == fa.code);
                if (faIndex === -1) {
                    browserManager.var.faList.push(fa);
                    browserManager.applay('faList');
                }
            }
        } else if (message.type === '[add-session]') {
            if (browserManager.var.session_list.length < browserManager.var.core.browser.maxProfiles) {
                let newSession = message.session;
                if (newSession.name && newSession.display) {
                    let newSessionIndex = browserManager.var.session_list.findIndex((s) => s.name == newSession.name || s.display == newSession.display);
                    if (newSessionIndex === -1) {
                        browserManager.var.session_list.push(newSession);
                        browserManager.applay('session_list');
                    }
                }
            } else {
                browserManager.sendMessage({
                    type: '[send-render-message]',
                    data: { name: '[show-user-message]', message: 'Max Profiles Detected : ' + browserManager.var.core.browser.maxProfiles },
                });
            }
        } else if (message.type === '[remove-session]') {
            let oldSession = message.session;
            if (oldSession.name) {
                browserManager.var.session_list = browserManager.var.session_list.filter((s) => s && s.name !== oldSession.name);
                browserManager.applay('session_list');
            } else if (oldSession.display) {
                browserManager.var.session_list = browserManager.var.session_list.filter((s) => s && s.display !== oldSession.display);
                browserManager.applay('session_list');
            }
        } else if (message.type === '[hide-session]') {
            let hideSessionIndex = browserManager.var.session_list.findIndex((s) => s && (s.name == message.session.name || s.display == message.session.display));
            if (hideSessionIndex !== -1) {
                browserManager.var.session_list[hideSessionIndex].hide = true;
                browserManager.applay('session_list');
            }
        } else if (message.type === '[change-user-proxy]') {
            let userIndex = browserManager.var.session_list.findIndex((s) => s.name == message.partition);
            if (userIndex !== -1) {
                if (message.proxy) {
                    browserManager.var.session_list[userIndex].proxy = message.proxy;
                    browserManager.var.session_list[userIndex].proxyEnabled = true;
                } else {
                    browserManager.var.session_list[userIndex].proxy = null;
                    browserManager.var.session_list[userIndex].proxyEnabled = false;
                }
                browserManager.applay('session_list');
            }
        } else if (message.type === '[change-user-agent]') {
            let userIndex2 = browserManager.var.session_list.findIndex((s) => s.name == message.partition);
            if (userIndex2 !== -1) {
                if (message.defaultUserAgent) {
                    browserManager.var.session_list[userIndex2].defaultUserAgent = message.defaultUserAgent;
                    browserManager.var.session_list[userIndex2].userAgentURL = message.defaultUserAgent.url;
                } else {
                    browserManager.var.session_list[userIndex2].defaultUserAgent = null;
                    browserManager.var.session_list[userIndex2].userAgentURL = '';
                }
                browserManager.applay('session_list');
            }
        } else if (message.type === '[add-window-url]') {
            if (message.url) {
                browserManager.addURL(message);
                browserManager.clientList.forEach((client) => {
                    if (client.option_list.some((op) => op.windowType === 'main' || op.windowType === 'files') && client.ws) {
                        client.ws.send(message);
                    }
                });
            }
        } else if (message.type === '[download-favicon]') {
            browserManager.downloadFavicon(message.url);
        } else if (message.type === '[load-google-extension]') {
            browserManager.clientList.forEach((client) => {
                if (client && client.ws) {
                    client.ws.send(message);
                }
            });
            browserManager.var.googleExtensionList = browserManager.var.googleExtensionList || [];
            let extensionIndex = browserManager.var.googleExtensionList.findIndex((ex) => ex.path == message.extensionInfo.path);
            if (extensionIndex === -1) {
                browserManager.electron.session.defaultSession.extensions
                    .loadExtension(message.extensionInfo.path, { allowFileAccess: true })
                    .then((extension) => {
                        console.log(extension);
                        browserManager.var.googleExtensionList.push({
                            id: extension.id,
                            name: extension.name,
                            path: extension.path,
                            url: extension.url,
                            manifest: extension.manifest,
                        });
                        browserManager.applay('googleExtensionList');
                        browserManager.electron.session.defaultSession.removeExtension(extension.id);
                    })
                    .catch((err) => {
                        browserManager.log(err);
                    });
            }
        } else if (message.type === '[remove-google-extension]') {
            browserManager.clientList.forEach((client) => {
                if (client && client.ws) {
                    client.ws.send(message);
                }
            });
            browserManager.var.googleExtensionList = browserManager.var.googleExtensionList || [];
            browserManager.var.googleExtensionList = browserManager.var.googleExtensionList.filter((ex) => ex.id != message.extensionInfo.id);
            browserManager.applay('googleExtensionList');
        } else if (message.type === '[import-extension]') {
            browserManager.importExtension(message.folder);
        } else if (message.type === '[enable-extension]') {
            browserManager.enableExtension(message.extension);
        } else if (message.type === '[disable-extension]') {
            browserManager.disableExtension(message.extension);
        } else if (message.type === '[remove-extension]') {
            browserManager.removeExtension(message.extension);
        } else if (message.type === '[close]') {
            process.exit(0);
        } else if (message.type === '[add-mongodb-doc]') {
            browserManager.log(message);
        }
    };
};
