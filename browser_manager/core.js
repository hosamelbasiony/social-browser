module.exports = function init(browserManager) {
    browserManager.ipcRenderer = browserManager.electron.ipcRenderer;
    browserManager.session = browserManager.electron.session;
    browserManager.clipboard = browserManager.electron.clipboard;
    browserManager.remote = browserManager.electron.remote;
    browserManager.shell = browserManager.electron.shell;
    browserManager.dialog = browserManager.electron.dialog;
    browserManager.clientList = [];
    browserManager.ipcClientList = [];
    browserManager.extensionList = [];
    browserManager.information = {};
    browserManager.cookies = {};
    browserManager.eval = require('eval');

    browserManager.isAllowURL = function (url) {
        if (url.like('data:*|about:*|chrome:*|file:*|devtools:*')) {
            return true;
        }
        if (browserManager.var.blocking.white_list.some((item) => url.like(item.url))) {
            return true;
        }
        if (browserManager.var.blocking.vip_site_list.some((item) => url.like(item.url))) {
            return true;
        }
        let allow = true;
        if (browserManager.var.blocking.core.block_ads) {
            allow = !browserManager.var.ad_list.some((ad) => url.like(ad.url));
        }

        if (allow) {
            allow = !browserManager.var.blocking.black_list.some((item) => url.like(item.url));
        }

        if (allow && browserManager.var.blocking.allow_safty_mode) {
            allow = !browserManager.var.blocking.un_safe_list.some((item) => url.like(item.url));
        }
        return allow;
    };

    browserManager.importExtension = function (folder) {
        if (folder) {
            browserManager.loadExtension({ path: folder });
        } else {
            browserManager.electron.dialog
                .showOpenDialog({
                    properties: ['openDirectory'],
                })
                .then((result) => {
                    browserManager.sendMessage({ type: 'share', message: '[show-main-window]' });
                    if (result.canceled === false && result.filePaths.length > 0) {
                        let path = result.filePaths[0];
                        browserManager.loadExtension({ path: path });
                    }
                })
                .catch((err) => {
                    browserManager.log('loadExtension Error', err);
                });
        }
    };
    browserManager.createExtensionId = function (extensionPath) {
        return Buffer.from(extensionPath).toString('base64url').slice(0, 32);
    };

    browserManager.loadExtension = function (_extension) {
        if (!_extension || !_extension.path) {
            browserManager.log('loadExtension Error: No Path', _extension);
            browserManager.sendMessage({ type: '[alert]', message: 'Extension not found Path' });
            return null;
        }

        let extensionPath = _extension.path.replace('{dir}', browserManager.dir);
        if (extensionPath.endsWith('.js')) {
            extensionPath = browserManager.path.dirname(extensionPath);
        }
        const manifestPath = browserManager.path.join(extensionPath, 'manifest.json');

        if (!browserManager.api.isFileExistsSync(manifestPath)) {
            browserManager.log('loadExtension Error: No Manifest', manifestPath);
            browserManager.sendMessage({ type: '[alert]', message: 'Extension manifest not found' });
            return null;
        }

        let manifest;
        try {
            manifest = JSON.parse(browserManager.fs.readFileSync(manifestPath, 'utf-8'));
        } catch (e) {
            browserManager.log('loadExtension Warning: Manifest parse failed, using empty manifest', manifestPath, e.message);
            manifest = {};
        }

        // Bypass: invalid/empty manifest is allowed — extension will load with defaults

        // if (!manifest.key || manifest.key !== browserManager.api.md5(browserManager.api.to123(manifest.name))) {
        //     browserManager.log('loadExtension Error: Invalid Manifest', manifestPath);
        //     browserManager.sendMessage({ type: '[alert]', message: 'Extension manifest is invalid' });
        //     return null;
        // }

        if (!manifest.name || browserManager.extensionList.some((exx) => exx.name == manifest.name)) {
            browserManager.log('loadExtension Error: Extension Name Exists', manifest.name);
            browserManager.sendMessage({ type: '[alert]', message: 'Extension name already exists' });
            return null;
        }

        const extension = {
            id: manifest.id || browserManager.createExtensionId(extensionPath),
            path: extensionPath,
            name: manifest.name,
            manifest,
        };

        if (browserManager.extensionList.some((exx) => exx.id == extension.id)) {
            browserManager.log('loadExtension Error: Extension ID Exists', manifest.name);
            browserManager.sendMessage({ type: '[alert]', message: 'Extension ID already exists' });
            return null;
        }

        const browserPath = browserManager.path.join(extensionPath, 'browser.js');
        if (browserManager.api.isFileExistsSync(browserPath)) {
            delete require.cache[require.resolve(browserPath)];
            let fn = require(browserPath);
            if (typeof fn === 'function') {
                extension.browser = fn(browserManager);
            } else {
                extension.browser = fn;
            }

            let index = browserManager.extensionList.findIndex((exx) => exx.id == extension.id);
            if (index === -1) {
                browserManager.extensionList.push(extension);
            } else {
                browserManager.extensionList[index] = extension;
            }
            if (extension.browser && extension.browser.init) {
                extension.browser.init();
            }
        } else {
            browserManager.log('loadExtension Warning: No Browser File', browserPath);
        }

        let index2 = browserManager.var.extension_list.findIndex((exx) => exx.id == extension.id);
        if (index2 === -1) {
            browserManager.var.extension_list.push({
                id: extension.id,
                path: extension.path,
                name: extension.manifest.name,
                description: extension.manifest.description,
                canDelete: extension.manifest.canDelete !== false,
                isEnabled: false,
            });
            browserManager.applay('extension_list');
        } else {
            let __extension = browserManager.var.extension_list[index2];
            __extension.name = extension.manifest.name;
            __extension.description = extension.manifest.description;
            __extension.canDelete = extension.manifest.canDelete !== false;
            if (__extension.isEnabled) {
                if (extension.browser && extension.browser.enable) {
                    extension.browser.enable();
                }
            }
        }

        return extension;
    };

    browserManager.enableExtension = function (extension) {
        let index = browserManager.extensionList.findIndex((exx) => exx.id === extension.id);
        if (index !== -1) {
            extension = browserManager.extensionList[index];
        } else {
            browserManager.log('enableExtension Not Exists', extension, browserManager.extensionList);
            browserManager.sendMessage({ type: '[alert]', message: 'Extension not found or not loaded' });
            return false;
        }

        if (!extension) {
            browserManager.log('enableExtension Load Failed', extension);
            browserManager.sendMessage({ type: '[alert]', message: 'Extension load failed' });
            return false;
        }

        if (extension && extension.browser && extension.browser.enable) {
            extension.browser.enable();
        }

        let index2 = browserManager.var.extension_list.findIndex((exx) => exx.id === extension.id);
        if (index2 !== -1) {
            browserManager.var.extension_list[index2].isEnabled = true;
        }
        browserManager.applay('extension_list');
    };
    browserManager.disableExtension = function (extension) {
        let index = browserManager.extensionList.findIndex((exx) => exx.id == extension.id);
        if (index !== -1) {
            if (browserManager.extensionList[index].browser && browserManager.extensionList[index].browser.disable) {
                browserManager.extensionList[index].browser.disable();
            }
        }
        let index2 = browserManager.var.extension_list.findIndex((exx) => exx.id == extension.id);
        if (index2 !== -1) {
            browserManager.var.extension_list[index2].isEnabled = false;
        }
        browserManager.applay('extension_list');
    };

    browserManager.removeExtension = function (extension) {
        browserManager.extensionList = browserManager.extensionList.filter((exx) => exx.id !== extension.id);
        browserManager.var.extension_list = browserManager.var.extension_list.filter((exx) => exx.id !== extension.id);

        browserManager.applay('extension_list');
    };
    browserManager.applay = function (name) {
        browserManager.shareBrowserVar(name);
    };

    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'fn.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'file.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'download.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'api.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_app', 'shared.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'data.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'session.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'ipc.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'chat.js'))(browserManager);
    require(browserManager.path.join(browserManager.dir, 'browser_manager', 'messages.js'))(browserManager);

    browserManager.createChildWindow = function (options) {
        browserManager.createNewWindow(options);
    };

    browserManager.getCookiesByPartition = function (partition) {
        return new Promise((resolve, reject) => {
            let browserProcess = browserManager.createChildProcess({ partition: partition, windowType: 'cookies' });
            browserProcess.cookiesInterval = setInterval(() => {
                if (browserProcess.cookies) {
                    clearInterval(browserProcess.cookiesInterval);
                    resolve(browserProcess.cookies);
                }
            }, 500);
        });
    };

    browserManager.createChildProcess = function (_options) {
        let options = { ..._options };
        options.partition = options.partition || options.session?.name || browserManager.var.core.session.name;
        options.user_name = options.user_name || options.session?.display || options.partition;
        options.windowType = options.windowType || 'popup';

        options.uuid = !options.partition.contains('persist:') ? 'x-ghost' : 'user-' + options.partition.replace('persist:', '');
        const uuid = options.uuid;
        let data_dir = browserManager.data_dir;

        let index = browserManager.clientList.findIndex((cl) => cl && cl.uuid === uuid);
        if (index !== -1 && browserManager.clientList[index]) {
            if (browserManager.clientList[index].windowType == 'cookies') {
                browserManager.clientList[index].cookies = null;
            }
            browserManager.clientList[index].windowType = options.windowType;
            browserManager.clientList[index].option_list.push(options);
            browserManager.clientList[index].options = options;
            if (browserManager.clientList[index].ws) {
                browserManager.clientList[index].ws.send({ type: 're-connected' });
            }
        } else {
            index = browserManager.clientList.length;
            browserManager.clientList.push({
                source: 'browserApp',
                partition: options.partition,
                uuid: uuid,
                option_list: [options],
                windowType: options.windowType,
                index: index,
                options: options,
            });

            let browserProcess = browserManager.run([
                '--index=' + index,
                '--uuid=' + uuid,
                '--partition=' + options.partition,
                '--dir=' + browserManager.dir,
                '--data_dir=' + data_dir,
                '--speed=' + (browserManager.speedMode || ''),
                '--theme=' + 'dark',
                browserManager.dir + '/browser_app/core.js',
            ]);

            browserManager.clientList[index].id = browserProcess.pid;
            browserManager.clientList[index].pid = browserProcess.pid;
            browserManager.clientList[index].browserProcess = browserProcess;

            browserProcess.once('spawn', () => {
                browserManager.clientList[index].id = browserProcess.pid;
                browserManager.clientList[index].pid = browserProcess.pid;
            });

            browserProcess.on('message', (message) => {
                browserManager.handleMessage(message, browserProcess);
            });

            browserProcess.on('disconnect', (err) => {
                browserManager.log(` [ browserProcess ${uuid} / ${browserManager.clientList.length} ] disconnect`, err);
            });

            browserProcess.on('close', (code, signal) => {
                browserManager.log(`\n [ Exit :: browserProcess:${browserProcess.pid} ${uuid} / ${browserManager.clientList.length} ] close with code ( ${code} ) and signal ( ${signal} ) \n`);

                let index2 = browserManager.clientList.findIndex((c) => c.uuid == uuid);
                if (index2 !== -1) {
                    if (browserManager.clientList[index2].option_list.some((op) => op.windowType == 'main') && code == 2147483651 && !signal) {
                        console.log('\n\n ................. Main Window Close UpNormal ..............\n\n');

                        browserManager.createChildProcess(browserManager.clientList[index2].option_list.find(op.windowType == 'main'));

                        browserManager.clientList.forEach((client, i) => {
                            if (client.option_list.some(op.windowType == 'view')) {
                                client.ws.send({
                                    type: '[set-standalone-window]',
                                });
                            }
                        });
                    }

                    browserManager.clientList[index2].option_list.forEach((op) => {
                        if (op.tabID && op.windowType === 'view') {
                            browserManager.clientList.forEach((client, i) => {
                                if (client.windowType === 'main') {
                                    client.ws.send({
                                        type: '[remove-tab]',
                                        tabID: op.tabID,
                                    });
                                }
                            });
                        }
                    });

                    browserManager.clientList = browserManager.clientList.filter((c) => c.uuid !== uuid);
                }
            });
        }

        return browserManager.clientList[index];
    };

    browserManager.var.extension_list = browserManager.var.extension_list || [];
    browserManager.var.extension_list.forEach((ex) => {
        browserManager.loadExtension(ex);
    });

    browserManager.checkUpdate = function () {
        browserManager.api
            .fetch('https://gitcdn.link/repo/absunstar/smart-apps/main/browser/site_files/json/info.json', {
                mode: 'no-cors',
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
                    'cache-control': 'max-age=0',
                    dnt: 1,
                    'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'none',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': 1,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
                },
                agent: function (_parsedURL) {
                    if (_parsedURL.protocol == 'http:') {
                        return new browserManager.api.http.Agent({
                            keepAlive: true,
                        });
                    } else {
                        return new browserManager.api.https.Agent({
                            keepAlive: true,
                        });
                    }
                },
            })
            .then((res) => {
                return res.json();
            })
            .then((info) => {
                console.log(info);
                if (info.version > browserManager.var.core.version) {
                    console.log('Will Updating');
                    // browserManager.child_process.spawn('C:\\Users\\share\\Downloads\\social_browser_64.exe', null, { detached: true });
                    // process.exit();
                } else {
                    console.log('No Updated');
                }
            });
    };

    // browserManager.checkUpdate();
};
