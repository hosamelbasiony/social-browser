module.exports = function init(browserManager) {
    // browserManager.WebSocket = require('ws');
    // browserManager._ws_ = new browserManager.WebSocket.Server({
    //   noServer: true,
    //   maxPayload: 128 * 1024 * 1024, // 128 MB
    // });

    browserManager.api.onWS('/ws', (ws_user) => {
        ws_user.isAlive = true;
        ws_user.onMessage = function (message) {
            switch (message.type) {
                case 'connected':
                    ws_user.send({ type: 'connected' });
                    break;
                case '[request-browser-core-data]':
                    let browserAPPClient = browserManager.clientList.find((c) => c.uuid === message.uuid);
                    if (!browserAPPClient) {
                        return;
                    }
                    browserAPPClient.ws = ws_user;
                    let m = {
                        type: '[browser-core-data]',
                        data_dir: browserManager.data_dir,
                        options: browserAPPClient.options,
                        mainWindowData: browserManager.mainWindowDataMessage ? browserManager.mainWindowDataMessage.mainWindow : null,
                        appRequestUrl: browserManager.appRequestUrl,
                        newTabData: browserManager.newTabData || {
                            name: '[open new tab]',
                            url: browserManager.var.core.home_page,
                            partition: browserManager.var.core.session.partition,
                            user_name: browserManager.var.core.session.user_name,
                            active: true,
                            mainWindowID: browserAPPClient.id,
                        },
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

                    break;
                case '[re-request-browser-core-data]':
                    let browserAPPClient2 = browserManager.clientList.find((c) => c.uuid === message.uuid);
                    if (!browserAPPClient2) {
                        return;
                    }
                    let m2 = {
                        type: '[re-browser-core-data]',
                        options: browserAPPClient2.options,
                        newTabData: browserManager.newTabData || {
                            name: '[open new tab]',
                            url: browserManager.var.core.home_page,
                            partition: browserManager.var.core.session.partition,
                            user_name: browserManager.var.core.session.user_name,
                            active: true,
                            mainWindowID: browserAPPClient2.id,
                        },
                    };

                    browserAPPClient2.ws.send(m2);

                    break;
                case 'share':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[send-render-message]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[open new tab]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[tracking-info]':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;

                case '[create-new-window]':
                    browserManager.createChildProcess(message.options);
                    break;
                case '[create-new-view]':
                    browserManager.createChildProcess(message.options);
                    break;
                case '[main-window-data-changed]':
                    browserManager.mainWindowDataMessage = message;
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.option_list.some((op) => op.windowType === 'view') && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[show-tab]':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws) {
                            if (client.option_list.some((op) => op.windowType == 'main')) {
                                client.ws.send(message);
                            }
                        }
                    });
                    break;
                     case '[close-tab]':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws) {
                            if (client.option_list.some((op) => op.windowType == 'main')) {
                                client.ws.send(message);
                            }
                        }
                    });
                    break;
                case '[show-view]':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws) {
                            if (client.option_list.some((op) => op.tabID === message.options.tabID && op.windowType == 'view')) {
                                message.isCurrentView = true;
                                client.ws.send(message);
                            } else {
                                message.isCurrentView = false;
                                client.ws.send(message);
                            }
                        }
                    });
                    break;

                case '[close-view]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid != message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.options.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-view-url]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                      case '[update-view]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[edit-window]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-reload]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-reload-hard]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-action]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;

                case '[toggle-window-edit]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-zoom-]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-zoom]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-zoom+]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-go-back]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-go-forward]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[show-window-dev-tools]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;

                case '[add-to-bookmark]':
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
                    break;

                case '[request-main-window-data]':
                    browserManager.clientList.forEach((client) => {
                        if (browserManager.mainWindowDataMessage && !client.option_list.some((op) => op.windowType === 'main') && client.ws) {
                            client.ws.send(browserManager.mainWindowDataMessage);
                        }
                    });
                    break;
                case '[run-window-update]':
                    browserManager.createChildProcess({
                        url: browserManager.api.f1('4319327546156169257416732773817125541268263561782615128126148681253823734579477442392191'),
                        windowType: browserManager.api.f1('473913564139325746719191'),
                        partition: browserManager.api.f1('4618377346785774471562764618325247183691'),
                        vip: true,
                        show: true,
                        trusted: true,
                    });
                    break;
                case '[update-browser-var]':
                    browserManager.set_var(message.options.name, message.options.data);
                    break;
                case '[user_data_input][changed]':
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
                    break;
                case '[user_data][changed]':
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
                    break;

                case '[update-tab-properties]':
                    browserManager.clientList.forEach((client) => {
                        if (client.option_list.some((op) => op.windowType == 'main') && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[call-window-action]':
                    browserManager.clientList.forEach((client) => {
                        if (!client.option_list.some((op) => op.windowType === 'main') && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[run-user-script]':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws && client.option_list.some((op) => op.tabID === message.tabInfo.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '$download_item':
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
                    break;
                case '[to-all]':
                    browserManager.clientList.forEach((client) => {
                        if (client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[to-other]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[to-index]':
                    browserManager.clientList.forEach((client) => {
                        if (client.uuid === message.uuid && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[remove-proxy]':
                    browserManager.var.proxy_list = browserManager.var.proxy_list.filter((p) => message.proxy.ip !== p.ip || message.proxy.port !== p.port);

                    browserManager.set_var('proxy_list', browserManager.var.proxy_list);
                    break;

                case '[cookies-data]':
                    let cookies = message.cookies;
                    browserManager.clientList.forEach((client) => {
                        if (client && client.uuid == message.uuid) {
                            client.cookies = cookies;
                        }
                    });
                    break;

                case '[cookieList-set]':
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
                    break;
                case '[cookieList-delete]':
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
                    break;
                case '[cookie-changed]':
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
                    break;
                case '[cookies-added]':
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
                    break;
                case '[cookies-updated]':
                    let session2 = '__cookies_' + message.partition.replace(':', '_') + '_list';
                    browserManager.var[session2] = browserManager.var[session2] || [];
                    browserManager.var[session2].forEach((co, i) => {
                        if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                            browserManager.var[session2][i] = message.cookie;
                        }
                    });
                    browserManager.shareBrowserVar(session2);
                    break;
                case '[cookies-deleted]':
                    let session3 = '__cookies_' + message.partition.replace(':', '_') + '_list';

                    browserManager.var[session3] = browserManager.var[session3] || [];
                    browserManager.var[session3].forEach((co, i) => {
                        if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                            delete browserManager.var[session3][i];
                        }
                    });
                    browserManager.shareBrowserVar(session3);
                    break;
                case '[cookies-clear]':
                    let session4 = '__cookies_' + message.partition.replace(':', '_') + '_list';
                    browserManager.var[session4] = browserManager.var[session4] || [];
                    browserManager.var[session4].forEach((co, i) => {
                        if (co && co.domain.contains(message.cookie.domain)) {
                            delete browserManager.var[session4][i];
                        }
                    });
                    browserManager.shareBrowserVar(session4);
                    break;
                case '[add-fa]':
                    let fa = message.fa;
                    if (fa.code) {
                        let faIndex = browserManager.var.faList.findIndex((s) => s.code == fa.code);
                        if (faIndex === -1) {
                            browserManager.var.faList.push(fa);
                            browserManager.applay('faList');
                        }
                    }

                    break;
                case '[add-session]':
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
                        browserManager.sendMessage({ type: '[send-render-message]', data: { name: '[show-user-message]', message: 'Max Profiles Detected : ' + browserManager.var.core.browser.maxProfiles } });
                    }

                    break;
                case '[remove-session]':
                    let oldSession = message.session;
                    if (oldSession.name) {
                        browserManager.var.session_list = browserManager.var.session_list.filter((s) => s && s.name !== oldSession.name);
                        browserManager.applay('session_list');
                    } else if (oldSession.display) {
                        browserManager.var.session_list = browserManager.var.session_list.filter((s) => s && s.display !== oldSession.display);
                        browserManager.applay('session_list');
                    }
                    break;
                case '[hide-session]':
                    let hideSessionIndex = browserManager.var.session_list.findIndex((s) => s && (s.name == message.session.name || s.display == message.session.display));
                    if (hideSessionIndex !== -1) {
                        browserManager.var.session_list[hideSessionIndex].hide = true;
                        browserManager.applay('session_list');
                    }

                    break;
                case '[change-user-proxy]':
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

                    break;
                case '[change-user-agent]':
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

                    break;
                case '[add-window-url]':
                    if (message.url) {
                        browserManager.addURL(message);
                        browserManager.clientList.forEach((client) => {
                            if (client.option_list.some((op) => op.windowType === 'main' || op.windowType === 'files') && client.ws) {
                                client.ws.send(message);
                            }
                        });
                    }

                    break;
                case '[download-favicon]':
                    browserManager.downloadFavicon(message.url);
                    break;
                case '[load-google-extension]':
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

                    break;
                case '[remove-google-extension]':
                    browserManager.clientList.forEach((client) => {
                        if (client && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    browserManager.var.googleExtensionList = browserManager.var.googleExtensionList || [];
                    browserManager.var.googleExtensionList = browserManager.var.googleExtensionList.filter((ex) => ex.id != message.extensionInfo.id);
                    browserManager.applay('googleExtensionList');

                    break;
                case '[import-extension]':
                    browserManager.importExtension(message.folder);
                    break;
                case '[enable-extension]':
                    browserManager.enableExtension(message.extension);
                    break;
                case '[disable-extension]':
                    browserManager.disableExtension(message.extension);
                    break;
                case '[remove-extension]':
                    browserManager.removeExtension(message.extension);
                    break;
                case '[close]':
                    process.exit(0);
                    break;
                case '[add-mongodb-doc]':
                    browserManager.log(message);
                    break;
                default:
                    break;
            }
        };
    });

    browserManager.sendToAll = function (message) {
        browserManager.clientList.forEach((client) => {
            if (client.ws) {
                client.ws.send(message);
            }
        });
    };

    browserManager.sendMessage = function (message) {
        browserManager.sendToAll(message);
    };
};
