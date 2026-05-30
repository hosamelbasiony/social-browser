module.exports = function init(browserManager) {
    browserManager.mkdirSync(browserManager.data_dir);
    browserManager.removeDirSync(browserManager.path.join(browserManager.data_dir, 'sessionData'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'default'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'sessionData'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'crashes'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'json'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'logs'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'favicons'));
    browserManager.mkdirSync(browserManager.path.join(browserManager.data_dir, 'pdf'));

    browserManager.icons = [];
    browserManager.icons['darwin'] = browserManager.path.join(browserManager.files_dir, 'images', 'logo.icns');
    browserManager.icons['linux'] = browserManager.path.join(browserManager.files_dir, 'images', 'logo.png');
    browserManager.icons['win32'] = browserManager.path.join(browserManager.files_dir, 'images', 'logo.ico');

    browserManager.handleAdList = function () {
        if (!browserManager.var.ad_list) {
            return;
        }
        browserManager.var.$ad_list = [];
        browserManager.var.ad_list.forEach((l) => {
            if (l.enabled) {
                browserManager.var.$ad_list = [...browserManager.var.$ad_list, ...l.url.split('|')];
            }
        });
        browserManager.var.$ad_string = browserManager.var.$ad_list.join('|');
        browserManager.clientList.forEach((client) => {
            if (client.ws) {
                client.ws.send({
                    type: '[update-browser-var]',
                    options: {
                        name: '$ad_string',
                        data: browserManager.var.$ad_string,
                    },
                });
            }
        });
    };
    browserManager.newVersionDetected = false;
    browserManager.readBrowserVar = function (name) {
        let path = browserManager.path.join(browserManager.dir, 'browser_files', 'json', name + '.social');
        let Content = name.like('*list*') ? [] : {};

        if (browserManager.fs.existsSync(path)) {
            Content = browserManager.api.show(browserManager.readFileSync(path)) || Content;
            browserManager.varRaw[name] = Content;
        } else {
            path = browserManager.path.join(browserManager.dir, 'browser_files', 'json', name + '.json');
            if (browserManager.fs.existsSync(path)) {
                Content = browserManager.readFileSync(path);
                Content = Content ? browserManager.parseJson(Content) : name.like('*list*') ? [] : {};
                browserManager.varRaw[name] = Content;
            }
        }

        if (!Content) {
            Content = name.like('*list*') ? [] : {};
        }
        return Content;
    };
    browserManager.readUserVar = function (name) {
        let path = browserManager.path.join(browserManager.data_dir, 'json', name + '.social');
        let Content = name.like('*list*') ? [] : {};

        if (browserManager.fs.existsSync(path)) {
            Content = browserManager.api.show(browserManager.readFileSync(path)) || Content;
            browserManager.var[name] = Content;
        } else {
            let path = browserManager.path.join(browserManager.data_dir, 'json', name + '.json');
            if (browserManager.fs.existsSync(path)) {
                Content = browserManager.readFileSync(path);
                Content = Content ? browserManager.parseJson(Content) : name.like('*list*') ? [] : {};
                browserManager.var[name] = Content;
            }
        }

        if (!Content) {
            Content = name.like('*list*') ? [] : {};
        }
        return Content;
    };

    browserManager.get_var = function (name) {
        let userVarContent = browserManager.readUserVar(name);
        let browserVarContent = browserManager.readBrowserVar(name);

        let notFoundUserContent = false;

        if (!userVarContent || userVarContent == null) {
            notFoundUserContent = true;
        } else if (Array.isArray(userVarContent) && userVarContent.length === 0) {
            notFoundUserContent = true;
        } else if (!Array.isArray(userVarContent) && !Object.keys(userVarContent).length) {
            notFoundUserContent = true;
        }

        if (notFoundUserContent) {
            // replace with browser var
            browserManager.log('notFoundUserContent : ' + name);
            console.log(userVarContent);
            browserManager.var[name] = userVarContent = browserVarContent;

            if (name == 'session_list') {
                browserManager.var[name].forEach((s) => {
                    if (s.display == '{email}') {
                        s.display = browserManager.makeID(8) + '@social-browser.com';
                        s.name = 'persist:' + browserManager.md5(s.display);
                    } else {
                        s.name = s.name.replace('{random}', '_random_' + new Date().getTime().toString().replace('0.', '') + Math.random().toString().replace('0.', ''));
                        if (s.name.indexOf('persist:') === -1) {
                            s.name = 'persist:' + s.name;
                        }
                    }
                });
            }
        }

        if (browserManager.newVersionDetected && !notFoundUserContent) {
            if (name == 'user_data_input') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.id == d2.id) {
                            d2 = d;
                            exists = true;
                        }
                    });

                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'user_data') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.id == d2.id) {
                            d2 = d;
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'urls') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.url === d2.url) {
                            d2 = d;
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'download_list') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.url == d2.url) {
                            d2 = d;
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'proxy_list') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.url == d2.url) {
                            d2 = d;
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'bookmarks') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.url == d2.url) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (
                name == 'open_list' ||
                name == 'white_list' ||
                name == 'black_list' ||
                name == 'vip_site_list' ||
                name == 'ai_site_list' ||
                name == 'integrated_site_list' ||
                name == 'social_site_list'
            ) {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.url == d2.url) {
                            d2 = d;
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'session_list') {
                if (userVarContent.length == 0) {
                    userVarContent = userVarContent.filter((s) => !!s);

                    browserVarContent.forEach((d) => {
                        d.name = d.name.replace('{random}', '_default_' + new Date().getTime().toString().replace('0.', '') + Math.random().toString().replace('0.', ''));
                        d.time = d.time || new Date().getTime();
                        if (d.name.indexOf('persist:') === -1) {
                            d.name = 'persist:' + d.name;
                        }
                        let exists = false;
                        userVarContent.forEach((d2) => {
                            if (d.name == d2.name) {
                                exists = true;
                            }
                        });
                        if (!exists) {
                            userVarContent.push(d);
                        }
                    });
                }

                userVarContent.forEach((s) => {
                    s.time = s.time || new Date().getTime();
                    s.privacy = s.privacy || {};
                    s.privacy.vpc = s.privacy.vpc || {};
                    s.privacy.vpc.blockRTC = s.privacy.vpc.blockRTC ?? true;
                    s.privacy.vpc.maskAudio = s.privacy.vpc.maskAudio ?? true;
                    s.privacy.vpc.maskCPU = s.privacy.vpc.maskCPU ?? true;
                    s.privacy.vpc.maskCanvas = s.privacy.vpc.maskCanvas ?? true;
                    s.privacy.vpc.maskFonts = s.privacy.vpc.maskFonts ?? true;
                    s.privacy.vpc.maskLang = s.privacy.vpc.maskLang ?? true;
                    s.privacy.vpc.maskLocation = s.privacy.vpc.maskLocation ?? true;
                    s.privacy.vpc.maskMemory = s.privacy.vpc.maskMemory ?? true;
                    s.privacy.vpc.maskPlugins = s.privacy.vpc.maskPlugins ?? true;
                    s.privacy.vpc.maskTimeZone = s.privacy.vpc.maskTimeZone ?? true;
                    s.privacy.vpc.maskWebGL = s.privacy.vpc.maskWebGL ?? true;
                });

                userVarContent.sort((a, b) => (a.time > b.time ? -1 : 1));

                browserManager.var[name] = userVarContent;
            } else if (name == 'userAgentList') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2, i) => {
                        if (d.name == d2.name) {
                            exists = true;
                            userVarContent[i].url = d.url;
                            userVarContent[i].platform = d.platform;
                            userVarContent[i].vendor = d.vendor;
                            userVarContent[i].engine = d.engine;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });

                browserManager.var[name] = userVarContent;
            } else if (name == 'extension_list') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.id == d2.id) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });

                browserManager.var[name] = userVarContent;
            } else if (name == 'scriptList') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.id == d2.id) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });

                browserManager.var[name] = userVarContent;
            } else if (name == 'ad_list') {
                browserVarContent.forEach((d) => {
                    let exists = false;
                    userVarContent.forEach((d2) => {
                        if (d.name == d2.name) {
                            exists = true;
                            d2.url = d.url;
                        }
                    });
                    if (!exists) {
                        userVarContent.push(d);
                    }
                });

                browserManager.var[name] = userVarContent;
            } else if (name == 'blocking') {
                browserManager.var[name] = browserVarContent;
            } else if (name == 'privateKeyList') {
                browserVarContent.forEach((info1) => {
                    if (!userVarContent.some((info2) => info2.key == info1.key)) {
                        userVarContent.push(info1);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else if (name == 'faList') {
                browserVarContent.forEach((info1) => {
                    if (!userVarContent.some((info2) => info2.code == info1.code)) {
                        userVarContent.push(info1);
                    }
                });
                browserManager.var[name] = userVarContent;
            } else {
                if (name.like('*list*')) {
                    browserManager.var[name] = [...browserVarContent, ...userVarContent];
                } else {
                    browserManager.var[name] = { ...browserVarContent, ...userVarContent };
                }
            }
        }

        if (name == 'core') {
            if (browserManager.var.core.version !== browserVarContent.version) {
                browserManager.newVersionDetected = true;
                browserManager.var.core = { ...browserManager.var.core, ...browserVarContent, emails: browserManager.var.core.emails || browserVarContent.emails };
                browserManager.var.core.defaultUserAgent = null;
            }

            browserManager.var.core.browser = browserManager.var.core.browser || browserVarContent.browser;
            browserManager.var.core.flags = browserVarContent.flags || '';
            browserManager.var.core.prefix = browserVarContent.prefix || '';
            browserManager.var.core.pinCode = browserVarContent.pinCode || '';

            if (!browserManager.var.core.id) {
                browserManager.var.id = browserManager.md5(process.platform + '_' + browserManager.package.version + '_' + new Date().getTime() + '_' + Math.random());
                if (browserManager.var.core.prefix) {
                    browserManager.var.id = browserManager.var.core.prefix + browserManager.var.id;
                }
                browserManager.var.core.id = browserManager.var.id;
            } else {
                if (browserManager.var.core.prefix && !browserManager.var.core.id.contains(browserManager.var.core.prefix)) {
                    browserManager.var.core.id = browserManager.var.core.prefix + browserManager.var.core.id.split('_').pop();
                }
                browserManager.var.id = browserManager.var.core.id;
            }

            browserManager.var.core.time = browserManager.var.core.time || new Date().getTime();

            if (typeof browserManager.var.core.loginByPasskey === 'undefined') {
                browserManager.var.core.loginByPasskey = true;
            }
        }

        if (name == 'userAgentList') {
            if (!browserManager.var.core.defaultUserAgent) {
                browserManager.var.core.defaultUserAgent = browserManager.var.userAgentList[0];
            }

            if (browserManager.var.core.defaultUserAgent) {
                browserManager.electron.app.userAgentFallback = browserManager.var.core.defaultUserAgent.url;
            }
        }

        if (name == 'session_list' && browserManager.var.core.session == null) {
            browserManager.var.core.session = browserManager.var.session_list[0];
        }

        if (name == 'user_data_input') {
            browserManager.var.user_data_input = browserManager.var.user_data_input.filter(
                (v, i, a) => a.findIndex((t) => t && v && t.hostname === v.hostname && t.password === v.password && t.username === v.username) === i,
            );
            browserManager.var.user_data_input.forEach((d, i) => {
                delete browserManager.var.user_data_input[i].options;
                browserManager.var.user_data_input[i].hostname = browserManager.var.user_data_input[i].hostname || browserManager.var.user_data_input[i].host;

                if (!browserManager.var.user_data_input[i].hostname) {
                    browserManager.var.user_data_input.splice(i, 1);
                }
            });
        }
        if (name == 'user_data') {
            browserManager.var.user_data = browserManager.var.user_data.filter(
                (v, i, a) => a.findIndex((t) => t && v && t.hostname === v.hostname && JSON.stringify(t.data || {}) === JSON.stringify(v.data || {})) === i,
            );
            browserManager.var.user_data.forEach((d, i) => {
                delete browserManager.var.user_data[i].options;
                browserManager.var.user_data[i].hostname = browserManager.var.user_data[i].hostname || browserManager.var.user_data[i].host;

                if (!browserManager.var.user_data[i].hostname) {
                    browserManager.var.user_data.splice(i, 1);
                }
            });
        }

        if (name == 'proxy_mode_list') {
            browserManager.var.proxy_mode_list = browserVarContent;
        }

        if (name == 'proxy_list') {
            browserManager.var[name].forEach((proxy, i) => {
                browserManager.var[name][i] = browserManager.handleProxy(proxy);
            });
        }

        if (name == 'blocking') {
            browserManager.var.blocking.open_list = browserManager.var.blocking.open_list || [];
            browserManager.var.blocking.ai_site_list = browserManager.var.blocking.ai_site_list || [];
            browserManager.var.blocking.integrated_site_list = browserManager.var.blocking.integrated_site_list || [];
            browserManager.var.blocking.social_site_list = browserManager.var.blocking.social_site_list || [];

            browserManager.var.blocking.core = browserManager.var.blocking.core || {};
            browserManager.var.blocking.javascript = browserManager.var.blocking.javascript || {};
            if (typeof browserManager.var.blocking.javascript.maskWindowWorker === 'undefined') {
                browserManager.var.blocking.javascript.maskWindowWorker = true;
            }
            browserManager.var.blocking.privacy = browserManager.var.blocking.privacy || {};

            browserManager.var.blocking.youtube = browserManager.var.blocking.youtube || {};
            browserManager.var.blocking.permissions = browserManager.var.blocking.permissions || {};
            browserManager.var.blocking.internet_speed = browserManager.var.blocking.internet_speed || {};
            browserManager.var.blocking.white_list = browserManager.var.blocking.white_list || [];
            browserManager.var.blocking.vip_site_list = browserManager.var.blocking.vip_site_list || [];
            browserManager.var.blocking.black_list = browserManager.var.blocking.black_list || [];
            browserManager.var.blocking.popup = browserManager.var.blocking.popup || {};
            browserManager.var.blocking.context_menu = browserManager.var.blocking.context_menu || { inspect: true, dev_tools: true, page_options: true };
            browserManager.var.blocking.downloader = browserManager.var.blocking.downloader || { enabled: true };
            browserManager.var.blocking.downloader.apps = browserManager.var.blocking.downloader.apps || [
                {
                    name: 'C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe',
                    params: '/d $url /f $file_name',
                },
                {
                    name: 'C:\\Program Files\\Softdeluxe\\Free Download Manager\\fdm.exe',
                    params: '--url $url --path $file_name',
                    url: 'https://www.freedownloadmanager.org/',
                },
            ];
        }

        return browserManager.var[name];
    };

    browserManager.set_var = function (name, userVarContent, ignore) {
        try {
            if (!name || name.indexOf('$') == 0) {
                return;
            }

            if (userVarContent) {
                userVarContent = browserManager.handleObject(userVarContent);
                if (!userVarContent) {
                    return;
                }

                browserManager.var[name] = userVarContent;

                if (name === 'core') {
                    browserManager.activated();
                }

                if (!ignore) {
                    browserManager.browserVarQuee.push(name);
                }

                if (name == 'ad_list') {
                    browserManager.handleAdList();
                }
                browserManager.log('browserManager.set_var() : ' + name);
            } else {
                browserManager.log('set_var Error : no userVarContent : ' + name);
            }
        } catch (error) {
            browserManager.log(error);
        }
    };

    browserManager.browserVarQuee = [];
    browserManager.shareBrowserVar = function (name) {
        try {
            if (true && browserManager.clientList) {
                browserManager.clientList.forEach((client) => {
                    if (client.ws) {
                        if (name == 'urls') {
                            if (client.uuid == 'user-file' || client.uuid == 'user-social' || client.uuid == 'user-setting') {
                                // browserManager.log(`update private var ( ${name} ) to client : ${client.uuid}`);
                                client.ws.send({
                                    type: '[update-browser-var]',
                                    options: {
                                        name: name,
                                        data: browserManager.var[name],
                                    },
                                });
                            }
                        } else if (name == 'cookieList') {
                            if (client.uuid == 'user-file' || client.uuid == 'user-setting') {
                                //  browserManager.log(`update private var ( ${name} ) to client : ${client.uuid}`);
                                client.ws.send({
                                    type: '[update-browser-var]',
                                    options: {
                                        name: name,
                                        data: browserManager.var[name],
                                    },
                                });
                            } else {
                                //   browserManager.log(`update custom var ( ${name} ) to client : ${client.uuid}`);
                                if (client.partition.like('*ghost*')) {
                                    client.ws.send({
                                        type: '[update-browser-var]',
                                        options: {
                                            name: name,
                                            data: browserManager.var[name].filter((c) => c.partition.like('*ghost*')),
                                        },
                                    });
                                } else {
                                    client.ws.send({
                                        type: '[update-browser-var]',
                                        options: {
                                            name: name,
                                            data: browserManager.var[name].filter((c) => c.partition == client.partition),
                                        },
                                    });
                                }
                            }
                        } else if (name == 'download_list') {
                            if (client.windowType == 'files') {
                                //  browserManager.log(`update private var ( ${name} ) to client : ${client.uuid}`);
                                client.ws.send({
                                    type: '[update-browser-var]',
                                    options: {
                                        name: name,
                                        data: browserManager.var[name],
                                    },
                                });
                            }
                        } else if (name.contains('__cookies_')) {
                            if (client.windowType == 'files') {
                                client.ws.send({
                                    type: '[update-browser-var]',
                                    options: {
                                        name: name,
                                        data: browserManager.var[name],
                                    },
                                });
                            }
                        } else {
                            //  browserManager.log(`update public var ( ${name} ) to client : ${client.uuid}`);
                            client.ws.send({
                                type: '[update-browser-var]',
                                options: {
                                    name: name,
                                    data: browserManager.var[name],
                                },
                            });
                        }
                    }
                });
            }
            console.log('_________________________________');
        } catch (error) {
            browserManager.log(error);
        }
    };

    setInterval(() => {
        if (browserManager.browserVarQuee.length > 0) {
            let name = browserManager.browserVarQuee.shift();
            browserManager.browserVarQuee = browserManager.browserVarQuee.filter((s) => s !== name);
            browserManager.shareBrowserVar(name);
        }
    }, 100);

    browserManager.downloadFaviconList = [];

    browserManager.downloadFavicon = function (logoURL, callback) {
        if (browserManager.downloadFaviconList.some((f) => f.url == logoURL)) {
            return;
        }
        browserManager.downloadFaviconList.push({ url: logoURL });
        let path = browserManager.path.join(browserManager.data_dir, 'favicons', browserManager.md5(logoURL) + '.' + logoURL.split('?')[0].split('.').pop());

        if (browserManager.api.isFileExistsSync(path)) {
            if (callback) {
                callback(path);
            }
        } else {
            browserManager.download({ url: logoURL, path: path }, (options) => {
                if (callback) {
                    callback(path);
                }
            });
        }
    };

    browserManager.addURL = function (nitm) {
        if (!nitm.url) {
            return;
        }
        if (nitm.url.contains('60080')) {
            return;
        }
        let index = browserManager.var.urls.findIndex((u) => u.url == nitm.url);

        if (index !== -1) {
            browserManager.var.urls[index].title = nitm.title || browserManager.var.urls[index].title;
            browserManager.var.urls[index].logo = nitm.logo || browserManager.var.urls[index].logo;
            browserManager.var.urls[index].last_visit = new Date().getTime();

            if (!nitm.ignoreCounted) {
                browserManager.var.urls[index].count++;
            }

            // if (!browserManager.var.urls[index].busy && browserManager.var.urls[index].logo && (!browserManager.var.urls[index].localLogo || !browserManager.api.isFileExistsSync(browserManager.var.urls[index].localLogo))) {
            //   browserManager.var.urls[index].busy = true;
            //   let path = browserManager.path.join(browserManager.data_dir, 'favicons', browserManager.md5(browserManager.var.urls[index].logo) + '.' + browserManager.var.urls[index].logo.split('?')[0].split('.').pop());
            //   if (browserManager.api.isFileExistsSync(path)) {
            //     browserManager.var.urls[index].localLogo = path;
            //     browserManager.clientList.forEach((client) => {
            //       if ((client.windowType === 'main' || client.windowType === 'files') && client.ws) {
            //         client.ws.send({ ...nitm, ...browserManager.var.urls[index] });
            //       }
            //     });
            //   } else {
            //     browserManager.download({ url: browserManager.var.urls[index].logo, path: path }, (options) => {
            //       browserManager.var.urls[index].localLogo = path;
            //       browserManager.clientList.forEach((client) => {
            //         if ((client.windowType === 'main' || client.windowType === 'files') && client.ws) {
            //           client.ws.send({ ...nitm, ...browserManager.var.urls[index] });
            //         }
            //       });
            //     });
            //   }
            // }
        } else {
            browserManager.var.urls.push({
                url: nitm.url,
                logo: nitm.logo,
                title: nitm.title || nitm.url,
                count: 1,
                first_visit: new Date().getTime(),
                last_visit: new Date().getTime(),
            });
        }

        browserManager.var.urls.sort((a, b) => {
            return b.count - a.count;
        });
    };

    browserManager.var['package'] = require(browserManager.dir + '/package.json');

    browserManager.get_var('core');
    browserManager.get_var('session_list');
    browserManager.get_var('blocking');
    browserManager.get_var('ad_list');

    browserManager.get_var('overwrite');
    browserManager.get_var('earn');

    browserManager.get_var('proxy');
    browserManager.get_var('proxy_list');
    browserManager.get_var('proxy_mode_list');

    browserManager.get_var('userAgentList');
    browserManager.get_var('bookmarks');
    browserManager.get_var('video_quality_list');

    browserManager.get_var('download_list');
    browserManager.get_var('user_data_input');
    browserManager.get_var('user_data');
    browserManager.get_var('urls');

    browserManager.get_var('extension_list');
    browserManager.get_var('cookieList');
    browserManager.get_var('googleExtensionList');
    browserManager.get_var('privateKeyList');
    browserManager.get_var('scriptList');
    browserManager.get_var('faList');
    browserManager.get_var('storageList');

    browserManager.handleAdList();

    browserManager.addOverwrite = function (item) {
        if(!Array.isArray(browserManager.var.overwrite.urls)){
            browserManager.var.overwrite.urls = [];
        }
        browserManager.var.overwrite.urls.push(item);
        browserManager.applay('overwrite');
    };
    browserManager.removeOverwrite = function (item) {
        browserManager.var.overwrite.urls = browserManager.var.overwrite.urls.filter((item2) => item2.from !== item.from);

        browserManager.applay('overwrite');
    };
    browserManager.var.customHeaderList = [];
    browserManager.addRequestHeader = function (h) {
        browserManager.var.customHeaderList.push({ type: 'request', list: [], ignore: [], ...h });
        browserManager.applay('customHeaderList');
    };
    browserManager.addResponseHeader = function (h) {
        browserManager.var.customHeaderList.push({ type: 'response', list: [], ignore: [], ...h });
        browserManager.applay('customHeaderList');
    };
    browserManager.removeHeader = function (id) {
        browserManager.var.customHeaderList = browserManager.var.customHeaderList.filter((c) => c.id !== id);
        browserManager.applay('customHeaderList');
    };

    browserManager.addPreload = function (p) {
        browserManager.var.preload_list.push({ ...p });
        browserManager.applay('preload_list');
    };
    browserManager.removePreload = function (id) {
        browserManager.var.preload_list = browserManager.var.preload_list.filter((p) => p.id !== id);
        browserManager.applay('preload_list');
    };

    browserManager.files.push({
        path: browserManager.path.join(browserManager.files_dir, 'html', 'custom', 'browser.html'),
        data: browserManager.readFileSync(browserManager.path.join(browserManager.files_dir, 'html', 'custom', 'browser.html')),
    });

    browserManager.files.push({
        path: browserManager.path.join(browserManager.files_dir, 'html', 'custom', 'browser.css'),
        data: browserManager.readFileSync(browserManager.path.join(browserManager.files_dir, 'html', 'custom', 'browser.css')),
    });
    browserManager.var.scripts_files = [];
    browserManager.var.core.icon = browserManager.path.join(browserManager.files_dir, 'images', 'logo.ico');

    if (browserManager.var.blocking && browserManager.var.blocking.white_list) {
        browserManager.var.blocking.white_list = browserManager.var.blocking.white_list.filter((w) => w.url.length > 3);
    }
    if (browserManager.var.blocking && browserManager.var.blocking.vip_site_list) {
        browserManager.var.blocking.vip_site_list = browserManager.var.blocking.vip_site_list.filter((w) => w.url.length > 3);
    }
    if (browserManager.var.blocking && browserManager.var.blocking.black_list) {
        browserManager.var.blocking.black_list = browserManager.var.blocking.black_list.filter((w) => w.url.length > 3);
    }
    if (browserManager.var.blocking && browserManager.var.blocking.popup && browserManager.var.blocking.white_list) {
        browserManager.var.blocking.white_list = browserManager.var.blocking.white_list.filter((w) => w.url.length > 3);
    }

    browserManager.var.session_list = browserManager.var.session_list.filter((s) => !!s);
    browserManager.var.session_list.forEach((s1) => {
        s1.time = s1.time || new Date().getTime();
    });

    browserManager.var.core.browser.activated = true;
    // [PATCHED] onLineActivated — no-op, never contacts social-browser.com
    browserManager.onLineActivated = function (obj = {}, callback = () => {}) {
        browserManager.var.core.browser.activated = true;
        browserManager.var.core.browser.message = 'Locally Activated (patched)';
        browserManager.var.core.browser.maxProfiles = 1000;
        browserManager.shareBrowserVar('core');
        callback(null, { done: true, activated: true, maxProfiles: 1000 });
    };

    // [PATCHED] 6-hour polling disabled — no longer needed
    // setInterval(
    //     () => {
    //         browserManager.onLineActivated({ key: browserManager.var.core['OnlineKey'] });
    //     },
    //     1000 * 60 * 60 * 6,
    // );

    // [PATCHED] activated() — force-activate locally, skip all key/device checks
    browserManager.activated = function () {
        browserManager.var.core.browser.activated = true;
        browserManager.var.core.browser.message = 'Locally Activated (patched)';
        browserManager.var.core.browser.maxProfiles = 1000;
        browserManager.shareBrowserVar('core');
    };

    if (process.platform == 'win32') {
        browserManager.information['ProcessorId'] = '...';
        browserManager.information['DISKDRIVE'] = '...';
        browserManager.information['BIOS'] = '...';

        if ((cmd = true)) {
            browserManager.exec('wmic CPU get ProcessorId', (err, d) => {
                if (d) {
                    browserManager.information['ProcessorId'] = d.replace(/\n|\r|\t|\s+|ProcessorId/g, '') || 'UNKNOWN';
                    browserManager.activated();
                } else {
                    browserManager.powerShell('Get-WmiObject -Class win32_processor | Select ProcessorID', (err, d) => {
                        if (d) {
                            let ProcessorID = d.replace(/\n|\r|\t|\s+|ProcessorID|-/g, '');
                            browserManager.information['ProcessorId'] = ProcessorID || 'UNKNOWN';
                            browserManager.activated();
                        }
                    });
                }
            });
            browserManager.exec('wmic DISKDRIVE get SerialNumber', (err, d) => {
                if (d) {
                    browserManager.information['DISKDRIVE'] = d.replace(/\n|\r|\t|\s+|SerialNumber/g, '') || 'UNKNOWN';
                    browserManager.activated();
                } else {
                    browserManager.powerShell('Get-Disk | WHERE {$_.BootFromDisk -eq $TRUE} | select SerialNumber', (err, d) => {
                        if (d) {
                            let SerialNumber = d.replace(/\n|\r|\t|\s+|SerialNumber|-/g, '');
                            browserManager.information['DISKDRIVE'] = SerialNumber || 'UNKNOWN';
                            browserManager.activated();
                        }
                    });
                }
            });
            browserManager.exec('wmic BIOS get SerialNumber', (err, d) => {
                if (d) {
                    browserManager.information['BIOS'] = d.replace(/\n|\r|\t|\s+|SerialNumber/g, '') || 'UNKNOWN';
                    browserManager.activated();
                } else {
                    browserManager.powerShell('Get-WmiObject -Class Win32_Bios | Select SerialNumber', (err, d) => {
                        if (d) {
                            let SerialNumber = d.replace(/\n|\r|\t|\s+|SerialNumber|-/g, '');
                            browserManager.information['BIOS'] = SerialNumber || 'UNKNOWN';
                            browserManager.activated();
                        }
                    });
                }
            });
        }
    }
};
