module.exports = function (browserApp) {
    browserApp.handleMessage = async function (message) {
        try {
            if (message.type == 'ping') {
                browserApp.send({ type: 'pong' });
            } else if (message.type == 'connected') {
                browserApp.send({
                    type: '[request-browser-core-data]',
                });
            } else if (message.type == 're-connected') {
                browserApp.send({
                    type: '[re-request-browser-core-data]',
                });
            } else if (message.type == '[browser-core-data]') {
                if (message.mainWindowDataMessage) {
                    browserApp.mainWindowDataMessage = message.mainWindowDataMessage;
                }
                browserApp.coreData = message;
                browserApp.addOverwriteList(browserApp.coreData.var.overwrite.urls);
                browserApp.option_list.push(message.options);
                browserApp.electron.app.userAgentFallback = browserApp.coreData.var.core.defaultUserAgent.url;
                browserApp.sessionConfig(message.options.partition);

                if (browserApp.coreData.windowType == 'none') {
                } else if (browserApp.coreData.windowType == 'files') {
                    browserApp.window = null;
                } else if (browserApp.coreData.windowType == 'cookies') {
                    let ss = browserApp.electron.session.fromPartition(message.options.partition);
                    ss.cookies.get({}).then((cookies) => {
                        browserApp.send({
                            type: '[cookies-data]',
                            cookies: cookies,
                        });
                        setTimeout(() => {
                            browserApp.tryClosing();
                        }, 1000 * 5);
                    });
                } else if (browserApp.coreData.windowType == 'main') {
                    if (browserApp.mainWindow && !browserApp.mainWindow.isDestroyed()) {
                        browserApp.mainWindow.show();
                        browserApp.mainWindow.webContents.send('[open new tab]', message.newTabData);
                    } else {
                        await browserApp.createNewWindow({ ...browserApp.coreData.options, ...message.options });
                    }
                } else {
                    if (!browserApp.partition.like('*setting*|*social*|*file*')) {
                        browserApp.coreData.var['googleExtensionList']?.forEach((extensionInfo) => {
                            browserApp.loadGoogleExtension(extensionInfo);
                        });
                    }

                    await browserApp.createNewWindow({ ...message.options });
                }
            } else if (message.type == '[re-browser-core-data]') {
                browserApp.sessionConfig(message.options.partition);
                browserApp.option_list.push(message.options);

                if (message.options.windowType == 'main') {
                    if (browserApp.mainWindow && !browserApp.mainWindow.isDestroyed()) {
                        browserApp.mainWindow.show();
                        browserApp.mainWindow.webContents.send('[open new tab]', message.newTabData);
                    } else {
                        await browserApp.createNewWindow({ ...browserApp.coreData.options, ...message.options });
                    }
                } else if (message.options.windowType == 'cookies') {
                    let ss = browserApp.electron.session.fromPartition(message.options.partition);
                    ss.cookies.get({}).then((cookies) => {
                        browserApp.send({
                            type: '[cookies-data]',
                            cookies: cookies,
                        });
                    });
                } else {
                    await browserApp.createNewWindow({ ...message.options });
                }
            } else if (message.type == '[update-browser-var]') {
                if (browserApp.coreData.windowType == 'files') {
                    browserApp.set_var(message.options.name, message.options.data);
                } else {
                    browserApp.coreData.var[message.options.name] = message.options.data;
                    if (browserApp.coreData.var.core.defaultUserAgent) {
                        browserApp.electron.app.userAgentFallback = browserApp.coreData.var.core.defaultUserAgent.url;
                    }

                    if (message.options.name === 'overwrite') {
                        browserApp.addOverwriteList(browserApp.coreData.var.overwrite.urls);
                    }
                    if (message.options.name == 'core' || message.options.name == 'proxy' || message.options.name == 'session_list' || message.options.name == 'preload_list') {
                        browserApp.sessionConfig(message.options.partition);
                    }
                    if (message.options.name == 'cookieList') {
                        browserApp.cookieList = message.options.data;
                        browserApp.cookieList.sort((a, b) => {
                            return b.time - a.time;
                        });
                    }
                    browserApp.sendToAllWindows('[update-browser-var]', message);
                }
            } else if (message.type == '[user_data_input][changed]') {
                let index = browserApp.coreData.var.user_data_input.findIndex((u) => u.id === message.data.id);
                if (index > -1) {
                    browserApp.coreData.var.user_data_input[index].data = message.data.data;
                } else {
                    browserApp.coreData.var.user_data_input.push(message.data);
                }
                browserApp.sendToAllWindows('[update-browser-var]', {
                    type: '[update-browser-var]',
                    options: {
                        name: 'user_data_input',
                        data: browserApp.coreData.var.user_data_input,
                    },
                });
            } else if (message.type == '[user_data][changed]') {
                let index = browserApp.coreData.var.user_data.findIndex((u) => u.id === message.data.id);
                if (index > -1) {
                    browserApp.coreData.var.user_data[index].data = message.data.data;
                } else {
                    browserApp.coreData.var.user_data.push(message.data);
                }
                browserApp.sendToAllWindows('[update-browser-var]', {
                    type: '[update-browser-var]',
                    options: {
                        name: 'user_data',
                        data: browserApp.coreData.var.user_data,
                    },
                });
            } else if (message.type == '[load-google-extension]') {
                if (!browserApp.partition.like('*setting*|*social*|*file*')) {
                    browserApp.loadGoogleExtension(message.extensionInfo);
                }
            } else if (message.type == '[remove-google-extension]') {
                browserApp.removeGoogleExtension(message.extensionInfo);
            } else if (message.type == 'share') {
                browserApp.electron.BrowserWindow.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed()) {
                        win.webContents.send('share', message.data);
                    }
                });
            } else if (message.type == '[tracking-info]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
                        win.webContents.send('[tracking-info]', message);
                    }
                });
            } else if (message.type == '[run-user-script]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.id == message.tabInfo.windowID) {
                        browserApp.sendToWebContents(win.webContents, '[run-user-script]', message.script);
                    }
                });
            } else if (message.type == '[send-render-message]') {
                browserApp.sendToAllWindows('[send-render-message]', message.data);
            } else if (message.type == '[open new tab]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win.customSetting.windowType == 'main' && !win.isDestroyed()) {
                        win.webContents.send('[open new tab]', message.data);
                    }
                });
            } else if (message.type == '$download_item') {
                let index = browserApp.coreData.var.download_list.findIndex((dl) => dl.id == message.data.id);
                if (index !== -1) {
                    if (message.data.status == 'delete') {
                        if (browserApp.coreData.var.download_list[index].item && typeof browserApp.coreData.var.download_list[index].item.cancel === 'function') {
                            browserApp.coreData.var.download_list[index].item.cancel();
                        }
                        browserApp.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed()) {
                                win.webContents.send('$download_item', message.data);
                            }
                        });
                        browserApp.coreData.var.download_list.splice(index, 1);
                    } else if (message.data.status == 'pause') {
                        if (
                            browserApp.session_name_list.some((s) => s.name === message.data.Partition) &&
                            browserApp.coreData.var.download_list[index].item &&
                            typeof browserApp.coreData.var.download_list[index].item.pause === 'function'
                        ) {
                            browserApp.coreData.var.download_list[index].item.pause();
                        }
                        browserApp.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed()) {
                                win.webContents.send('$download_item', message.data);
                            }
                        });
                        browserApp.coreData.var.download_list.splice(index, 1);
                    } else if (message.data.status == 'resume') {
                        if (
                            browserApp.session_name_list.some((s) => s.name === message.data.Partition) &&
                            browserApp.coreData.var.download_list[index].item &&
                            typeof browserApp.coreData.var.download_list[index].item.canResume === 'function' &&
                            browserApp.coreData.var.download_list[index].item.canResume()
                        ) {
                            browserApp.coreData.var.download_list[index].item.resume();
                        }
                        browserApp.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed()) {
                                win.webContents.send('$download_item', message.data);
                            }
                        });
                        browserApp.coreData.var.download_list.splice(index, 1);
                    } else if (message.data.status == 're-download') {
                        if (browserApp.session_name_list.some((s) => s.name === message.data.Partition)) {
                            if (message.data.url) {
                                browserApp.electron.session.fromPartition(message.data.Partition).downloadURL(message.data.url);
                            }
                        }
                        browserApp.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed()) {
                                win.webContents.send('$download_item', message.data);
                            }
                        });
                        browserApp.coreData.var.download_list.splice(index, 1);
                    } else {
                        browserApp.coreData.var.download_list[index] = { ...browserApp.coreData.var.download_list[index], ...message.data };
                        browserApp.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed()) {
                                win.webContents.send('$download_item', browserApp.coreData.var.download_list[index]);
                            }
                        });
                    }
                } else {
                    browserApp.coreData.var.download_list.push(message.data);
                }
            } else if (message.type == '[add-window-url]') {
                let index = browserApp.coreData.var.urls.findIndex((u) => u.url == message.url);
                if (index > -1) {
                    browserApp.coreData.var.urls[index].title = message.title || browserApp.coreData.var.urls[index].title;
                    browserApp.coreData.var.urls[index].logo = message.logo || browserApp.coreData.var.urls[index].logo;
                    browserApp.coreData.var.urls[index].last_visit = new Date().getTime();
                    if (!message.ignoreCounted) {
                        browserApp.coreData.var.urls[index].count++;
                    }
                } else {
                    browserApp.coreData.var.urls.push({
                        url: message.url,
                        logo: message.logo,
                        title: message.title || message.url,
                        count: 1,
                        first_visit: new Date().getTime(),
                        last_visit: new Date().getTime(),
                    });
                }

                if (browserApp.addressbarWindow && !browserApp.addressbarWindow.isDestroyed()) {
                    browserApp.addressbarWindow.webContents.send('[update-browser-var]', { options: { name: 'urls', data: browserApp.coreData.var.urls } });
                }
            } else if (message.type == '[to-all]') {
                if (message.name === 'hide-addressbar') {
                    if (browserApp.addressbarWindow && !browserApp.addressbarWindow.isDestroyed()) {
                        browserApp.addressbarWindow.hide();
                    }
                }
            } else if (message.type == '[call-window-action]') {
                if (message.data.name == '[window-reload-hard]') {
                    browserApp.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            let info = message.data;
                            if (info.origin) {
                                info.origin = info.origin === 'null' ? win.webContents.getURL() : info.origin;
                                info.storages = info.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                                if (info.origin.replace('://', '').indexOf(':') == -1) {
                                    info.origin = info.origin + ':80';
                                }

                                if (info.storages[0] == 'cookies') {
                                    win.webContents.session
                                        .clearStorageData({
                                            origin: info.origin,
                                            storages: info.storages,
                                        })
                                        .then(() => {
                                            win.webContents.session.clearCache().then(() => {
                                                win.webContents.reload();
                                            });
                                        });
                                } else {
                                    win.webContents.session.clearCache().then(() => {
                                        win.webContents.session
                                            .clearStorageData({
                                                origin: info.origin,
                                                storages: info.storages,
                                            })
                                            .then(() => {
                                                win.webContents.session.clearCache().then(() => {
                                                    win.webContents.reload();
                                                });
                                            });
                                    });
                                }
                            }
                        }
                    });
                } else if (message.data.name == 'copy') {
                    browserApp.electron.clipboard.writeText(message.data.text.replace('#___new_tab___', '').replace('#___new_popup__', ''));
                } else if (message.data.name == 'full_screen') {
                    browserApp.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            win.setFullScreen(true);
                        }
                    });
                } else if (message.data.name == '!full_screen') {
                    browserApp.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            win.setFullScreen(false);
                        }
                    });
                } else {
                    browserApp.log('[call-window-action]', message);
                }
            } else if (message.type == '[window-reload]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.windowType == 'view' && win.customSetting.tabID == message.data.tabID) {
                        win.reload();
                    }
                });
            } else if (message.type == '[window-reload-hard]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        let win = win;
                        if (win && message.data.origin && message.data.origin !== 'null') {
                            let ss = win.webContents.session;
                            message.data.storages = message.data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                            browserApp.log(' will clear storage data ...');
                            let clear = false;
                            ss.clearStorageData({
                                origin: message.data.origin,
                                storages: message.data.storages,
                            }).finally(() => {
                                browserApp.log(' will clear cache ...');
                                ss.clearCache().finally(() => {
                                    browserApp.log(' will reload ...');
                                    clear = true;
                                    win.webContents.reload();
                                });
                            });
                            setTimeout(() => {
                                if (!clear) {
                                    win.webContents.reload();
                                }
                            }, 1000 * 3);
                        }
                    }
                });
            } else if (message.type == '[window-action]') {
                if (message.data.windowID) {
                    let win = browserApp.electron.BrowserWindow.fromId(message.data.windowID);
                    if (win && !win.isDestroyed()) {
                        if (message.data.name == 'toggle-window-audio') {
                            win.webContents.setAudioMuted(!win.webContents.audioMuted);
                            browserApp.updateTab(win);
                        } else if (message.data.name == 'window-zoom-') {
                            if (win.webContents.zoomFactor - 0.3 > 0.0) {
                                win.webContents.zoomFactor -= 0.2;
                                win.show();
                            }
                        } else if (message.data.name == 'window-zoom+') {
                            win.webContents.zoomFactor += 0.2;
                            win.show();
                        } else if (message.data.name == 'window-zoom') {
                            win.webContents.zoomFactor = 1;
                            win.show();
                        } else if (message.data.name == 'open-external' && message.data.url) {
                            browserApp.openExternal(message.data.url);
                        } else if (message.data.name == 'off') {
                            win.customSetting.off = !win.customSetting.off;
                            win.webContents.reload();
                        } else if (message.data.name.like('customSetting*')) {
                            let settingName = message.data.name.replace('customSetting.', '');
                            win.customSetting[settingName] = message.data.value;
                            browserApp.updateTab(win);
                        } else {
                            if (message.data.levels) {
                                browserApp.sendToWebContents(win.webContents, '[window-action]', message.data);
                            } else {
                                win.webContents.send('[window-action]', message.data);
                            }
                        }
                    }
                }
            } else if (message.type == '[toggle-window-edit]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        win.webContents.send('[toggle-window-edit]', message.data);
                    }
                });
            } else if (message.type == '[window-go-back]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        if (win.webContents.navigationHistory.canGoBack()) {
                            win.webContents.navigationHistory.goBack();
                        }
                    }
                });
            } else if (message.type == '[window-go-forward]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        if (win.webContents.navigationHistory.canGoForward()) {
                            win.webContents.goForward();
                        }
                    }
                });
            } else if (message.type == '[window-zoom]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        win.webContents.zoomFactor = 1;
                        win.show();
                    }
                });
            } else if (message.type == '[window-zoom+]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        win.webContents.zoomFactor += 0.2;
                        win.show();
                    }
                });
            } else if (message.type == '[window-zoom-]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        if (win.webContents.zoomFactor - 0.3 > 0.0) {
                            win.webContents.zoomFactor -= 0.2;
                            win.show();
                        }
                    }
                });
            } else if (message.type == '[show-window-dev-tools]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                        if (win && !win.isDestroyed() && win.customSetting && win.customSetting.allowDevTools) {
                            win.openDevTools();
                        }
                    }
                });
            } else if (message.type == '[set-standalone-window]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win && !win.isDestroyed() && win.customSetting && win.customSetting.windowType == 'view') {
                        win.setSkipTaskbar(false);
                        win.setMenuBarVisibility(true);
                        win.setResizable(true);
                        win.setMovable(true);
                    }
                });
            } else if (message.type == '[update-tab-properties]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win.customSetting.windowType == 'main' && win && !win.isDestroyed()) {
                        win.webContents.send('[update-tab-properties]', message.data);
                    }
                });
            } else if (message.type == '[edit-window]') {
                browserApp.getAllWindows().forEach((win) => {
                    if (win.customSetting.windowType == 'view' && win.customSetting.tabID == message.data.tabID && win && !win.isDestroyed()) {
                        win.webContents.executeJavaScript(
                            `
                        (function(){
                          let b =  document.querySelector('html');
                          if(b.contentEditable == "inherit"){
                              b.contentEditable = true;
                              b.style.border = '10px dashed green';
                          }else{
                              b.contentEditable = "inherit";
                              b.style.border = '0px solid white';
                          }
                        })()
                        `,
                            false,
                        );
                    }
                });
            } else if (message.type == '[close-view]') {
                if ((win = browserApp.getAllWindows().find((w) => w.customSetting.tabID == message.options.tabID && w.customSetting.windowType == 'view'))) {
                    if (win && !win.isDestroyed()) {
                        win.close();
                    }
                }
            } else if (message.type == '[show-view]') {
                browserApp.isCurrentView = false;

                browserApp.getAllWindows().forEach((win) => {
                    let customSetting = win.customSetting;
                    if (customSetting.windowType == 'view' && win && !win.isDestroyed()) {
                        if (win.customSetting.tabID == message.options.tabID) {
                            if (message.isCurrentView) {
                                browserApp.isCurrentView = true;
                                win.isCurrentView = true;
                                browserApp.handleWindowBounds();
                                win.show();
                                win.setAlwaysOnTop(true);
                                win.setAlwaysOnTop(false);
                                win.webContents.focus();
                                // console.log(message , win.getURL());
                            } else {
                                win.isCurrentView = false;
                                win.hide();
                            }
                        } else {
                            win.isCurrentView = false;
                            win.hide();
                        }
                    }
                });
            } else if (message.type == '[show-tab]') {
                browserApp.isCurrentView = false;

                browserApp.getAllWindows().forEach((win) => {
                    let customSetting = win.customSetting;
                    if (customSetting.windowType == 'main' && win && !win.isDestroyed()) {
                        win.webContents.send('[show-tab]', message.options);
                    }
                });
            } else if (message.type == '[close-tab]') {
                browserApp.isCurrentView = false;

                browserApp.getAllWindows().forEach((win) => {
                    let customSetting = win.customSetting;
                    if (customSetting.windowType == 'main' && win && !win.isDestroyed()) {
                        win.webContents.send('[close-tab]', message.options);
                    }
                });
            } else if (message.type == '[update-view-url]') {
                if ((win = browserApp.getAllWindows().find((w) => w.customSetting.tabID == message.data.tabID && w.customSetting.windowType == 'view'))) {
                    if (win && !win.isDestroyed()) {
                        win.loadURL(message.data.url);
                    }
                }
            } else if (message.type == '[update-view]') {
                if ((win = browserApp.getAllWindows().find((w) => w.customSetting.tabID == message.data.tabID && w.customSetting.windowType == 'view'))) {
                    if (win && !win.isDestroyed()) {
                        if (message.data.customSetting) {
                            win.customSetting = { ...win.customSetting, ...message.data.customSetting };
                        }
                        if (message.data.url) {
                            win.loadURL(message.data.url);
                        }
                    }
                }
            } else if (message.type == '[remove-tab]') {
                browserApp.sendToAllWindows('[send-render-message]', { name: '[remove-tab]', tabID: message.tabID });
            } else if (message.type == '[main-window-data-changed]') {
                if (message.screen && message.mainWindow) {
                    browserApp.mainWindowDataMessage = message;

                    browserApp.handleWindowBounds();
                }
            } else {
                browserApp.log('Unknown Message from parent:\n', message);
                browserApp.sendToAllWindows(message.type, message);
            }
        } catch (error) {
            browserApp.log('onmessage Error', error);
        }
    };

    process.on('message', (message) => {
        //        console.log('browserApp Get Message from parent:\n', message.type);
        browserApp.handleMessage(message);
    });
};
