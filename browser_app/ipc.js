module.exports = function init(browserApp) {
    browserApp.on = function (name, callback) {
        browserApp.ipcMain.handle(name, callback);
    };

    browserApp.call = function (channel, value) {
        if (!browserApp.is_app_ready) {
            return null;
        }

        browserApp.getAllWindows().forEach((win) => {
            if (win && !win.isDestroyed()) {
                if (value && value.toWindowID) {
                    if (value.toWindowID == win.id) {
                        win.send(channel, value);
                    }
                } else {
                    win.send(channel, value);
                }
            }
        });
    };

    browserApp.sendToWindow = function (win, channel, data) {
        if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
            win.webContents.send(channel, data);
        }
    };
    browserApp.sendToWebContents = function (webContents, channel, data) {
        if (webContents && !webContents.isDestroyed()) {
            webContents.send(channel, data);
            webContents.mainFrame.frames.forEach((f) => {
                if (f && !f.isDestroyed()) {
                    f.send(channel, data);
                    f.frames.forEach((f2) => {
                        if (f2 && !f2.isDestroyed()) {
                            f2.send(channel, data);
                            f2.frames.forEach((f3) => {
                                if (f3 && !f3.isDestroyed()) {
                                    f3.send(channel, data);
                                    f3.frames.forEach((f4) => {
                                        if (f4 && !f4.isDestroyed()) {
                                            f4.send(channel, data);
                                            f4.frames.forEach((f5) => {
                                                if (f5 && !f5.isDestroyed()) {
                                                    f5.send(channel, data);
                                                    f5.frames.forEach((f6) => {
                                                        if (f6 && !f6.isDestroyed()) {
                                                            f6.send(channel, data);
                                                            f6.frames.forEach((f7) => {
                                                                if (f7 && !f7.isDestroyed()) {
                                                                    f7.send(channel, data);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    browserApp.cloneObject = function (obj, level = 0, maxLevel = 4) {
        try {
            if (Array.isArray(obj)) {
                let newArray = [];
                for (let index = 0; index < obj.length; index++) {
                    newArray[index] = browserApp.cloneObject(obj[index], level + 1, maxLevel);
                }
                return newArray;
            } else if (!obj || typeof obj !== 'object' || obj instanceof Date) {
                return obj;
            }

            let newObject = {};

            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    newObject[key] = obj[key];
                } else if (typeof obj[key] === 'function') {
                    newObject[key] = obj[key].toString();
                    newObject[key] = newObject[key].slice(newObject[key].indexOf('{') + 1, newObject[key].lastIndexOf('}'));
                } else if (obj[key] instanceof Date) {
                    newObject[key] = obj[key];
                } else if (typeof obj[key] === 'object') {
                    if (level < maxLevel) {
                        newObject[key] = browserApp.cloneObject(obj[key], level + 1, maxLevel);
                    } else {
                        newObject[key] = obj[key];
                    }
                } else {
                    newObject[key] = obj[key];
                }
            }
            return newObject;
        } catch (error) {
            browserApp.log(error);
            return obj;
        }
    };
    browserApp.handleBrowserData = function (data) {
        let data2 = {
            browserAppProcessID: browserApp.id,
            uuid: browserApp.uuid,
            browserAppIndex: browserApp.index,
            information: browserApp.coreData.information,
            files_dir: browserApp.coreData.files_dir,
            dir: browserApp.coreData.dir,
            data_dir: browserApp.coreData.data_dir,
            userDataDir: browserApp.userDataDir,
            injectedHTML: browserApp.coreData.injectedHTML,
            injectedCSS: browserApp.coreData.injectedCSS,
            newTabData: browserApp.coreData.newTabData,
            userAgentBrowserList: browserApp.userAgentBrowserList.map((b) => ({ name: b.name, vendor: b.vendor, prefix: b.prefix })),
            timeZones: browserApp.timeZones,
            languageList: browserApp.languageList,
            effectiveTypeList: browserApp.effectiveTypeList,
            connectionTypeList: browserApp.connectionTypeList,
            userAgentDeviceList: browserApp.userAgentDeviceList,
            partition: data.partition,
        };

        let win = browserApp.getAllWindows().find((w) => w.id == data.windowID);
        if (win) {
            data2.customSetting = win.customSetting || {};
            data2.partition = data.partition = data2.customSetting.partition;
            data2.session = data2.customSetting.session || browserApp.coreData.var.session_list.find((s) => s.name == data2.partition) || { name: data2.partition, display: data2.partition };
        }
        data.username = data2.session?.display;
        data2.var = browserApp.get_dynamic_var(data);
        return data2;
    };

    browserApp.ipcMain.handle('[browser][data]', async (event, data) => {
        let data2 = browserApp.handleBrowserData(data);
        return browserApp.cloneObject(data2);
    });
    browserApp.ipcMain.handle('[crx]', async (event, data) => {
        console.log('[crx]', data);
        return undefined;
    });
    browserApp.ipcMain.on('[browser][data]', async (event, data) => {
        let data2 = browserApp.handleBrowserData(data);
        event.returnValue = browserApp.cloneObject(data2);
    });

    browserApp.ipcMain.on('[get]', async (event, data) => {
        let arr = data.property.split('.');
        let obj = undefined;
        let prop = undefined;

        if (arr.length == 1) {
            obj = browserApp.shared;
            prop = arr[0];
        } else if (arr.length == 2) {
            prop = arr[1];

            if (arr[0] == 'webContents') {
                obj = event.sender;
            } else if (arr[0] == 'window') {
                obj = browserApp.electron.BrowserWindow.fromWebContents(event.sender) || browserApp.window;
            } else if (arr[0] == 'customSetting') {
                obj = browserApp.electron.BrowserWindow.fromWebContents(event.sender)?.customSetting || browserApp.window?.customSetting;
            } else if (arr[0] == 'session') {
                obj = event.sender.session;
            } else if (arr[0] == 'shared') {
                obj = browserApp.shared;
            } else if (arr[0] == 'api') {
                obj = browserApp.api;
            } else if (arr[0] == 'browserApp') {
                obj = browserApp;
            } else if (arr[0] == 'screen') {
                obj = browserApp.electron.screen;
            } else {
                obj = browserApp.shared;
            }
        }

        if (obj && prop) {
            try {
                event.returnValue = obj[prop];
            } catch (error) {
                console.log(error);
                console.log(arr);
                event.returnValue = undefined;
            }
        }
    });
    browserApp.ipcMain.on('[set]', async (event, data) => {
        let arr = data.property.split('.');
        let obj = undefined;
        let prop = undefined;

        if (arr.length == 1) {
            obj = browserApp.shared;
            prop = arr[0];
        } else if (arr.length == 2) {
            prop = arr[1];

            if (arr[0] == 'webContents') {
                obj = event.sender;
            } else if (arr[0] == 'window') {
                obj = browserApp.electron.BrowserWindow.fromWebContents(event.sender) || browserApp.window;
            } else if (arr[0] == 'customSetting') {
                let win = browserApp.electron.BrowserWindow.fromWebContents(event.sender);
                if (win) {
                    obj = win.customSetting;
                    setTimeout(() => {
                        browserApp.updateTab(win);
                    }, 200);
                }
            } else if (arr[0] == 'session') {
                obj = event.sender.session;
            } else if (arr[0] == 'shared') {
                obj = browserApp.shared;
            } else if (arr[0] == 'api') {
                obj = browserApp.api;
            } else if (arr[0] == 'browserApp') {
                obj = browserApp;
            } else if (arr[0] == 'screen') {
                obj = browserApp.electron.screen;
            } else {
                obj = browserApp.shared;
            }
        }

        if (obj && prop) {
            obj[prop] = data.value;
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    });
    browserApp.handleRenderFn = function (event, data) {
        try {
            let arr = data.fn.split('.');
            let obj = undefined;
            let fn = undefined;

            if (arr.length == 1) {
                obj = browserApp;
                fn = arr[0];
            } else if (arr.length == 2) {
                fn = arr[1];

                if (arr[0] == 'webContents') {
                    if (data.parentFrame) {
                        obj = browserApp.electron.webFrameMain.fromFrameToken(data.parentFrame.processId, data.parentFrame.frameToken);
                    } else {
                        obj = event.sender;
                    }
                } else if (arr[0] == 'window') {
                    obj = browserApp.electron.BrowserWindow.fromWebContents(event.sender) || browserApp.window;
                } else if (arr[0] == 'session') {
                    obj = event.sender.session;
                } else if (arr[0] == 'cookies') {
                    obj = event.sender.session.cookies;
                } else if (arr[0] == 'api') {
                    obj = browserApp.api;
                } else if (arr[0] == 'screen') {
                    obj = browserApp.electron.screen;
                } else if (arr[0] == 'clipboard') {
                    obj = browserApp.electron.clipboard;
                } else if (arr[0] == 'browserApp') {
                    obj = browserApp;
                } else if (arr[0] == 'fs') {
                    obj = browserApp.fs;
                } else if (arr[0] == 'path') {
                    obj = browserApp.path;
                } else {
                    obj = null;
                }
            }

            if (obj && fn) {
                if (obj[fn] && typeof obj[fn] == 'function') {
                    if (typeof data.params == 'string') {
                        return obj[fn](data.params);
                    } else {
                        return obj[fn](...data.params);
                    }
                }
            } else {
                return undefined;
            }
        } catch (error) {
            return undefined;
        }
    };

    browserApp.ipcMain.on('[fn]', (event, data) => {
        let result = browserApp.handleRenderFn(event, data);

        if (result instanceof Promise) {
            result
                .then((res) => {
                    event.returnValue = res;
                })
                .catch((err) => {
                    event.returnValue = err;
                });
        } else {
            event.returnValue = result;
        }
    });
    browserApp.ipcMain.handle('[fn]', (event, data) => {
        let result = browserApp.handleRenderFn(event, data);
        if (result instanceof Promise) {
            result
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return err;
                });
        } else {
            return result;
        }
    });

    browserApp.ipcMain.on('[window]', async (event, data = {}) => {
        let currentWindow = browserApp.electron.BrowserWindow.fromWebContents(event.sender) || browserApp.window;
        let obj = { fnList: [] };
        if (currentWindow && !currentWindow.isDestroyed()) {
            obj.id = currentWindow.id;
            for (const key in currentWindow) {
                if (typeof currentWindow[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        }

        event.returnValue = obj;
    });
    browserApp.ipcMain.on('[window.actions]', async (event, data = {}) => {
        let currentWindow = browserApp.electron.BrowserWindow.fromId(data.windowID);
        let result = undefined;
        if (data.action == 'location.href') {
            result = currentWindow.getURL();
        } else if (data.action == 'location.replace') {
            currentWindow.send('[send-render-message]', { name: 'location.replace', url: data.url });
        }

        event.returnValue = result;
    });

    browserApp.ipcMain.on('[webContents]', async (event, data = { id: 1 }) => {
        let webContents = event.sender;
        let obj = { fnList: [] };
        if (webContents) {
            obj.id = webContents.id;
            for (const key in webContents) {
                if (typeof webContents[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        } else {
            console.log('[webContents]', event.sender);
        }

        event.returnValue = obj;
    });
    browserApp.ipcMain.on('[customSetting]', async (event, data = {}) => {
        let currentWindow = browserApp.electron.BrowserWindow.fromWebContents(event.sender) || browserApp.window;
        if (currentWindow) {
            event.reply('[customSetting-replay]', currentWindow.customSetting);
        } else {
            event.reply('[customSetting-replay]', {});
        }
    });

    browserApp.ipcMain.on('[screen]', async (event, data = { id: 1 }) => {
        let screen = browserApp.electron.screen;
        let obj = { fnList: [] };
        if (screen) {
            for (const key in screen) {
                if (typeof screen[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        }

        event.returnValue = obj;
    });

    browserApp.ipcMain.on('[clipboard]', async (event, data = { id: 1 }) => {
        let clipboard = browserApp.electron.clipboard;
        let obj = { fnList: [] };
        if (clipboard) {
            for (const key in clipboard) {
                if (typeof clipboard[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        }

        event.returnValue = obj;
    });

    browserApp.ipcMain.on('[md5]', async (event, data) => {
        event.returnValue = browserApp.api.md5(data);
    });
    browserApp.ipcMain.on('[to123]', async (event, data) => {
        event.returnValue = browserApp.api.to123(data);
    });
    browserApp.ipcMain.on('[from123]', async (event, data) => {
        event.returnValue = browserApp.api.from123(data);
    });
    browserApp.ipcMain.on('[toBase64]', async (event, data) => {
        event.returnValue = browserApp.api.toBase64(data);
    });
    browserApp.ipcMain.on('[fromBase64]', async (event, data) => {
        event.returnValue = browserApp.api.fromBase64(data);
    });
    browserApp.ipcMain.on('[encryptText]', async (event, data) => {
        if (data.password) {
            let l1 = browserApp.coreData.var.core.pinCode[0];
            let l2 = browserApp.coreData.var.core.pinCode[1];
            let l3 = browserApp.coreData.var.core.pinCode[2];
            let l4 = browserApp.coreData.var.core.pinCode[3];
            let text = browserApp.api.to123(data.password + data.text);

            if (l1) {
                text.replaceAll('1', l1);
            }
            if (l2 && l2 !== l1) {
                text.replaceAll('2', l2);
            }
            if (l3 && l3 !== l1 && l3 !== l2) {
                text.replaceAll('3', l3);
            }
            if (l4 && l4 !== l1 && l4 !== l2 && l4 !== l3) {
                text.replaceAll('4', l4);
            }
            event.returnValue = text;
        } else {
            event.returnValue = '';
        }
    });
    browserApp.ipcMain.on('[decryptText]', async (event, data) => {
        if (data.password) {
            let l1 = browserApp.coreData.var.core.pinCode[0];
            let l2 = browserApp.coreData.var.core.pinCode[1];
            let l3 = browserApp.coreData.var.core.pinCode[2];
            let l4 = browserApp.coreData.var.core.pinCode[3];

            if (l1) {
                data.text.replaceAll(l1, '1');
            }
            if (l2 && l2 !== l1) {
                data.text.replaceAll(l2, '2');
            }
            if (l3 && l3 !== l1 && l3 !== l2) {
                data.text.replaceAll(l3, '3');
            }
            if (l4 && l4 !== l1 && l4 !== l2 && l4 !== l3) {
                data.text.replaceAll(l4, '4');
            }

            data.text = browserApp.api.from123(data.text);

            if (data.text.startsWith(data.password)) {
                event.returnValue = data.text.replace(data.password, '');
            } else {
                event.returnValue = '';
            }
        } else {
            event.returnValue = '';
        }
    });

    browserApp.prompt = async function (message, defaultValue) {
        const win = await browserApp.createNewWindow({
            url: 'browser://prompt',
            show: true,
            width: 500,
            height: 350,
            modal: true,
            alwaysOnTop: true,
            center: true,
            resizable: false,
            data: {
                message: message,
                defaultValue: defaultValue,
            },
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            timeout: 60 * 1000,
        });

        return await new Promise((resolve) => {
            win.on('closed', () => {
                if (!win.resolved) {
                    win.resolved = true;
                    resolve(null);
                }
            });

            browserApp.ipcMain.once('prompt-response', (event, value) => {
                if (!win.resolved) {
                    win.resolved = true;
                    resolve(value);
                }

                if (win && !win.isDestroyed()) {
                    win.close();
                }
            });
        });
    };

    browserApp.ipcMain.on('[window.prompt]', async (event, data) => {
        data.message = data.message || '';
        data.defaultValue = data.defaultValue || '';

        event.returnValue = await browserApp.prompt(data.message, data.defaultValue);
    });

    browserApp.confirm = async function (message) {
        const win = await browserApp.createNewWindow({
            url: 'browser://confirm',
            show: true,
            width: 400,
            height: 250,
            modal: true,
            alwaysOnTop: true,
            center: true,
            resizable: false,
            data: { message: message },
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            timeout: 60 * 1000,
        });

        return await new Promise((resolve) => {
            win.on('closed', () => {
                if (!win.resolved) {
                    win.resolved = true;
                    resolve(null);
                }
            });

            browserApp.ipcMain.once('confirm-response', (event, value) => {
                if (!win.resolved) {
                    win.resolved = true;
                    resolve(value);
                }

                if (win && !win.isDestroyed()) {
                    win.close();
                }
            });
        });
    };

    browserApp.ipcMain.on('[window.confirm]', async (event, data) => {
        data.message = data.message || '';

        event.returnValue = await browserApp.confirm(data.message);
    });

    browserApp.login = async function (data = {}) {
        const win = await browserApp.createNewWindow({
            url: 'browser://login',
            show: true,
            width: 500,
            height: 400,
            modal: true,
            alwaysOnTop: true,
            center: true,
            resizable: false,
            data: data,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            timeout: 60 * 1000,
        });

        return await new Promise((resolve) => {
            win.on('closed', () => {
                if (!win.resolved) {
                    win.resolved = true;
                    resolve(null);
                }
            });

            browserApp.ipcMain.once('login-response', (event, value) => {
                if (!win.resolved) {
                    win.resolved = true;
                    resolve(value);
                }

                if (win && !win.isDestroyed()) {
                    win.close();
                }
            });
        });
    };

    browserApp.ipcMain.on('[window.login]', async (event, data) => {
        event.returnValue = await browserApp.login(data);
    });

    browserApp.ipcMain.on('[select-file]', async (event, options = {}) => {
        let win = browserApp.electron.BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePaths } = await browserApp.electron.dialog.showOpenDialog(win, { properties: ['openFile', 'showHiddenFiles'], ...options });
        if (!canceled) {
            event.returnValue = filePaths[0];
        } else {
            event.returnValue = null;
        }
    });
    browserApp.ipcMain.on('[select-open-file]', async (event, options = {}) => {
        let win = browserApp.electron.BrowserWindow.fromWebContents(event.sender);
        options = { ...{ properties: ['openFile', 'showHiddenFiles', 'promptToCreate', 'createDirectory', 'dontAddToRecent'] }, ...options };

        const { canceled, filePaths } = await browserApp.electron.dialog.showOpenDialog(win, options);
        if (!canceled) {
            event.returnValue = filePaths[0];
        } else {
            event.returnValue = null;
        }
    });
    browserApp.ipcMain.on('[select-save-file]', async (event, options = {}) => {
        let win = browserApp.electron.BrowserWindow.fromWebContents(event.sender);
        options = { ...{ properties: ['createDirectory', 'showHiddenFiles', 'dontAddToRecent'] }, ...options };

        const { canceled, filePath } = await browserApp.electron.dialog.showSaveDialog(win, options);
        if (!canceled) {
            event.returnValue = filePath;
        } else {
            event.returnValue = null;
        }
    });
    browserApp.ipcMain.on('[select-files]', async (event, data) => {
        const { canceled, filePaths } = await browserApp.electron.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections', 'showHiddenFiles'] });
        if (!canceled) {
            event.returnValue = filePaths;
        } else {
            event.returnValue = null;
        }
    });
    browserApp.ipcMain.on('[write-file]', async (event, options) => {
        try {
            browserApp.fs.writeFileSync(options.path, options.data);
        } catch (error) {
            browserApp.log(error);
            event.returnValue = false;
        }
        event.returnValue = true;
    });
    browserApp.ipcMain.on('[read-file]', async (event, path) => {
        event.returnValue = browserApp.fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
    });
    browserApp.ipcMain.on('[delete-file]', async (event, path) => {
        browserApp.fs.unlinkSync(path);
        event.returnValue = true;
    });
    browserApp.ipcMain.on('[select-folder]', async (event, data) => {
        const { canceled, filePaths } = await browserApp.electron.dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (!canceled) {
            event.returnValue = filePaths[0];
        } else {
            event.returnValue = null;
        }
    });
    browserApp.ipcMain.on('[select-folders]', async (event, data) => {
        const { canceled, filePaths } = await browserApp.electron.dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });
        if (!canceled) {
            event.returnValue = filePaths;
        } else {
            event.returnValue = null;
        }
    });
    browserApp.ipcMain.on('[open-folder]', async (event, path) => {
        browserApp.electron.shell.showItemInFolder(path);
        event.returnValue = true;
    });
    browserApp.ipcMain.on('[dir-name]', async (event, path) => {
        event.returnValue = browserApp.path.dirname(path);
    });
    browserApp.ipcMain.on('[create-folder]', async (event, path) => {
        if (!browserApp.fs.existsSync(path)) {
            browserApp.fs.mkdirSync(path);
        }
        event.returnValue = true;
    });

    browserApp.ipcMain.on('[show-message-box]', async (event, options) => {
        if (!options.message) {
            event.returnValue = null;
            return;
        }
        event.returnValue = await browserApp.electron.dialog.showMessageBox(options);
    });

    browserApp.ipcMain.on('[get-http-cookies]', (event, obj) => {
        event.returnValue = browserApp.cookieList.find((c) => obj.domain.like(c.domain) && c.partition == obj.partition) || { cookie: '' };
    });
    browserApp.ipcMain.on('[set-http-cookies]', (event, obj) => {
        let cookieIndex = browserApp.cookieList.findIndex((c) => obj.domain.like(c.domain) && c.partition == obj.partition);
        if (cookieIndex !== -1) {
            browserApp.cookieList[cookieIndex] = obj;
        } else {
            browserApp.cookieList.push(obj);
        }
        event.returnValue = true;
    });
    browserApp.ipcMain.on('[get-domain-cookies]', (event, obj) => {
        obj.cookieDomain = obj.cookieDomain || '*';
        browserApp.electron.session
            .fromPartition(obj.partition)
            .cookies.get({})
            .then((cookies) => {
                cookies = cookies.filter((c) => c.domain.like(obj.cookieDomain) || c.domain.like('.' + obj.cookieDomain));
                cookies.forEach((c) => {
                    const scheme = c.secure ? 'https' : 'http';
                    const host = c.domain[0] === '.' ? c.domain.substr(1) : c.domain;
                    c.url = scheme + '://' + host;
                });
                let cookieInfo = {
                    domain: obj.cookieDomain,
                    partition: obj.partition,
                    cookies: cookies,
                };
                event.returnValue = cookieInfo;
            })
            .catch((error) => {
                event.returnValue = null;
            });
    });

    browserApp.ipcMain.on('[set-domain-cookies]', (event, obj) => {
        let ss = browserApp.electron.session.fromPartition(obj.partition);
        obj.cookies.forEach((cookie) => {
            cookie.path = cookie.path ?? '/';
            cookie.secure = cookie.secure ?? true;
            cookie.httpOnly = cookie.httpOnly ?? false;
            const scheme = cookie.secure ? 'https' : 'http';
            const host = cookie.domain[0] === '.' ? cookie.domain.substr(1) : cookie.domain;
            cookie.url = cookie.url || scheme + '://' + host + cookie.path;
            ss.cookies
                .set(cookie)
                .then(() => {
                    browserApp.log('Cookie Added', obj.partition, cookie);
                    event.returnValue = true;
                })
                .catch((error) => {
                    browserApp.log(error);
                    event.returnValue = null;
                });
        });
    });

    browserApp.ipcMain.on('[delete-domain-cookies]', (event, obj) => {
        let ss = browserApp.electron.session.fromPartition(obj.partition);

        obj.cookies.forEach((cookie) => {
            cookie.path = cookie.path ?? '/';
            cookie.secure = cookie.secure ?? true;
            const scheme = cookie.secure ? 'https' : 'http';
            const host = cookie.domain[0] === '.' ? cookie.domain.substr(1) : cookie.domain;
            cookie.url = cookie.url || scheme + '://' + host + cookie.path;

            ss.cookies
                .remove(cookie.url, cookie.name)
                .then(() => {
                    event.returnValue = true;
                })
                .catch((error) => {
                    event.returnValue = false;
                });
        });
    });

    browserApp.ipcMain.on('[get-session-cookies]', (event, obj) => {
        obj.domain = obj.domain || '*';
        browserApp.electron.session
            .fromPartition(obj.partition)
            .cookies.get({})
            .then((cookies) => {
                let cookieInfo = {
                    partition: obj.partition,
                    cookies: cookies.filter((c) => c.domain.like(obj.domain) || c.domain.like('.' + obj.domain)),
                };
                event.returnValue = cookieInfo;
            })
            .catch((error) => {
                event.returnValue = null;
            });
    });

    browserApp.ipcMain.on('[set-session-cookies]', (event, obj) => {
        let ss = browserApp.electron.session.fromPartition(obj.partition);
        obj.cookies.forEach((cookie) => {
            const scheme = cookie.secure ? 'https' : 'http';
            const host = cookie.domain[0] === '.' ? cookie.domain.substr(1) : cookie.domain;
            cookie.url = cookie.url || scheme + '://' + host + cookie.path;
            ss.cookies
                .set(cookie)
                .then(() => {
                    browserApp.log('Cookie Added', obj.partition, cookie);
                    event.returnValue = true;
                })
                .catch((error) => {
                    browserApp.log(error);
                    event.returnValue = null;
                });
        });
    });

    browserApp.ipcMain.on('[open-in-chrome]', (event, obj) => {
        event.returnValue = true;
        browserApp.openInChrome(obj);
    });

    browserApp.ipcMain.handle('[open-external]', (e, obj) => {
        browserApp.openExternal(obj.link);
        return true;
    });
    browserApp.ipcMain.handle('[exec]', (e, obj) => {
        browserApp.exec(obj.cmd);
        return true;
    });
    browserApp.ipcMain.handle('[exe]', (e, obj) => {
        browserApp.exe(obj.cmd, obj.args);
        return true;
    });
    browserApp.ipcMain.handle('[kill]', (e, obj) => {
        browserApp.child_process.exec('tasklist', { maxBuffer: 1024 * 1024 * 2 }, function (err, stdout, stderr) {
            let programsList = [];
            if (stdout) {
                let lines = stdout.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === '') continue;
                    var values = line.split(/\s+/);
                    programsList.push({
                        name: values[0],
                        pid: values[1],
                        memory: values[4],
                    });
                }

                programsList.forEach((itm) => {
                    if (itm.name.like(obj.name)) {
                        try {
                            process.kill(itm.pid);
                        } catch (error) {
                            browserApp.log(error);
                        }
                    }
                });
            }
        });

        return true;
    });
    browserApp.ipcMain.handle('[request-cookie]', (e, obj) => {
        return browserApp.cookieList.find((c) => obj.domain.like(c.domain) && c.partition == obj.partition) || { cookie: '' };
    });

    browserApp.ipcMain.handle('online-status', (e, obj) => {
        browserApp.coreData.var.core.onLineStatus = obj.status;
        return true;
    });

    browserApp.ipcMain.handle('[handle-session]', async (e, obj) => {
        return await browserApp.handleSession(obj);
    });
    browserApp.ipcMain.handle('[cookie-set-raw]', (e, obj) => {
        return true;
    });
    browserApp.ipcMain.handle('[cookie-get-raw]', (e, obj) => {
        return browserApp.getCookiesRaw(obj);
    });
    browserApp.ipcMain.handle('[cookie-get-all]', (e, obj) => {
        return browserApp.getAllCookies(obj);
    });
    browserApp.ipcMain.handle('[cookies-clear]', (e, obj) => {
        return browserApp.clearCookies(obj);
    });
    browserApp.ipcMain.handle('[alert]', (e, data) => {
        if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win) {
                win.send('[alert]', data);
            }
        }
    });
    browserApp.ipcMain.handle('[browserApp-message]', (e, message) => {
        let win = browserApp.electron.BrowserWindow.fromId(message.windowID);
        if (win) {
            browserApp.sendToWebContents(win.webContents, '[browserApp-message]', message);
        }
    });
    browserApp.ipcMain.handle('window.message', (e, message) => {
        if (message.toParentFrame) {
            let senderFrame = browserApp.electron.webFrameMain.fromFrameToken(message.toParentFrame.processId, message.toParentFrame.frameToken);
            if (senderFrame) {
                senderFrame.send('window.message', message);
            } else {
                if (message.windowID) {
                    let win = browserApp.electron.BrowserWindow.fromId(message.windowID);
                    if (win) {
                        win.send('window.message', message);
                    }
                }
            }
        } else if (message.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(message.windowID);
            if (win) {
                win.send('window.message', message);
            }
        }
    });

    browserApp.ipcMain.handle('share', (e, data) => {
        browserApp.sendMessage({
            type: 'share',
            data: data,
        });
    });

    browserApp.ipcMain.handle('[proxy-check-request]', (e, message) => {
        browserApp.proxy_check(message.proxy);
    });
    browserApp.ipcMain.handle('getBlobData', (e, message) => {
        browserApp.log('getBlobData', message);
        let ses = browserApp.electron.session.fromPartition(message.partition);
        ses.getBlobData(message.url)
            .then((data) => {
                browserApp.log(data);
            })
            .catch((err) => {
                browserApp.log(err);
            });
    });
    browserApp.ipcMain.handle('ws', (e, message) => {
        browserApp.sendMessage(message);
    });

    browserApp.ipcMain.handle('[add][window]', (e, data) => {
        let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
        if (win) {
            win.customSetting = { ...win.customSetting, ...data.customSetting };
        }
    });

    browserApp.ipcMain.handle('[set][window][setting]', (e, data) => {
        let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
        if (win) {
            win.customSetting.windowSetting = win.customSetting.windowSetting || [];
            win.customSetting.windowSetting.push(data);
        }
    });

    browserApp.ipcMain.handle('[get][window][setting]', (e, data) => {
        let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
        if (win) {
            return win.customSetting.windowSetting || [];
        } else {
            return [];
        }
    });

    browserApp.fetchWithRetry = async function (url, request, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                let response = await browserApp.api.fetch(url, request);
                return response;
            } catch (err) {
                if (err.code === 'ECONNRESET' && i < retries - 1) continue;
                throw err;
            }
        }
    };

    browserApp.ipcMain.handle('[fetch]', async (e, options) => {
        try {
            options.body = options.body || options.data || options.payload;
            options.data = undefined;
            options.payload = undefined;
            delete options.data;
            delete options.payload;

            if (options.method && options.method.like('get')) {
                if (typeof options.body == 'string' && options.body.length > 0) {
                    if (options.url.indexOf('?') === 0) {
                        options.url += options.body;
                    } else {
                        options.url += '?' + options.body;
                    }
                } else if (typeof options.body == 'object' && options.body != null) {
                    let params = new URLSearchParams(options.body).toString();
                    options.url += '?' + params;
                }

                options.body = undefined;
            } else if (options.body && typeof options.body != 'string') {
                options.body = JSON.stringify(options.body);
            }

            options.headers = options.headers || {};
            options.return = options.return || 'all';

            let request = {
                mode: 'cors',
                method: 'get',
                redirect: 'follow',
                ...options,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
                    ...options.headers,
                },
            };

            let response = await browserApp.api.fetch(options.url, request);

            if (response) {
                if (options.return == 'json') {
                    return response.json();
                } else if (options.return == 'text') {
                    return await response.text();
                } else {
                    let responseText = await response.text();
                    let headers = await response.headers.raw();
                    let resData = {
                        ok: response.ok,
                        status: response.status,
                        statusText: response.statusText,
                        headers: headers,
                        body: responseText,
                        url: options.url,
                        request: {
                            headers: request.headers,
                        },
                    };
                    return resData;
                }
            } else {
                let resData = {
                    error: 'No Response',
                    url: options.url,
                    request: {
                        headers: request.headers,
                    },
                };
                return resData;
            }
        } catch (error) {
            let resData = {
                error: error.message,
                body: error.message,
                url: options.url,
            };
            return resData;
        }
    });

    browserApp.ipcMain.handle('[fetch-json]', async (e, options) => {
        options.body = options.body || options.data || options.payload;
        if (options.body && typeof options.body != 'string') {
            options.body = JSON.stringify(options.body);
        }
        options.return = options.return || 'json';
        options.headers = options.headers || {};
        try {
            let data = await browserApp.api.fetch(options.url, {
                mode: 'cors',
                method: options.method || 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': browserApp.coreData.var.core.defaultUserAgent.url,
                    ...options.headers,
                },
                body: options.body,
                redirect: options.redirect || 'follow',
            });

            if (data) {
                if (options.return == 'json') {
                    if (data.ok) {
                        return data.json();
                    } else {
                        return JSON.stringify({ done: false, data: data, options: options });
                    }
                } else {
                    return data.text();
                }
            }
        } catch (error) {
            console.log(error);
            if (options.return == 'json') {
                return JSON.stringify({ done: false, error: error });
            } else {
                return error.toString();
            }
        }
    });

    browserApp.ipcMain.handle('[translate]', async (e, info) => {
        info.text = encodeURIComponent(info.text);
        info.from = info.from || 'auto';
        info.to = info.to || 'en';
        info.data = await browserApp.api.fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${info.from}&tl=${info.to}&dt=t&dt=bd&dj=1&q=${info.text}`, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        });
        if (info.data) {
            info.data = info.data.json();
        }
        return info;
    });

    browserApp.nativeIconList = [];

    browserApp.getNativeIcon = function (iconURL) {
        if (!iconURL) {
            return undefined;
        }

        let path = browserApp.path.join(browserApp.coreData.data_dir, 'favicons', browserApp.api.md5(iconURL) + '.' + iconURL.split('?')[0].split('.').pop());
        let index = browserApp.nativeIconList.findIndex((c) => c.url == iconURL || c.path == path);

        if (index !== -1) {
            if (browserApp.nativeIconList[index].icon) {
                return browserApp.nativeIconList[index].icon;
            }

            if (browserApp.api.isFileExistsSync(path)) {
                browserApp.nativeIconList[index].icon = browserApp.electron.nativeImage.createFromPath(path).resize({ width: 16 });
                return browserApp.nativeIconList[index].icon;
            }
            return undefined;
        } else {
            if (browserApp.api.isFileExistsSync(path)) {
                let icon = browserApp.electron.nativeImage.createFromPath(path).resize({ width: 16 });
                browserApp.nativeIconList.push({
                    url: iconURL,
                    path: path,
                    icon: icon,
                });
                return icon;
            } else {
                browserApp.nativeIconList.push({
                    url: iconURL,
                    path: path,
                });

                browserApp.sendMessage({
                    type: '[download-favicon]',
                    url: iconURL,
                });
            }
        }
    };

    browserApp.ipcMain.handle('[show-menu]', (e, data) => {
        let win = browserApp.electron.BrowserWindow.fromId(data.windowID);

        data.list.forEach((m, i) => {
            m.click = function () {
                browserApp.sendToWebContents(win.webContents, '[run-menu]', { index: i });
            };

            m.icon = browserApp.getNativeIcon(m.iconURL);

            if (m.submenu) {
                m.submenu.forEach((m2, i2) => {
                    m2.click = function () {
                        browserApp.sendToWebContents(win.webContents, '[run-menu]', { index: i, index2: i2 });
                    };
                    m2.icon = browserApp.getNativeIcon(m2.iconURL);

                    if (m2.submenu) {
                        m2.submenu.forEach((m3, i3) => {
                            m3.click = function () {
                                browserApp.sendToWebContents(win.webContents, '[run-menu]', { index: i, index2: i2, index3: i3 });
                            };
                            m3.icon = browserApp.getNativeIcon(m3.iconURL);
                        });
                    }
                });
            }
        });

        const menu = browserApp.electron.Menu.buildFromTemplate(data.list);

        menu.popup(win);
    });
    browserApp.ipcMain.handle('[create-new-view]', async (event, options) => {
        options.url = options.url || browserApp.coreData.var.core.newTabURL;
        options.windowType = 'view';
        options.parent_id = browserApp.id;
        options.parent_index = browserApp.index;
        if (browserApp.speedMode) {
            if (!browserApp.session_name_list.some((s) => s == options.partition)) {
                await browserApp.handleSession({ name: options.partition });
            }
            await browserApp.createNewWindow(options);
        } else {
            browserApp.sendMessage({
                type: '[create-new-view]',
                options: options,
            });
        }
    });

    browserApp.ipcMain.handle('[show-view]', (e, options) => {
        if (browserApp.addressbarWindow && !browserApp.addressbarWindow.isDestroyed()) {
            browserApp.addressbarWindow.hide();
        }
        if (browserApp.profilesWindow && !browserApp.profilesWindow.isDestroyed()) {
            browserApp.profilesWindow.hide();
        }

        if (browserApp.speedMode) {
            browserApp.currentView = options;
            browserApp.getAllWindows().forEach((win) => {
                if (win.customSetting.windowType == 'view') {
                    if (win.customSetting.tabID == browserApp.currentView.tabID) {
                        win.show();
                        win.focus();
                    } else {
                        win.hide();
                    }
                }
            });
        } else {
            browserApp.sendMessage({
                type: '[show-view]',
                options: options,
            });
        }
    });

    browserApp.ipcMain.handle('[close-view]', (e, options) => {
        if (browserApp.speedMode) {
            browserApp.getAllWindows().forEach((win) => {
                if (win.customSetting.windowType == 'view' && win.customSetting.tabID == options.tabID) {
                    win.close();
                }
            });
        } else {
            browserApp.sendMessage({
                type: '[close-view]',
                options: options,
            });
        }
    });

    browserApp.ipcMain.handle('[show-tab]', (e, options) => {
        browserApp.sendMessage({
            type: '[show-tab]',
            options: options,
        });
    });
    browserApp.ipcMain.handle('[close-tab]', (e, options) => {
        browserApp.sendMessage({
            type: '[close-tab]',
            options: options,
        });
    });
    browserApp.ipcMain.handle('[update-view-url]', (e, data) => {
        browserApp.sendMessage({
            type: '[update-view-url]',
            data: data,
        });
    });
    browserApp.ipcMain.handle('[update-view]', (e, data) => {
        browserApp.sendMessage({
            type: '[update-view]',
            data: data,
        });
    });

    browserApp.ipcMain.handle('[import-proxy-list]', (e, file) => {
        browserApp.importProxyList(file);
    });
    browserApp.ipcMain.handle('[load-google-extension]', (e, extensionInfo) => {
        browserApp.sendMessage({
            type: '[load-google-extension]',
            extensionInfo: extensionInfo,
        });
    });
    browserApp.ipcMain.handle('[remove-google-extension]', (e, extensionInfo) => {
        browserApp.sendMessage({
            type: '[remove-google-extension]',
            extensionInfo: extensionInfo,
        });
    });
    browserApp.ipcMain.handle('[import-extension]', (e, folder) => {
        browserApp.sendMessage({
            type: '[import-extension]',
            folder: folder,
        });
    });
    browserApp.ipcMain.handle('[enable-extension]', (e, options) => {
        browserApp.sendMessage({
            type: '[enable-extension]',
            extension: options,
        });
    });
    browserApp.ipcMain.handle('[disable-extension]', (e, options) => {
        browserApp.sendMessage({
            type: '[disable-extension]',
            extension: options,
        });
    });
    browserApp.ipcMain.handle('[remove-extension]', (e, options) => {
        browserApp.sendMessage({
            type: '[remove-extension]',
            extension: options,
        });
    });

    browserApp.ipcMain.handle('[update-browser-var]', (e, options) => {
        browserApp.coreData.var[options.name] = options.data;
        browserApp.sendMessage({
            type: '[update-browser-var]',
            options: options,
        });
    });

    browserApp.ipcMain.handle('[browser-message]', (event, data) => {
        let win = browserApp.getAllWindows().find((w) => w.id == data.windowID);
        if (win && !win.isDestroyed()) {
            if (data.name == 'maxmize') {
                if (win.isMaximized()) {
                    win.unmaximize();
                } else {
                    win.maximize();
                }
            } else if (data.name == 'minmize') {
                win.minimize();
            } else if (data.name == 'close') {
                win.close();
            }
        }
    });

    browserApp.ipcMain.handle('[open new tab]', (event, data) => {
        data.partition = data.partition || data.session?.name || browserApp.coreData.var.core.session.name;
        data.user_name = data.user_name || data.session?.display || browserApp.coreData.var.session_list.find((s) => s.name == data.partition)?.display || data.partition;
        data.title = data.title || data.url;

        if (browserApp.getAllWindows().some((w) => w.customSetting.windowType == 'main')) {
            browserApp.getAllWindows().forEach((win) => {
                if (win.customSetting.windowType == 'main' && !win.isDestroyed() && !win.webContents.isDestroyed()) {
                    win.webContents.send('[open new tab]', data);
                }
            });
        } else {
            data.mainWindowID = data.mainWindowID || browserApp.mainWindowDataMessage?.mainWindowID;
            browserApp.sendMessage({
                type: '[open new tab]',
                data: data,
            });
        }
    });

    browserApp.ipcMain.handle('[open new popup]', async (event, data) => {
        data.partition = data.partition || data.session?.name || browserApp.coreData.var.core.session.name;
        data.user_name = data.user_name || data.session?.display || browserApp.coreData.var.session_list.find((s) => s.name == data.partition)?.display || data.partition;
        data.user_name = data.user_name.split(':')[1] || data.user_name.split(':')[0];
        delete data.name;
        data.windowType = data.windowType || 'popup';

        if (data.partition == browserApp.partition) {
            await browserApp.createNewWindow(data);
        } else {
            browserApp.sendMessage({
                type: '[create-new-window]',
                options: data,
            });
        }
    });

    browserApp.ipcMain.handle('[show-addressbar]', async (event, data) => {
        await browserApp.showAddressbarWindow(data);
    });
    browserApp.ipcMain.handle('[edit-window]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[edit-window]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
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

    browserApp.ipcMain.handle('[window-reload]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-reload]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            win.webContents.reload();
        } else {
            let win = browserApp.electron.BrowserWindow.fromWebContents(event.sender);
            win.webContents.reload();
        }
    });

    browserApp.ipcMain.handle('[window-reload-hard]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-reload-hard]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win && data.origin && data.origin !== 'null') {
                let ss = win.webContents.session;
                data.storages = data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                browserApp.log(' will clear storage data ...');
                let clear = false;
                ss.clearStorageData({
                    origin: data.origin,
                    storages: data.storages,
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

    browserApp.ipcMain.handle('[window-action]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-action]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
                win.webContents.send('[window-action]', data);
            }
        }
    });

    browserApp.ipcMain.handle('[toggle-window-edit]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[toggle-window-edit]', data: data });
        }
    });

    browserApp.ipcMain.handle('[window-go-back]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-go-back]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoBack()) {
                win.webContents.navigationHistory.goBack();
            }
        }
    });

    browserApp.ipcMain.handle('[window-go-forward]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-go-forward]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoForward()) {
                win.webContents.goForward();
            }
        }
    });

    browserApp.ipcMain.handle('[window-zoom]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-zoom]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            win.webContents.zoomFactor = 1;
            win.show();
        }
    });

    browserApp.ipcMain.handle('[window-zoom-]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-zoom-]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win && win.webContents.zoomFactor - 0.3 > 0.0) {
                win.webContents.zoomFactor -= 0.2;
                win.show();
            }
        }
    });

    browserApp.ipcMain.handle('[window-zoom+]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[window-zoom+]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            win.webContents.zoomFactor += 0.2;
            win.show();
        }
    });

    browserApp.ipcMain.handle('[add-to-bookmark]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({
                type: '[add-to-bookmark]',
                data: data,
            });
        }
    });

    browserApp.ipcMain.handle('[run-user-script]', (event, data) => {
        let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
        if (win && !win.isDestroyed()) {
            browserApp.sendToWebContents(win.webContents, '[run-user-script]', data.script);
        }
    });

    browserApp.ipcMain.handle('[show-window-dev-tools]', (event, data) => {
        if (data.tabID && data.browserAppID && data.windowID) {
            browserApp.sendMessage({ type: '[show-window-dev-tools]', data: data });
        } else if (data.windowID) {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win && !win.isDestroyed() && win.customSetting && win.customSetting.allowDevTools) {
                win.openDevTools();
            }
        }
    });

    browserApp.ipcMain.handle('[show-profiles]', async (event, data) => {
        await browserApp.showProfilesWindow();
    });

    browserApp.ipcMain.handle('user_data', (event, data) => {
        if (!Array.isArray(data.data) || data.data.length === 0) {
            return null;
        }
        browserApp.coreData.var.user_data = browserApp.coreData.var.user_data || [];
        let index = browserApp.coreData.var.user_data.findIndex((u) => u.id === data.id);
        if (index !== -1) {
            browserApp.coreData.var.user_data[index].data = data.data;
        } else {
            browserApp.coreData.var.user_data.push(data);
        }
        browserApp.sendMessage({
            type: '[user_data][changed]',
            data: data,
        });
    });

    browserApp.ipcMain.handle('user_data_input', (event, data) => {
        if (!Array.isArray(data.data) || data.data.length === 0) {
            return null;
        }

        browserApp.coreData.var.user_data_input = browserApp.coreData.var.user_data_input || [];
        let index = browserApp.coreData.var.user_data_input.findIndex((u) => u.id === data.id);
        if (index > -1) {
            browserApp.coreData.var.user_data_input[index].data = data.data;
        } else {
            browserApp.coreData.var.user_data_input.push(data);
        }
        browserApp.sendMessage({
            type: '[user_data_input][changed]',
            data: data,
        });
    });

    browserApp.ipcMain.handle('[send-render-message]', (event, data) => {
        data.partition = data.partition || browserApp.coreData.var.core.session.name;
        data.user_name = data.user_name || browserApp.coreData.var.core.session.display;

        if (data.tabID && data.browserAppID && data.windowID) {
            let name = data.name;
            delete data.name;

            browserApp.sendMessage({
                type: name,
                data: data,
            });
        } else if (!browserApp.speedMode && data.action) {
            delete data.action;
            browserApp.sendMessage({
                type: '[call-window-action]',
                data: data,
            });
        } else if (data.name == '[run-window-update]') {
            browserApp.sendMessage({
                type: '[run-window-update]',
            });
        } else if (data.name == '[show-browser-setting]') {
            if (browserApp.getAllWindows().some((w) => w.customSetting.windowType == 'main')) {
                browserApp.getAllWindows().forEach((win) => {
                    if (win.customSetting.windowType == 'main' && !win.isDestroyed() && !win.webContents.isDestroyed()) {
                        win.webContents.send('[open new tab]', {
                            url: 'http://127.0.0.1:60080/setting',
                            session: { name: 'setting', display: 'setting' },
                            user_name: 'Setting',
                            windowType: 'view',
                            vip: true,
                        });
                    }
                });
            } else {
                data.mainWindowID = browserApp.mainWindowDataMessage.mainWindowID;
                browserApp.sendMessage({
                    type: '[open new tab]',
                    data: {
                        url: 'http://127.0.0.1:60080/setting',
                        session: { name: 'setting', display: 'setting' },
                        user_name: 'Setting',
                        windowType: 'view',
                        vip: true,
                    },
                });
            }
        } else if (data.name == '[toggle-fullscreen]') {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            win.setFullScreen(!win.isFullScreen());
        } else if (data.name == '[window-go-forward]') {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoForward()) {
                win.webContents.goForward();
            }
        } else if (data.name == '[window-go-forward]') {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoForward()) {
                win.webContents.goForward();
            }
        } else if (data.name == '[save-window-as-pdf]') {
            let win = browserApp.electron.BrowserWindow.fromId(data.windowID);

            browserApp.electron.dialog
                .showSaveDialog({
                    defaultPath: win.webContents.title,
                    title: 'Save Downloading URL As PDF',
                    properties: ['openFile', 'createDirectory'],
                })
                .then((result) => {
                    if (result.canceled) {
                        return;
                    }
                    win.webContents.printToPDF({}).then((data) => {
                        browserApp.fs.writeFile(result.filePath, data, function (error) {
                            if (!error) {
                                browserApp.electron.dialog
                                    .showMessageBox({
                                        title: 'Download Complete',
                                        type: 'info',
                                        buttons: ['Open File', 'Open Folder', 'Close'],
                                        message: `Save Page As PDF \n To \n ${result.filePath} `,
                                    })
                                    .then((result3) => {
                                        browserApp.electron.shell.beep();
                                        if (result3.response == 1) {
                                            browserApp.electron.shell.showItemInFolder(result.filePath);
                                        }
                                        if (result3.response == 0) {
                                            browserApp.electron.shell.openPath(result.filePath);
                                        }
                                    });
                            } else {
                                browserApp.log(error);
                            }
                        });
                    });
                });
        } else if (data.name == '[download-link]') {
            let ss = browserApp.electron.session.defaultSession;
            ss.downloadURL(data.url);
        }
        return true;
    });
};
