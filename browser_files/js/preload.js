let _____ = {};
if (typeof Window !== 'undefined') {
    _____ = Object.create(Window.prototype);
}
Object.assign(_____, {
    navigator: {},
    var: {
        core: { id: '' },
        overwrite: {
            urls: [],
        },
        sites: [],
        session_list: [],
        blocking: {
            javascript: {},
            privacy: { languages: 'en', connection: {} },
            youtube: {},
            social: {},
            popup: { white_list: [] },
        },
        facebook: {},
        white_list: [],
        black_list: [],
        open_list: [],
        preload_list: [],
        context_menu: { dev_tools: true, inspect: true },
        customHeaderList: [],
    },

    session: {
        name: 'ghost_' + new Date().getTime(),
        display: 'ghost',
        privacy: { languages: 'en', connection: {} },
    },
    menu_list: [],
    video_list: [],
    windowOpenList: [],
    events: [],
    eventOff: '',
    eventOn: '',
    onEventOFF: [],
    jqueryOff: '',
    jqueryOn: '',
    isDeveloperMode: function () {
        if (_____.from123) {
            return _____.var.core.id.contain(_____.from123('4218377842387269461837734919325746793191'));
        }
        return false;
    },
    log: function (...args) {
        if (_____.isDeveloperMode()) {
            try {
                console.log(...args);
            } catch (error) {
                console.log(error);
            }
        }
    },
});

(function loadCore() {
    _____.__define = function (o, p, v, op = {}) {
        try {
            o[p] = v;
            if (o.prototype) {
                o.prototype[p] = v;
            }
            Object.defineProperty(o, p, {
                enumerable: !0,
                get: function () {
                    return v;
                },
                ...op,
            });
        } catch (error) {
            // _____.log(error);
        }
    };
    _____.__setConstValue = function (o, p, v) {
        try {
            Object.defineProperty(o, p, {
                get() {
                    return v;
                },
                set(value) {
                    _____.log(p + ' !== ', value);
                },
            });
        } catch (error) {
            // _____.log(error);
        }
    };
    _____.__toString = function (o, v) {
        _____.__setConstValue(o, 'toString', () => v);
    };

    _____.__maskFunction = function (o, p, v) {
        let s1 = o[p].toString();
        let p1 = Object.create(Object.getPrototypeOf(o[p] || function () {}));
        _____.__setConstValue(o, p, v);
        _____.__toString(o[p], s1);
        return o[p];
    };

    _____.__maskObject = function (o, p, maskObject = {}) {
        let newObject = Object.create(Object.getPrototypeOf(o[p] || {}));
        for (const key in maskObject) {
            if (!Object.hasOwn(maskObject, key)) continue;

            _____.__setConstValue(newObject, key, maskObject[key]);
        }
        return newObject;
    };

    if (true) {
        _____.escapeRegExp = function (s = '') {
            if (!s) {
                return '';
            }
            if (typeof s !== 'string') {
                s = s.toString();
            }
            return s.replace(/[\/\\^$*+.()\[\]{}]/g, '\\$&');
        };

        if (!String.prototype.test) {
            _____.__define(String.prototype, 'test', function (reg, flag = 'gium') {
                try {
                    return new RegExp(reg, flag).test(this);
                } catch (error) {
                    return false;
                }
            });
        }

        if (!String.prototype.like) {
            _____.__define(String.prototype, 'like', function (name) {
                if (typeof name === 'number') {
                    name = name.toString();
                } else if (typeof name !== 'string') {
                    return false;
                }
                let r = false;
                name.split('|').forEach((n) => {
                    n = n.split('*');
                    n.forEach((w, i) => {
                        n[i] = _____.escapeRegExp(w);
                    });
                    n = n.join('.*');
                    if (this.test('^' + n + '$', 'gium')) {
                        r = true;
                    }
                });
                return r;
            });
        }

        if (!String.prototype.contain) {
            _____.__define(String.prototype, 'contain', function (name = '') {
                if (typeof name === 'number') {
                    name = name.toString();
                } else if (typeof name !== 'string') {
                    return false;
                }
                return name.split('|').some((n) => n && this.test('^.*' + _____.escapeRegExp(n) + '.*$', 'gium'));
            });
        }
        if (!String.prototype.contains) {
            _____.__define(String.prototype, 'contains', function (name = '') {
                if (typeof name === 'number') {
                    name = name.toString();
                } else if (typeof name !== 'string') {
                    return false;
                }
                return name.split('|').some((n) => n && this.test('^.*' + _____.escapeRegExp(n) + '.*$', 'gium'));
            });
        }
    }

    _____.copyObject =
        _____.clone =
        _____.cloneObject =
            function (obj, level = 0, maxLevel = 4) {
                try {
                    if (Array.isArray(obj)) {
                        let newArray = [];
                        for (let index = 0; index < obj.length; index++) {
                            newArray[index] = _____.cloneObject(obj[index], level + 1, maxLevel);
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
                        } else if (obj[key] instanceof Node) {
                            newObject[key] = undefined;
                        } else if (typeof obj[key] === 'object') {
                            if (level < maxLevel) {
                                newObject[key] = _____.cloneObject(obj[key], level + 1, maxLevel);
                            } else {
                                newObject[key] = obj[key];
                            }
                        } else {
                            newObject[key] = obj[key];
                        }
                    }
                    return newObject;
                } catch (error) {
                    _____.log(error);
                    return obj;
                }
            };

    _____.random = _____.randomNumber = function (min = 1, max = 1000) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
})();

_____.electron = require('electron');
_____.ipcRenderer = _____.electron.ipcRenderer;
_____.contextBridge = _____.electron.contextBridge;

_____.Buffer = Buffer;

_____.hostname = document.location.hostname;
_____.origin = document.location.origin || _____.hostname;
_____.domain = _____.hostname.split('.');
_____.domain = _____.domain.slice(_____.domain.length - 2).join('.');
_____.domainStorage = _____.domain;

_____.href = document.location.href;
if (_____.href.like('*60080*|browser*')) {
    _____.isLocal = true;
}

if ((_____.policyTRUE = true)) {
    try {
        if (!window.trustedTypes.defaultPolicy) {
            _____.defaultPolicyActivated = true;
            window.trustedTypes.createPolicy('default', {
                createHTML: (string) => string,
                createScriptURL: (string) => string,
                createScript: (string) => string,
            });
            let s1 = window.trustedTypes.defaultPolicy.createScript.toString();
            window.trustedTypes.createPolicy0 = window.trustedTypes.createPolicy;
            window.trustedTypes.createPolicy = function (name, rules) {
                if (name == 'default') {
                    return window.trustedTypes.defaultPolicy;
                } else {
                    return window.trustedTypes.createPolicy0(name, rules);
                }
            };
            _____.__toString(window.alert, s1);
        }
        _____.policy = window.trustedTypes.createPolicy('social', {
            createHTML: (string) => string,
            createScriptURL: (string) => string,
            createScript: (string) => string,
        });
    } catch (error) {
        _____.log(error);
    }
}

_____.require = function (path, ...args) {
    return new Promise((resolve, reject) => {
        let code = _____.ipcSync('[read-file]', path);
        if (code) {
            _____.executeJavaScript(code).then((result) => {
                resolve(result);
            });
        }
    });
};

_____.requireAsFile = function (code, ...args) {
    let name = _____.md5(_____.partition + new Date().getTime().toString() + Math.random().toString());
    let path = _____.data_dir + '\\sessionData\\' + name + '_tmp.js';

    _____.writeFile({ path: path, data: code });
    let result = require(path);
    _____.ipcSync('[delete-file]', path);

    return result;
};


_____.eval = function (code) {
    if (code instanceof Function) {
        code = code.toString();
        code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
    }

    if (_____.customSetting.sandbox) {
        return _____.executeJavaScript(code);
    } else {
        return _____.requireAsFile(code);
    }
};

_____.runUserScript = async function (_script) {
    if (_____.isIframe()) {
        if (_script.iframe) {
            let js = await _____.handleUserScript(_script.js);
            if (_script.preload) {
                _____.eval(js);
            } else {
                _____.onLoad(async () => {
                    await _____.insertCSS(_script.css);
                    _____.addHTML(_script.html);
                    await _____.executeJavaScript(js);
                });
            }
        }
    } else {
        if (_script.window) {
            let js = await _____.handleUserScript(_script.js);
            if (_script.preload) {
                _____.eval(js);
            } else {
                _____.onLoad(async () => {
                    await _____.insertCSS(_script.css);
                    _____.addHTML(_script.html);
                    await _____.executeJavaScript(js);
                });
            }
        }
    }
};

_____.isIframe = function () {
    return !process.isMainFrame;
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

_____.process = () => process;

_____.propertyList =
    'earn,download_list,faList,scripts_files,user_data,user_data_input,sites,preload_list,scriptList,privateKeyList,googleExtensionList,ad_list,proxy_list,proxy,core,bookmarks,session_list,userAgentList,blocking,video_quality_list,customHeaderList';

_____.callSync = _____.ipcSync = function (channel, value = {}, direct = false) {
    try {
        if (direct) {
            return _____.ipcRenderer.sendSync(channel, value);
        } else {
            if (typeof value == 'object') {
                // if (_____.window) {
                //     value.windowID = value.windowID || _____.window.id;
                //     value.windowID = parseInt(value.windowID);
                // }
                // if (_____.webContents) {
                //     value.parentFrame = {
                //         processId: _____.webContents.getProcessId(),
                //         frameToken: _____.electron.webFrame.frameToken,
                //     };
                // }

                if (channel == '[open new popup]' || channel == '[open new tab]') {
                    if (!_____.isLocal) {
                        value.referrer = value.referrer || document.location.href;
                    }
                    value = _____.cloneObject(value);
                }
            }

            return _____.ipcRenderer.sendSync(channel, value);
        }
    } catch (error) {
        _____.log(channel, error);
        _____.log(value);
        return undefined;
    }
};

_____.invoke = _____.ipc = function (channel, value = {}, direct = false) {
    if (direct) {
        return _____.ipcRenderer.invoke(channel, value);
    } else {
        if (typeof value == 'object') {
            if (_____.window) {
                value.windowID = value.windowID || _____.window.id;
                value.windowID = parseInt(value.windowID);
            }
            if (_____.webContents) {
                value.parentFrame = {
                    processId: _____.webContents.getProcessId(),
                    frameToken: _____.electron.webFrame.frameToken,
                };
            }

            if (channel == '[open new popup]' || channel == '[open new tab]') {
                if (!_____.isLocal) {
                    value.referrer = value.referrer || document.location.href;
                }
                value = _____.cloneObject(value);
            }
        }

        return _____.ipcRenderer.invoke(channel, value);
    }
};
_____.on = function (name, callback) {
    return _____.ipcRenderer.on(name, callback);
};
_____.once = function (name, callback) {
    return _____.ipcRenderer.once(name, callback);
};
_____.off = function (name, callback) {
    return _____.ipcRenderer.off(name, callback);
};
_____.md5 = function (txt) {
    return _____.ipcSync('[md5]', txt);
};

_____.fnAsync = function (fn, ...params) {
    return _____.ipc('[fn]', { fn: fn, params: params });
};
_____.fn = function (fn, ...params) {
    return _____.ipcSync('[fn]', { fn: fn, params: params });
};

_____.set = function (property, value) {
    _____.ipcSync('[set]', { property: property, value: value });
};
_____.get = function (property) {
    return _____.ipcSync('[get]', { property: property });
};

_____.updateBrowserVar = function (name, data) {
    _____.ipc('[update-browser-var]', {
        name: name,
        data: data,
    });
};

_____.setStorage = function (key, value, options = {}) {
    let storage = { key: key, value: value, type: typeof value, domain: _____.domainStorage, ...options };
    if (storage.type === 'object') {
        storage.value = _____.cloneObject(storage.value);
    }

    _____.fn('setStorage', storage);
};
_____.getStorage = function (key, defaultValue, options = {}) {
    let storage = _____.fn('getStorage', { key: key, domain: _____.domainStorage, ...options });
    if (storage) {
        defaultValue = storage.value;
    }
    return defaultValue;
};
_____.deleteStorage = function (key, options = {}) {
    return _____.fn('deleteStorage', { key: key, domain: _____.domainStorage, ...options });
};
_____.listStorage = function (options = {}) {
    return _____.fn('listStorage', { domain: _____.domainStorage, ...options });
};
_____.listStorageKeys = function (options = {}) {
    return _____.fn('listStorageKeys', { domain: _____.domainStorage, ...options });
};
_____.listStorageValues = function (options = {}) {
    return _____.fn('listStorageValues', { domain: _____.domainStorage, ...options });
};

_____.remove = function (key) {
    try {
        if (!key) {
            return false;
        }
        if (!_____.isMemoryMode) {
            if (key == '*') {
                window.localStorage.clear();
            } else {
                window.localStorage.removeItem(key);
            }

            return true;
        } else if (window.sessionStorage) {
            if (key == '*') {
                window.sessionStorage.clear();
            } else {
                window.sessionStorage.removeItem(key);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.warn(error);
        return false;
    }
    return false;
};

_____.openNewTab = function (options = {}) {
    if (typeof options === 'string') {
        options = { url: options };
    }
    _____.ipc('[open new tab]', {
        referrer: document.location.href,
        url: document.location.href,
        partition: _____.partition,
        user_name: _____.session.display,
        mainWindowID: _____.window.id,
        ...options,
    });
    return true;
};
_____.openNewPopup = function (options = {}) {
    if (typeof options === 'string') {
        options = { url: options };
    }
    _____.ipc('[open new popup]', {
        url: document.location.href,
        show: true,
        alwaysOnTop: true,
        center: true,
        referrer: document.location.href,
        partition: _____.partition,
        user_name: _____.session.display,
        mainWindowID: _____.window.id,
        ...options,
    });
    return true;
};

_____.selectFile = function (options) {
    return _____.ipcSync('[select-file]', options);
};
_____.selectSaveFile = function (options) {
    return _____.ipcSync('[select-save-file]', options);
};
_____.writeFile = function (options) {
    return _____.ipcSync('[write-file]', options);
};
_____.selectFolder = function () {
    return _____.ipcSync('[select-folder]');
};

_____.init2 = function () {
    _____.isMainBrowserData = true;
    _____.browserAppProcessID = _____.browserData.browserAppProcessID;
    _____.browserAppIndex = _____.browserData.browserAppIndex;
    _____.uuid = _____.browserData.uuid;
    _____.var = _____.browserData.var;
    _____.dir = _____.browserData.dir;
    _____.data_dir = _____.browserData.data_dir;
    _____.userDataDir = _____.browserData.userDataDir;
    _____.files_dir = _____.browserData.files_dir;
    _____.injectedHTML = _____.browserData.injectedHTML;
    _____.injectedCSS = _____.browserData.injectedCSS;
    _____.newTabData = _____.browserData.newTabData;
    _____.session = { ..._____.session, ..._____.browserData.session };
    _____.partition = _____.browserData.partition;
    _____._customSetting = _____.browserData.customSetting;
    _____.userAgentBrowserList = _____.browserData.userAgentBrowserList;
    _____.timeZones = _____.browserData.timeZones;
    _____.languageList = _____.browserData.languageList;
    _____.effectiveTypeList = _____.browserData.effectiveTypeList;
    _____.connectionTypeList = _____.browserData.connectionTypeList;
    _____.userAgentDeviceList = _____.browserData.userAgentDeviceList;

    _____.id = _____.var.core.id;

    _____.tempMailServer = _____.var.core.emails.domain || 'social-browser.com';
    _____.userAgentData = _____._customSetting.userAgentData || {};
    _____.customSetting = new Proxy(_____._customSetting, {
        get(target, name, receiver) {
            if (name == '_') {
                return target;
            } else {
                return _____.get('customSetting.' + name);
            }
        },
        set(target, name, value, receiver) {
            if (typeof value == 'function') {
                value = value.toString();
                value = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
            }
            _____.set('customSetting.' + name, value);
            return true;
        },
    });

    _____.log(` ... ${document.location.href} ... `);

    if (!_____.customSetting.iframe && _____.isIframe()) {
        return;
    }

    _____.customSetting.active = false;

    (function loadEvents() {
        if (true) {
            _____.events_list = [];
            _____.quee_list = [];
            _____.quee_busy_list = [];

            _____.quee_check = function (name, fire) {
                if (!fire) {
                    if (_____.quee_busy_list[name]) {
                        return;
                    }
                }
                _____.quee_busy_list[name] = !0;
                let end = !1;
                _____.quee_list.forEach((quee, i) => {
                    if (end) {
                        return;
                    }
                    if (quee.name == name) {
                        end = !0;
                        _____.quee_list.splice(i, 1);
                        for (var i = 0; i < _____.events_list.length; i++) {
                            var ev = _____.events_list[i];
                            if (ev.name == name) {
                                ev.callback(quee.data, quee.callback2, () => {
                                    _____.quee_busy_list[name] = !1;
                                    _____.quee_check(name, !0);
                                });
                            }
                        }
                    }
                });
                if (!end) {
                    _____.quee_busy_list[name] = !1;
                }
            };

            _____.onEvent = function (name, callback) {
                if (Array.isArray(name)) {
                    name.forEach((n) => {
                        _____.events_list.push({
                            name: n,
                            callback: callback || function () {},
                        });
                    });
                } else {
                    _____.events_list.push({
                        name: name,
                        callback: callback || function () {},
                    });
                }
            };

            _____.callEvent = function (name, data, callback2) {
                for (var i = 0; i < _____.events_list.length; i++) {
                    var ev = _____.events_list[i];
                    if (ev.name == name) {
                        ev.callback(data, callback2);
                    }
                }
            };

            _____.quee = function (name, data, callback2) {
                _____.quee_list.push({
                    name: name,
                    data: data,
                    callback2: callback2,
                });

                _____.quee_check(name);
            };

            _____.getTelegramBot = function (options) {
                options.fetch = function (endPoint, callback) {
                    _____.fetchJson(
                        {
                            url: options.api + endPoint,
                            method: 'POST',
                            redirect: 'follow',
                            body: JSON.stringify(options),
                        },
                        (data) => {
                            if (callback) {
                                callback(data);
                            }
                        },
                    );
                };

                options.sendMessage = function (chatID, message, callback) {
                    if (chatID && message) {
                        options.chatID = chatID;
                        options.message = message;
                        options.fetch('/telegram/send-message');
                    }
                };

                return options;
            };

            _____.createTelegramBot = function (options = {}) {
                options.api = 'http://127.0.0.1:60080';
                let bot = _____.getTelegramBot(options);
                bot.fetch('/telegram/connect', (data) => {
                    if (callback) {
                        callback(data);
                    } else {
                        _____.log(data);
                    }
                });
                return bot;
            };

            _____.connectTelegramBot = function (options = {}, callback) {
                options.api = 'https://social-browser.com';
                let bot = _____.getTelegramBot(options);
                bot.fetch('/telegram/connect', (data) => {
                    if (callback) {
                        callback(data);
                    } else {
                        _____.log(data);
                    }
                });
                return bot;
            };
        }
    })();

    (function loadFn() {
        if (true) {
            _____.ws = function (message) {
                _____.ipc('ws', message);
            };
            _____.share = function (data) {
                _____.ipc('share', data);
            };
            _____.onShareFnList = [];
            _____.onShare = function (fn) {
                _____.onShareFnList.push(fn);
            };
            _____.on('share', (e, data) => {
                _____.onShareFnList.forEach((fn) => {
                    fn(data);
                });
            });
            _____.on('[dom-ready]', (e, data) => {
                _____.isLoaded = true;
                _____.onLoadedFnList.forEach((info) => {
                    if (!info.loaded) {
                        info.loaded = true;
                        try {
                            info.fn();
                            info.resolve();
                        } catch (error) {
                            info.resolve();
                        }
                    }
                });
            });
            _____.workerCodeString = '';
            _____.executeJavaScriptWorker = function (_id, code, url) {
                _id = 'window.' + _id;
                code = code.replaceAll('globalThis', _id + '');
                code = code.replaceAll('window.location', 'location');
                code = code.replaceAll('document.location', 'location');
                code = code.replaceAll('self.trustedTypes', _id + '.trustedTypes');
                code = code.replaceAll('self.postMessage', _id + '.postMessage2');
                code = code.replaceAll('parentPort.postMessage', _id + '.postMessage2');
                code = code.replaceAll('self.onmessage', _id + '.onmessage2');
                code = code.replaceAll('self', _id + '');
                code = code.replaceAll('parentPort', _id + '');
                code = code.replaceAll('debugger;', ' ');
                code = code.replaceAll('var ', 'let ');

                code = code.replaceAll(_id + '.' + _id, _id);
                code = code + ';if(onmessage) { ' + _id + '.onmessage2 = onmessage; }';
                code = code + ';_____.showUserMessage("Web Worker Detected <p><a>' + url + '</a></p>")';
                code = `${_id}._ =  function(window , unsafeWindow , location  , postMessage ){ try { ${code} } catch (err) {globalThis.this.alert(err)} };${_id}._(${_id}  , window , ${_id}.location  , ${_id}.postMessage2);`;
                _____.workerCodeString += code + '\n//# sourceURL=' + url + '\n';

              return  _____.executeJavaScript(code);
            };
            _____.serviceWorker = navigator.serviceWorker;

            const originalWindowWorker = window.Worker;
            _____.workerlist = [];
            _____.newWorkerURLs = [];
            _____.newWorker = function (url, options, _worker, codeString = null) {
                if (url && _____.newWorkerURLs.some((u) => u == url)) {
                    let index = _____.workerlist.findIndex((w) => w.url == url);
                    if (index !== -1) {
                        _____.workerlist[index].terminate();
                        _____.workerlist.splice(index, 1);
                    }
                    _____.showUserMessage('Dublicate Web Worker Detected <br>' + url);
                    return new originalWindowWorker(url, options, _worker);
                }
                _____.newWorkerURLs.push(url);

                if (!codeString && _____.var.blocking.javascript.allowWorkerByVideo && document.querySelector('video')) {
                    _____.showUserMessage('Web Worker video Detected <br>' + url);
                    return new originalWindowWorker(url, options, _worker);
                }

                if (_____.allowDefaultWorker) {
                    return new originalWindowWorker(url, options, _worker);
                }

                _____.showUserMessage('New Worker Running <p>' + url + '</p>');

                if (codeString) {
                    return _____.openWindow({
                        isWorker: true,
                        url: 'browser://newTab',
                        show: true,
                        eval: () => {
                            var _____ = globalThis.this;
                            _____.eval(codeString);
                        },
                    });
                } else {
                    if (url instanceof URL) {
                        url = url.href;
                    } else {
                        url = _____.handleURL(url.toString());
                    }

                    if (options && options.type == 'module') {
                        _____.showUserMessage('New Module Worker Running <p>' + url + '</p>');
                    }

                    let win = _____.openWindow({
                        isWorker: true,
                        url: url,
                        show: false,

                        eval: () => {
                            var _____ = globalThis.this;
                            _____.onLoad(() => {
                                let code = document.querySelector('body pre')?.textContent;
                                if (code) {
                                    code = code
                                        .replaceAll('self.importScripts', 'importScripts')
                                        .replaceAll('document', 'undefined')
                                        .replaceAll('debugger;', '')
                                        .replaceAll('importScripts', 'await importScripts');
                                    code = '(async()=>{' + code + '})()';
                                    document.querySelector('body pre').textContent = code;
                                    if (code.contain('import*as ')) {
                                        _____.addJS(code, { type: 'module' });
                                    } else {
                                        _____.eval(code);
                                    }
                                }
                            });
                        },
                    });

                    let newWorker = Object.create(Worker.prototype);
                    newWorker.url = url;
                    newWorker.postMessage = win.postMessage;
                    newWorker.terminate = win.terminate;
                    newWorker.on = newWorker.addEventListener = win.addEventListener;
                    newWorker.removeEventListener = win.removeEventListener;
                    win.defaultWorker = newWorker;
                    _____.workerlist.push(newWorker);
                    return newWorker;
                }

                let workerID = 'worker_' + _____.md5(url) + '_';

                if (codeString) {
                    let _id = _worker ? _worker.id : workerID;
                    _____.executeJavaScriptWorker(_id, codeString, url);
                }

                if (!codeString) {
                    if (url.indexOf('blob:') === 0) {
                        let blob = _____.blobObjectList.find((o) => o.url == url);
                        if (blob && blob.object && blob.object.type.contains('javascript')) {
                            blob.object
                                .text()
                                .then((code) => {
                                    if (code) {
                                        let _id = _worker ? _worker.id : workerID;
                                        globalThis[workerID] = _____.openWindow({
                                            show: false,
                                            url: url,
                                            eval: code,
                                        });
                                    } else {
                                        globalThis[workerID] = new originalWindowWorker(url, options, _worker);
                                    }
                                })
                                .catch((e) => {
                                    _____.log(e);
                                    globalThis[workerID] = new originalWindowWorker(url, options, _worker);
                                });
                        } else {
                            globalThis[workerID] = new originalWindowWorker(url, options, _worker);
                            return globalThis[workerID];
                        }
                    } else {
                        fetch(url)
                            .then((response) => response.text())
                            .then((code) => {
                                _____.workerCodeString += code + '\n//# First sourceURL=' + url + '\n';
                                let _id = _worker ? _worker.id : workerID;
                                globalThis[_id] = _____.openWindow({
                                    url: url,
                                    show: false,
                                    eval: () => {
                                        var _____ = globalThis.this;
                                        _____.onLoad(() => {
                                            _____.eval(document.querySelector('body pre').textContent);
                                        });
                                    },
                                });
                            });
                    }
                }

                return globalThis[workerID];

                if (_worker) {
                    return _worker;
                } else {
                    globalThis[workerID] = Object.create(Worker.prototype);
                    let worker2 = {
                        id: workerID,
                        url: url,
                        on: function () {},
                        fnEventList: [],
                        addEventListener: function (name, fn) {
                            this.fnEventList.push({ name: name, fn: fn });
                        },
                        removeEventListener: function () {},
                        importScripts: function (...args2) {
                            args2.forEach((arg) => {
                                _____.log('Import Script : ' + arg);
                                new Worker(arg, null, globalThis[workerID]);
                            });
                        },
                        terminate: function () {},
                        postMessage: function (data) {
                            this.fnEventList.forEach((e) => {});
                            if (globalThis[workerID].onmessage2) {
                                globalThis[workerID].onmessage2({ data: data });
                            } else {
                                setTimeout(() => {
                                    globalThis[workerID].postMessage(data);
                                }, 500);
                            }
                        },
                        postMessage2: function (data) {
                            if (globalThis[workerID].onmessage) {
                                globalThis[workerID].onmessage({ data: data });
                            } else {
                                setTimeout(() => {
                                    globalThis[workerID].postMessage2(data);
                                }, 500);
                            }
                        },
                        onmessage: function () {
                            _____.log('Worker onmessage', args);
                        },
                        terminate: function () {},
                    };

                    for (const key in worker2) {
                        try {
                            if (!globalThis[workerID][key]) {
                                globalThis[workerID][key] = worker2[key];
                            }
                        } catch (error) {
                            _____.log(error, key);
                        }
                    }

                    let loc = new URL(globalThis[workerID].url);
                    globalThis[workerID].location = loc;
                    _____.__setConstValue(globalThis[workerID], 'location', {
                        protocol: loc.protocol,
                        host: loc.host,
                        hostname: loc.hostname,
                        origin: loc.origin,
                        port: loc.port,
                        pathname: loc.pathname,
                        hash: loc.hash,
                        search: loc.search,
                        href: globalThis[workerID].url,
                        toString: function () {
                            return globalThis[workerID].url;
                        },
                    });
                    _____.__setConstValue(globalThis[workerID], 'window', {});
                    _____.__setConstValue(globalThis[workerID], 'document', {});
                    _____.__setConstValue(globalThis[workerID], 'trustedTypes', window.trustedTypes);

                    globalThis.importScripts = globalThis[workerID].importScripts;
                    return globalThis[workerID];
                }
            };
            _____.executeJavaScriptCodeInWorker = function (url, codeString) {
                return _____.newWorker(url, null, null, codeString);
            };

            _____.sendMessage = function (message) {
                if (typeof message !== 'object') {
                    message = { name: message };
                }

                message.windowID = message.windowID || _____.window.id;
                _____.ipc('[browserApp-message]', message);
            };
            _____.onMessageFnList = [];
            _____.onMessage = function (fn) {
                _____.onMessageFnList.push(fn);
            };
            _____.on('[browserApp-message]', (e, message) => {
                if (message.eval) {
                    _____.eval(message.eval);
                }

                _____.onMessageFnList.forEach((fn) => {
                    fn(message);
                });
            });

            _____.on('[run-user-script]', (e, _script) => {
                _____.runUserScript(_script);
            });

            _____.closeTab = function (tabID) {
                _____.ipc('[close-tab]', { tabID: tabID || _____.customSetting.tabID });
            };
            _____.showTab = function (tabID) {
                _____.ipc('[show-tab]', { tabID: tabID || _____.customSetting.tabID });
            };

            _____.showView = function (windowID) {
                _____.ipc('[show-view]', { windowID: windowID || _____.window.id });
            };

            _____.toJson = (obj) => {
                if (typeof obj === undefined || obj === null) {
                    return '';
                }
                return JSON.stringify(obj);
            };

            _____.fromJson = (str) => {
                if (typeof str !== 'string') {
                    return str;
                }
                return JSON.parse(str);
            };

            _____.toBase64 = (str) => {
                return _____.ipcSync('[toBase64]', str);
            };

            _____.fromBase64 = (str) => {
                return _____.ipcSync('[fromBase64]', str);
            };

            _____.to123 = (data) => {
                data = typeof data === 'object' ? _____.toJson(data) : data;
                return _____.ipcSync('[to123]', data);
            };

            _____.from123 = (data) => {
                if (typeof data !== 'string') {
                    return data;
                }
                data = data.trim();
                return _____.ipcSync('[from123]', data);
            };

            _____.hideObject = (obj) => {
                return _____.to123(obj);
            };
            _____.showObject = (obj) => {
                return JSON.parse(_____.from123(obj));
            };
            _____.typeOf = _____.typeof = function type(elem) {
                return Object.prototype.toString.call(elem).slice(8, -1);
            };
            _____.encryptText = function (text, password = '^^') {
                if (text && password && typeof text == 'string' && typeof password == 'string') {
                    return _____.ipcSync('[encryptText]', { text: text, password, password });
                }
            };
            _____.decryptText = function (text, password = '^^') {
                if (text && password && typeof text == 'string' && typeof password == 'string') {
                    return _____.ipcSync('[decryptText]', { text: text, password, password });
                }
            };

            _____.scope = function (selector = '[ng-controller]') {
                return angular.element(document.querySelector(selector)).scope();
            };

            _____.openExternal = function (link) {
                return _____.ipc('[open-external]', { link: link });
            };
            _____.exec = function (cmd) {
                return _____.ipc('[exec]', { cmd: cmd });
            };
            _____.exe = function (cmd, args = []) {
                return _____.ipc('[exe]', { cmd: cmd, args: args });
            };
            _____.kill = function (name) {
                return _____.ipc('[kill]', { name: name });
            };

            _____.isNativeFunction = function (f) {
                return f.toString().includes('[native code]');
            };
            _____.$downloadURL = function (url, name) {
                const link = document.createElement('a');
                link.href = url;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            _____.$screenshot = async function (options = {}, callback) {
                return new Promise((resolve, reject) => {
                    try {
                        _____.customSetting.allowAllPermissions = true;
                        let mediaDevices = navigator.mediaDevices0 || navigator.mediaDevices;
                        mediaDevices.getDisplayMedia({ video: true }).then((captureStream) => {
                            const video = document.createElement('video');
                            video.srcObject = captureStream;
                            video.autoplay = true;

                            video.onloadedmetadata = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                const context = canvas.getContext('2d');
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                                const imageDataURL = canvas.toDataURL('image/png');
                                _____.$downloadURL(imageDataURL, 'screenshot-' + _____.domain + '-' + new Date().getTime() + '.png');
                                captureStream.getTracks().forEach((track) => track.stop());

                                resolve({ imageDataURL: imageDataURL });
                                _____.showUserMessage('ScreenShot Saved <br><img src="' + imageDataURL + '" />', 1000 * 5);
                            };
                        });
                    } catch (err) {
                        reject(err);
                        console.error('Error $screenshot screen : ', err);
                        _____.customSetting.allowAllPermissions = false;
                    }
                });
            };
            _____.addSession = function (session) {
                if (_____.var.session_list.length > _____.var.core.browser.maxProfiles) {
                    let msg = 'Max Profiles Reached : ' + _____.var.core.browser.maxProfiles;
                    _____.showUserMessage(msg);
                    _____.alert(msg);
                    return null;
                }

                if (typeof session == 'string') {
                    session = {
                        display: session,
                    };
                    session.name = 'persist:' + _____.md5(session.display);
                }
                if (!session.name && session.display) {
                    session.name = 'persist:' + _____.md5(session.display);
                }

                if (session.name && session.display) {
                    if (!session.name.like('persist*')) {
                        session.name = 'persist:' + session.name;
                    }
                    let oldSession = _____.var.session_list.find((s) => s.name == session.name || s.display == session.display);
                    if (oldSession) {
                        let msg = 'Profile Exists <br> ' + oldSession.display;
                        _____.showUserMessage(msg);
                        _____.alert(msg);
                        return oldSession;
                    }

                    session.can_delete = true;
                    session.time = session.time || new Date().getTime();

                    if (!session.privacy) {
                        session.privacy = {
                            allowVPC: true,
                            vpc: _____.generateVPC('pc'),
                        };
                    }

                    if (!session.defaultUserAgent) {
                        session.defaultUserAgent = _____.getRandomBrowser('pc');
                    }

                    _____.ws({ type: '[add-session]', session: session });
                }

                return session;
            };

            _____.removeSession = _____.deleteSession = function (session) {
                if (typeof session == 'string') {
                    session = {
                        display: session,
                    };
                }

                _____.ws({ type: '[remove-session]', session: session });

                return session;
            };
            _____.hideSession = function (session) {
                if (typeof session == 'string') {
                    session = {
                        display: session,
                    };
                }

                _____.ws({ type: '[hide-session]', session: session });

                return session;
            };
            _____.add2faCode = function (fa) {
                if (typeof fa == 'string') {
                    let password = _____.var.user_data_input.find((d) => d.partition == _____.partition && d.hostname.contains(_____.domain));
                    if (password) {
                        password = password.password;
                    }
                    if (!password) {
                        password = _____.var.core.emails.password;
                    }
                    fa = {
                        code: fa,
                        domain: _____.domain,
                        partition: _____.partition,
                        email: _____.session.display,
                        password: password,
                    };
                }

                _____.ws({ type: '[add-fa]', fa: fa });

                return fa;
            };
            _____.fetch = function (options, callback) {
                if (typeof options == 'string') {
                    options = { url: options };
                }
                options.id = new Date().getTime() + Math.random();
                options.url = _____.handleURL(options.url);

                if (options.ontimeout && options.timeout) {
                    options.timeoutId = setTimeout(() => {
                        options.ontimeout();
                    }, options.timeout);
                }

                return new Promise((resolve, reject) => {
                    let newOptions = _____.cloneObject(options);
                    _____.ipc('[fetch]', newOptions).then((data) => {
                        if (data) {
                            clearTimeout(options.timeoutId);
                            if (data.error) {
                                if (options.onerror) {
                                    options.onerror(data.error);
                                }
                            } else {
                                data.responseText = data.body;
                                if (options.onload) {
                                    options.onload(data);
                                }
                                if (callback) {
                                    callback(data);
                                }

                                resolve(data);
                            }
                        }
                    });
                });
            };
            _____.fetchJson = function (options, callback) {
                if (typeof options == 'string') {
                    options = {
                        url: options,
                    };
                }
                options.id = new Date().getTime() + Math.random();
                options.url = _____.handleURL(options.url);

                return new Promise((resolve, reject) => {
                    _____.ipc('[fetch-json]', options).then((data) => {
                        if (data) {
                            if (callback) {
                                callback(data);
                            } else {
                                resolve(data);
                            }
                        }
                    });
                });
            };

            _____.getIPinformation = function (ip) {
                if (ip) {
                    return _____.$fetch('http://ip-api.com/json/' + ip + '?fields=status,message,country,regionName,city,zip,lat,lon,timezone,query', { method: 'get' }).then((res) => res.json());
                } else {
                    return _____.$fetch('http://ip-api.com/json').then((res) => res.json());
                }
            };

            _____.fetch2Captcha_request = function (options) {
                if (options.version == '2') {
                    _____.$setValue('#g-recaptcha-response', options.request).then(() => {
                        _____.log('Captcha Response Set');
                        _____.sendMessage({ name: '[user-message]', message: 'Captcha Solved' });
                        _____.sendMessage({ name: 'captcha_solved', response: request });
                    });
                } else if (options.version == '3') {
                    _____.$setValue('#g-recaptcha-response', options.request);
                    _____.sendMessage({ name: '[user-message]', message: 'Captcha Solved' });
                    _____.sendMessage({ name: 'captcha_solved', response: options.request });
                }
            };

            _____.fetch2Captcha_res = function (options) {
                _____.log(options);
                if (_____.fetch2Captcha_res_busy) {
                    return;
                }

                _____.fetch2Captcha_res_busy = true;
                _____.$every(5000, (interval) => {
                    _____.sendMessage({ name: '[user-message]', message: 'Captcha Geting Reponse' });
                    _____.$fetch(options.url, {
                        method: 'GET',
                        payload: options.payload,
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            _____.log(res);

                            if (res.status == 1) {
                                _____.fetch2Captcha_res_busy = false;
                                clearInterval(interval);
                                _____.tokenFrom2Captcha = res.request;
                                _____.sendMessage({ name: '2captcha_request', request: res.request, api_key: options.payload.key, version: options.version });
                                setTimeout(() => {
                                    let reportbadUrl = `https://2captcha.com/res.php?key=${options.payload.key}&action=reportbad&id=${options.payload.id}&json=1`;
                                    _____.$fetch(reportbadUrl)
                                        .then((res) => res.json())
                                        .then((data) => _____.log(data));
                                }, 1000 * 20);
                            }
                        });
                });
            };

            _____.fetch2Captcha_in = function (options) {
                if (_____.fetch2Captcha_in_busy) {
                    return;
                }
                _____.sendMessage({ name: '[user-message]', message: 'Captcha Start Solving' });

                _____.fetch2Captcha_in_busy = true;

                _____.$fetch(options.url, {
                    method: 'POST',
                    payload: options.payload,
                })
                    .then((res) => res.json())
                    .then((res) => {
                        let requestID = '';
                        _____.log(res);
                        requestID = res.request;

                        if (requestID) {
                            let checkResultUrl = 'https://2captcha.com/res.php';
                            let payload = {
                                key: options.payload.key,
                                action: 'get',
                                id: requestID,
                                json: 1,
                            };

                            _____.sendMessage({ name: '2captcha_res', url: checkResultUrl, version: options.version, payload: payload });
                        }
                    });
            };

            _____.run2Captcha = function () {
                if (!_____.customSetting.captcha2ApiKey && (!_____.var.blocking.javascript.captcha2ON || !_____.var.blocking.javascript.captcha2ApiKey)) {
                    return;
                }
                _____.log('2 Captcha Enabled');

                if (!_____.isIframe()) {
                    _____.$every(100, (interval) => {
                        if (typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
                            _____.showUserMessage('grecaptcha.execute Detected');
                            clearInterval(interval);
                            grecaptcha.execute0 = grecaptcha.execute;
                            grecaptcha.execute = function (sitekey, options = { action: '' }) {
                                _____.showUserMessage('grecaptcha.execute called');
                                return new Promise((resolve, reject) => {
                                    if (_____.isRecaptchaV3) {
                                        if (!_____.tokenFrom2Captcha) {
                                            let pageurl = _____.window.getURL();
                                            let API_KEY = _____.customSetting.captcha2ApiKey || _____.var.blocking.javascript.captcha2ApiKey;
                                            let byPassUrl = 'https://2captcha.com/in.php';
                                            let payload = {
                                                key: API_KEY,
                                                method: 'userrecaptcha',
                                                googlekey: sitekey,
                                                pageurl: pageurl,
                                                version: 'v3',
                                                action: options.action,
                                                min_score: 0.9,
                                                json: 1,
                                            };
                                            _____.sendMessage({ name: '2captcha_in', url: byPassUrl, version: '3', payload: payload });
                                            _____.onMessage((message) => {
                                                if (message.name == 'captcha_solved') {
                                                    resolve(_____.tokenFrom2Captcha);
                                                }
                                            });
                                        } else {
                                            grecaptcha.execute0(sitekey, options).then((token) => {
                                                _____.log('grecaptcha.execute token received', token);
                                                resolve(token);
                                            });
                                        }
                                    } else {
                                        grecaptcha.execute0(sitekey, options).then((token) => {
                                            _____.log('grecaptcha.execute token received', token);
                                            resolve(token);
                                        });
                                    }
                                });
                            };
                        }
                    });

                    _____.onLoad().then(() => {
                        _____.log('run2Captcha Check ...');

                        _____.showUserMessage('2Captcha Worked <br> Solving recaptcha', 1000 * 10);
                        _____.isRecaptchaV2 = document.querySelector('div.g-recaptcha');

                        if (_____.isRecaptchaV2) {
                            _____.showUserMessage('reCAPTCHA v2 detected');
                        }

                        _____.isRecaptchaV3 = document.querySelector('.grecaptcha-badge') !== null;

                        if (_____.isRecaptchaV3) {
                            _____.showUserMessage('reCAPTCHA v3 detected');
                        }

                        function getSiteKey() {
                            let reCaptcha = document.querySelector('.g-recaptcha');
                            if (reCaptcha) {
                                reCaptcha.dataset.sitekey;
                            }

                            const element = document.querySelector('[data-sitekey]');
                            if (element) {
                                return element.getAttribute('data-sitekey');
                            }

                            let _url = document.location.href;
                            try {
                                const url = new URL(_url);
                                const k = url.searchParams.get('k');
                                if (k) return k;
                            } catch (e) {
                                _____.log(e);
                            }

                            const iframes = document.querySelectorAll('iframe[src*="recaptcha/api2/anchor"], iframe[src*="recaptcha/enterprise/anchor"]');
                            for (let i = 0; i < iframes.length; i++) {
                                const src = iframes[i].src;
                                try {
                                    const url = new URL(src);
                                    const k = url.searchParams.get('k');
                                    if (k) return k;
                                } catch (e) {
                                    _____.log(e);
                                }
                            }

                            return null;
                        }

                        _____.sitekey = getSiteKey();

                        if (_____.isRecaptchaV2 && _____.sitekey) {
                            let pageurl = _____.window.getURL();
                            let API_KEY = _____.customSetting.captcha2ApiKey || _____.var.blocking.javascript.captcha2ApiKey;
                            let byPassUrl = 'https://2captcha.com/in.php';
                            let payload = {
                                key: API_KEY,
                                method: 'userrecaptcha',
                                googlekey: _____.sitekey,
                                pageurl: pageurl,
                                json: 1,
                            };
                            _____.sendMessage({ name: '2captcha_in', byPassUrl: byPassUrl, version: '2', payload: payload });
                        } else if (_____.isRecaptchaV3 && _____.sitekey) {
                        } else {
                            _____.log('Captcha sitekey not exists');
                        }
                    });
                }
            };

            _____.nativeImage = function (_path) {
                try {
                    if (!_path) {
                        return null;
                    }
                    return _____.electron.nativeImage.createFromPath(_path);
                } catch (error) {
                    _____.log('nativeImage', error);
                    return null;
                }
            };
            _____.shuffleArray = function (array) {
                let index = -1;
                const length = array.length;
                const lastIndex = length - 1;
                while (++index < length) {
                    const rand = random(index, lastIndex);
                    [array[index], array[rand]] = [array[rand], array[index]];
                }
                return array;
            };
            _____.try = function (fn) {
                try {
                    return fn();
                } catch (error) {
                    _____.log(error);
                }
            };
            _____.onLoadedFnList = [];
            _____.onLoad = _____.onload = function (fn) {
                return new Promise((resolve, reject) => {
                    // try {
                    //     if (typeof fn !== 'function') {
                    //         resolve();
                    //     } else if (_____.isLoaded) {
                    //         if (typeof fn === 'function') {
                    //             fn();
                    //         }
                    //         resolve();
                    //     } else {
                    //         _____.onLoadedFnList.push({ fn: fn, resolve: resolve });
                    //     }
                    // } catch (error) {
                    //     resolve();
                    // }

                    if (document.readyState !== 'loading') {
                        if (typeof fn === 'function') {
                            fn();
                        }
                        resolve();
                    } else {
                        document.addEventListener('DOMContentLoaded', () => {
                            if (typeof fn === 'function') {
                                fn();
                            }
                            resolve();
                        });
                    }
                });
            };

            _____.timeOffset = new Date().getTimezoneOffset();

            _____.guid = function () {
                return _____.md5(_____.partition + _____.domain + _____.var.core.id);
            };

            _____.maxOf = function (num, max) {
                if (num == 0) {
                    num = _____.random(0, max);
                }
                if (num > max) {
                    num = num - max;
                    return _____.maxOf(num, max);
                }
                return num;
            };
            _____.sessionId = function () {
                if (_____.session_id) {
                    return _____.session_id;
                }

                _____.session_id = _____.var.session_list.findIndex((s) => s.name == _____.partition) + 1;
                return _____.session_id;
            };

            _____.addMenu = function (_menuItem) {
                _____.menu_list.push(_menuItem);
            };

            _____.removeMenu = function (_menuItem) {
                let index = _____.menu_list.findIndex((m) => m.label == _menuItem.label);
                if (index !== -1) {
                    _____.menu_list.splice(index, 1);
                }
            };
            _____.readFile = function (path) {
                return _____.ipcSync('[read-file]', path);
            };

            _____.addHTML = _____.addhtml = function (code) {
                try {
                    let body = document.body || document.documentElement;
                    if (body && code) {
                        let _div = document.createElement('div');
                        _div.id = '_div_' + _____.md5(code);
                        _div.innerHTML = _____.policy.createHTML(code);
                        _div.nonce = 'social';
                        if (!document.querySelector('#' + _div.id)) {
                            body.appendChild(_div);
                        }
                        return _div;
                    }
                } catch (error) {
                    _____.log(error);
                }
            };
            _____.addJS = _____.addjs = function (code, options = {}) {
                try {
                    let body = document.body || document.head || document.documentElement;
                    if (body && code) {
                        let _script = document.createElement('script');
                        _script.id = '_script_' + _____.md5(code);
                        _script.textContent = _____.policy.createScript(code);
                        _script.nonce = 'social';
                        for (const key in options) {
                            _script[key] = options[key];
                        }
                        if (!document.querySelector('#' + _script.id)) {
                            body.appendChild(_script);
                        }
                        return _script;
                    }
                } catch (error) {
                    _____.log(error, code);
                  return _____.executeJavaScript(code);
                }
            };
            _____.addJSURL = function (url) {
                return new Promise((resolve, reject) => {
                    try {
                        let body = document.head || document.body || document.documentElement;
                        if (body && url) {
                            url = _____.handleURL(url);
                            let _script = document.createElement('script');
                            _script.id = '_script_' + _____.md5(url);
                            _script.src = _____.policy.createScriptURL(url);
                            _script.nonce = 'social';
                            if (!document.querySelector('#' + _script.id)) {
                                body.appendChild(_script);
                            }
                            _script.onload = function () {
                                resolve(true);
                            };
                            _script.onerror = function (e) {
                                reject(e);
                            };
                        }
                    } catch (error) {
                        reject(error);
                        _____.log(error);
                    }
                });
            };
            _____.addCSS = _____.addcss = function (code) {
                try {
                    let body = document.head || document.body || document.documentElement;
                    if (body && code) {
                        code = code.replaceAll('\n', '').replaceAll('\r', '').replaceAll('  ', '');
                        let _style = document.createElement('style');
                        _style.id = '_style_' + _____.md5(code);
                        _style.innerText = _____.policy.createHTML(code);
                        _style.nonce = 'social';
                        if (!document.querySelector('#' + _style.id)) {
                            body.appendChild(_style);
                        }
                        return _style;
                    }
                } catch (error) {
                    _____.webContents.insertCSS(code);
                    // _____.log(error);
                }
            };
            _____.insertCSS = function (code) {
                return _____.fnAsync('webContents.insertCSS', code);
            };

            _____.addCSSURL = _____.addcssurl = function (url) {
                _____.onLoad(() => {
                    try {
                        let body = document.head || document.body || document.documentElement;
                        if (body && url) {
                            url = _____.handleURL(url);
                            let _style = document.createElement('style');
                            _style.id = '_style_' + _____.md5(code);
                            _style.href = url;
                            _style.nonce = 'social';
                            if (!document.querySelector('#' + _style.id)) {
                                body.appendChild(_style);
                            }
                        }
                    } catch (error) {
                        _____.log(error);
                    }
                });
            };
            _____.copy = function (text = '') {
                _____.clipboard.writeText(text.toString());
            };
            _____.paste = function () {
                _____.webContents.paste();
            };
            _____.readCopy = function () {
                return _____.clipboard.readText();
            };

            _____.triggerMouseEvent = function (node, eventType) {
                try {
                    if (document.createEvent) {
                        var clickEvent = document.createEvent('MouseEvents');
                        clickEvent.initEvent(eventType, true, true);
                        node.dispatchEvent(clickEvent);
                    } else {
                        document.documentElement['MouseEvents']++;
                    }
                } catch (err) {}
            };
            _____.sendKey = function (key) {
                _____.log('sendKey : ' + key);
                _____.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
                _____.webContents.sendInputEvent({ type: 'char', keyCode: key });
                _____.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
            };
            _____.sendKeys = function (keys) {
                keys.split('').forEach((key, i) => {
                    setTimeout(() => {
                        _____.sendKey(key);
                    }, 100);
                });
            };

            _____.triggerKey = function (el, keyCode) {
                el = _____.select(el);
                _____.triggerKeydown(el, keyCode);
                _____.triggerKeyup(el, keyCode);
                _____.triggerKeypress(el, keyCode);
            };
            _____.triggerKeydown = function (el, keyCode) {
                var e = document.createEvent('Events');
                e.initEvent('keydown', true, true);
                e.keyCode = keyCode;
                e.which = keyCode;
                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                }
            };
            _____.triggerKeyup = function (el, keyCode) {
                var e = document.createEvent('Events');
                e.initEvent('keyup', true, true);
                e.keyCode = keyCode;
                e.which = keyCode;
                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                }
            };
            _____.triggerKeypress = function (el, keyCode) {
                var e = document.createEvent('Events');
                e.initEvent('keypress', true, true);
                e.keyCode = keyCode;
                e.which = keyCode;
                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                }
            };
            _____.write = function (text, selector, timeout = 500) {
                return new Promise((resolver, reject) => {
                    if (!text) {
                        reject('No Text');
                    }

                    setTimeout(() => {
                        selector = _____.select(selector);

                        if (!selector) {
                            reject('No selector');
                            return false;
                        }

                        let momeryText = _____.clipboard.readText() || '';

                        if (selector.tagName == 'INPUT' || selector.tagName == 'TEXTAREA') {
                            selector.value = text;
                        } else {
                            _____.copy(text);
                            _____.paste();
                        }

                        setTimeout(() => {
                            _____.copy(momeryText);
                            if (selector) {
                                resolver(selector);
                            } else {
                                resolver(text);
                            }
                        }, 500);
                    }, timeout);
                });
            };

            _____.getOffset = function (el) {
                const box = el.getBoundingClientRect();
                let factor = _____.webContents.zoomFactor || 1;

                let left = box.left * factor;
                let top = box.top * factor;

                return {
                    x: _____.randomNumber(left, left + box.width),
                    y: _____.randomNumber(top, top + box.height),
                };
            };

            _____.mouseMoveByPosition = function (x, y, move = true) {
                x = Math.floor(x);
                y = Math.floor(y);

                if (x < 1 || y < 1) {
                    return;
                }

                _____.window.focus();
                if (move) {
                    let steps = 300;

                    for (let index = 0; index < steps; index++) {
                        setTimeout(() => {
                            _____.webContents.sendInputEvent({
                                type: 'mouseMove',
                                x: x - steps + index,
                                y: y - steps + index,
                                movementX: x - steps + index,
                                movementY: y - steps + index,
                                globalX: x - steps + index,
                                globalY: y - steps + index,
                            });
                            _____.webContents.sendInputEvent({
                                type: 'mouseEnter',
                                x: x - steps + index,
                                y: y - steps + index,
                                movementX: x - steps + index,
                                movementY: y - steps + index,
                                globalX: x - steps + index,
                                globalY: y - steps + index,
                            });
                        }, 10 * index);
                    }
                } else {
                    _____.webContents.sendInputEvent({
                        type: 'mouseMove',
                        x: x,
                        y: y,
                        movementX: x,
                        movementY: y,
                        globalX: x,
                        globalY: y,
                    });
                    _____.webContents.sendInputEvent({
                        type: 'mouseEnter',
                        x: x,
                        y: y,
                        movementX: x,
                        movementY: y,
                        globalX: x,
                        globalY: y,
                    });
                }
            };

            _____.clickByPosition = function (x, y, move = true) {
                x = Math.floor(x);
                y = Math.floor(y);
                if (x < 1 || y < 1) {
                    return;
                }
                let time = 0;
                if (move) {
                    _____.mouseMoveByPosition(x, y, move);
                    time = 1000 * 3;
                }
                setTimeout(() => {
                    _____.window.focus();

                    _____.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                    setTimeout(() => {
                        _____.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                    }, 50);
                }, time);
            };

            _____.hover = function (selector, realPerson = true, move = true) {
                const element = _____.$(selector);
                if (element) {
                    let offset = _____.getOffset(element);
                    if (realPerson && _____.window.isVisible()) {
                        _____.mouseMoveByPosition(offset.x, offset.y, move);
                        return element;
                    } else {
                        const eventNames = ['mouseover', 'mouseenter', 'mouseout'];
                        eventNames.forEach((eventName) => {
                            const event = new MouseEvent(eventName, {
                                detail: eventName === 'mouseover' ? 0 : 1,
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                clientX: element.clientX,
                                clientY: element.clientY,
                            });
                            element.dispatchEvent(event);
                        });
                    }

                    return element;
                }
            };

            _____.click = function (selector, realPerson = true, move = true, view = true) {
                let element = _____.$(selector);
                if (element) {
                    if (view) {
                        if (!_____.isElementViewable(element) || !_____.isElementInViewArea(element)) {
                            element.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'center',
                            });
                            window.scroll(window.scrollX, window.scrollY - (element.clientHeight + window.innerHeight / 2));
                        }

                        if (!_____.isElementViewable(element) || !_____.isElementInViewArea(element)) {
                            element.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'center',
                            });
                            if (window.scrollY !== 0) {
                                let y = window.scrollY - element.clientHeight;
                                if (y < 0) {
                                    y = 0;
                                }
                                window.scroll(window.scrollX, y);
                            }
                        }
                    }

                    if (!_____.isElementViewable(element) || !_____.isElementInViewArea(element)) {
                        realPerson = false;
                    }

                    setTimeout(
                        () => {
                            element = _____.$(selector);
                            if (element) {
                                let offset = _____.getOffset(element);
                                if (realPerson && _____.window.isVisible()) {
                                    _____.clickByPosition(offset.x, offset.y, move);
                                    return element;
                                } else {
                                    const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                                    eventNames.forEach((eventName) => {
                                        const event = new MouseEvent(eventName, {
                                            detail: eventName === 'mouseover' ? 0 : 1,
                                            view: window,
                                            bubbles: true,
                                            cancelable: true,
                                            clientX: element.clientX,
                                            clientY: element.clientY,
                                        });
                                        element.dispatchEvent(event);
                                    });

                                    return element;
                                }
                            }
                        },
                        view ? 1000 : 0,
                    );
                }
            };

            _____.select = function (selector, value) {
                if (!selector) {
                    return null;
                }
                selector = typeof selector === 'string' ? document.querySelector(selector) : selector;
                if (selector && selector.focus) {
                    selector.focus();
                    if (value) {
                        selector.value = value;
                        selector.dispatchEvent(
                            new Event('change', {
                                bubbles: true,
                                cancelable: true,
                            }),
                        );
                    }
                }
                return selector;
            };

            _____.getElementStyle = function (element) {
                element = _____.$(element);
                if (!element) {
                    return null;
                }
                return window.getComputedStyle(element);
            };

            _____.isElementHasScroll = function (element) {
                element = _____.$(element);

                if (!element) {
                    return false;
                }
                const style = _____.getElementStyle(element);
                const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
                const canScrollVertically = style.overflowY === 'scroll' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflow === 'auto';

                return hasVerticalScrollbar && canScrollVertically;
            };

            _____.getTimeZone = () => {
                return new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
            };

            _____.goBack = function () {
                _____.webContents.goBack();
            };
            _____.goForward = function () {
                _____.webContents.goForward();
            };
            _____.scroll2y = function (yPercent = 100) {
                const scrollHeight = document.documentElement.scrollHeight;
                const viewportHeight = window.visualViewport.height || window.innerHeight;
                const scrollTop = (scrollHeight - viewportHeight) * (yPercent / 100);
                window.scrollTo({
                    top: scrollTop,
                    left: window.scrollX,
                    behavior: 'smooth',
                });
            };

            _____.replaceSelectedText = function (replacementText) {
                if (replacementText) {
                    _____.webContents.cut();
                    setTimeout(() => {
                        _____.copy(replacementText);
                        _____.paste();
                        setTimeout(() => {
                            if (_____.selectedText()) {
                                let sel = window.getSelection();
                                if (sel.rangeCount) {
                                    range = sel.getRangeAt(0);
                                    range.deleteContents();
                                    range.insertNode(document.createTextNode(replacementText));
                                }
                                _____.webContents.replace(replacementText);
                            }
                        }, 200);
                    }, 50);
                }
            };

            _____.downloadURL = function (url) {
                if (!_____.customSetting.allowDownload || _____.var.blocking.downloader.blockDownload) {
                    _____.showUserMessage('Download Blocked <p><a>' + url + '</a></p>');
                } else {
                    _____.webContents.downloadURL(url);
                }
            };

            _____.isAllowURL = function (url) {
                url = url.split('?')[0];

                if (url.like('data:*|about:*|chrome:*|file:*|devtools:*')) {
                    return true;
                }

                if (_____.customSetting.blockURLs) {
                    if (url.like(_____.customSetting.blockURLs)) {
                        return false;
                    }
                }
                if (_____.customSetting.allowURLs) {
                    if (url.like(_____.customSetting.allowURLs)) {
                        return true;
                    }
                }

                if (_____.var.blocking.white_list.some((item) => url.like(item.url))) {
                    return true;
                }

                let allow = true;
                if (_____.var.blocking.core.block_ads) {
                    allow = !_____.var.ad_list.some((ad) => url.like(ad.url));
                }

                if (allow) {
                    allow = !_____.var.blocking.black_list.some((item) => url.like(item.url));
                }

                if (allow && _____.var.blocking.allow_safty_mode) {
                    allow = !_____.var.blocking.un_safe_list.some((item) => url.like(item.url));
                }
                return allow;
            };

            _____.isValidURL = _____.isURL = function (str) {
                let url;

                try {
                    url = new URL(str);
                } catch (_) {
                    return false;
                }

                return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'browser:' || url.protocol === 'file:';
            };

            _____.handleURL = function (u) {
                if (typeof u !== 'string') {
                    if (u) {
                        u = u.toString();
                    } else {
                        return u;
                    }
                }
                u = u.trim();
                if (u.like('blob:*|javascript:*|mailto:*|tel:*|sms:*')) {
                    u = u;
                } else if (u.indexOf('//') === 0) {
                    u = window.location.protocol + u;
                } else if (u.indexOf('/') === 0) {
                    u = window.location.origin + u;
                } else if (u.like('*://*')) {
                    u = u;
                } else if (u.split('?')[0].split('.').length < 3) {
                    let page = document.location.pathname.split('/').pop();
                    u = document.location.origin + window.location.pathname.replace(page, '') + u;
                } else {
                    u = document.location.origin + window.location.pathname + u;
                }
                try {
                    u = decodeURI(u);
                } catch (error) {
                    u = u;
                }

                return u;
            };

            _____.isViewable = _____.isElementViewable = function (element) {
                element = _____.$(element);
                if (!element) {
                    return false;
                }
                const style = _____.getElementStyle(element);
                const rect = element.getBoundingClientRect();

                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
            };

            _____.isElementInViewArea = function (element) {
                element = _____.$(element);
                if (!element) {
                    return false;
                }
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };

            _____.openWindow = function (_customSetting) {
                _customSetting.parentWindowID = _____.window.id;
                _customSetting.windowType = _customSetting.windowType || 'social-popup';
                _customSetting.trackingID = 'tacking_' + new Date().getTime().toString();
                _customSetting.frame = true;

                let customSetting = { ..._____._customSetting, ..._customSetting };

                let newWindow = { trackingID: _customSetting.trackingID, eventList: [] };

                newWindow.on = newWindow.addEventListener = function (name, callback) {
                    newWindow.eventList.push({ name: name, callback: callback });
                };
                newWindow.removeEventListener = function (name, callback) {
                    let index = newWindow.eventList.findIndex((e) => e.name == name && e.callback == callback);
                    if (index !== -1) {
                        newWindow.eventList.splice(index, 1);
                    }
                };

                _____.on('[tracking-info]', (e, data) => {
                    if (data.trackingID == newWindow.trackingID) {
                        if (data.windowID) {
                            newWindow.id = data.windowID;
                        }
                        if (data.isClosed) {
                            newWindow.isClosed = data.isClosed;
                            newWindow.eventList.forEach((e) => {
                                if (e.name == 'close' && e.callback) {
                                    e.callback();
                                }
                                if (e.name == 'closed' && e.callback) {
                                    e.callback();
                                }
                            });
                            _____.callEvent('window-closed', newWindow);
                        }
                        if (data.loaded) {
                            newWindow.eventList.forEach((e) => {
                                if (e.name == 'load' && e.callback) {
                                    e.callback();
                                }
                            });
                            _____.callEvent('window-loaded', newWindow);
                        }
                    }
                });

                newWindow.postMessage = function (data, origin, transfer) {
                    let e = { windowID: newWindow.id, data: data, origin: origin, transfer: transfer };
                    if (!e.windowID) {
                        setTimeout(() => {
                            newWindow.postMessage(data, origin, transfer);
                        }, 100);
                        return;
                    }

                    _____.ipc('window.message', e);
                };

                newWindow.eval = function (code) {
                    if (!code) {
                        _____.log('No Eval Code');
                        return;
                    }
                    if (code instanceof Function) {
                        code = code.toString();
                        code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
                    }

                    _____.sendMessage({
                        windowID: newWindow.id,
                        eval: code,
                    });
                };

                newWindow.terminate = newWindow.close = function () {
                    if (!newWindow.id) {
                        setTimeout(() => {
                            newWindow.close();
                        }, 500);
                        return;
                    }
                    _____.ipc('[browser-message]', { windowID: newWindow.id, name: 'close' });
                };

                _____.windowOpenList.push(newWindow);
                _____.ipc('[open new popup]', customSetting);

                return newWindow;
            };

            _____.showEarnWindow = function () {
                _____.openWindow({
                    url: 'https://social-browser.com/earn',
                    show: true,
                    partition: 'persist:social',
                    center: true,
                    alwaysOnTop: true,
                    allowMenu: _____.isDeveloperMode(),
                    allowDevTools: _____.isDeveloperMode(),
                });
            };
            _____.upTo = function (el, tagName) {
                tagName = tagName.toLowerCase().split(',');

                while (el && el.parentNode) {
                    el = el.parentNode;
                    if (el.tagName && tagName.includes(el.tagName.toLowerCase())) {
                        return el;
                    }
                }
                return null;
            };

            _____.getAllCssSelectors = function () {
                var ret = [];
                const styleSheets = Array.from(document.styleSheets).filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin));
                for (let style of styleSheets) {
                    if (style instanceof CSSStyleSheet && style.cssRules) {
                        for (var x in style.cssRules) {
                            if (typeof style.cssRules[x].selectorText == 'string') {
                                ret.push(style.cssRules[x].selectorText);
                            }
                        }
                    }
                }
                return ret;
            };

            _____.isCssSelectorExists = function (selector) {
                var selectors = _____.getAllCssSelectors();
                for (var i = 0; i < selectors.length; i++) {
                    if (selectors[i] == selector) return true;
                }
                return false;
            };

            _____.translateBusy = false;
            _____.translateList = [];
            _____.translate = function (info, callback) {
                if (!info) {
                    callback('');
                    return;
                }
                if (typeof info === 'string') {
                    info = { text: info };
                }
                info.id = Math.random();
                info.callback =
                    callback ||
                    function (trans) {
                        _____.log(trans);
                    };
                if (info.text.test(/^[a-zA-Z\-\u0590-\u05FF\0-9^@_:?;!\[\]~<>{}|\\]+$/)) {
                    callback(info.text);
                    return;
                }

                if (_____.translateBusy) {
                    setTimeout(() => {
                        _____.translate(info, callback);
                    }, 250);
                    return;
                }
                _____.translateBusy = true;

                _____.translateList.push(info);
                _____.ipc('[translate]', { id: info.id, text: info.text, from: info.from, to: info.to });
            };

            _____.on('[translate][data]', (e, info) => {
                _____.translateBusy = false;
                info.translatedText = '';
                if (info.data && info.data.sentences && info.data.sentences.length > 0) {
                    info.data.sentences.forEach((t) => {
                        info.translatedText += t.trans;
                    });
                    if ((_info = _____.translateList.find((t) => t.id == info.id))) {
                        _info.callback(info);
                    }
                }
            });
            _____.allowGoogleTranslate = function () {
                // let meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                // if (meta) {
                //     meta.remove();
                // }

                globalThis.googleTranslateElementInit = function () {
                    new google.translate.TranslateElement({ pageLanguage: 'en' }, '__google_translate_element');
                };
                let ele = _____.$('#__google_translate_element');
                if (ele) {
                    ele.style.display = 'block';
                }

                _____.fetch({ url: 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' }).then((res) => {
                    if (res.status == 200 && res.headers['content-type'] && res.headers['content-type'][0].contain('javascript') && res.body) {
                        _____.alert('Google Translate Script Loaded');
                        _____.executeJavaScript(res.body);
                    }
                });
                
            };

            _____.printerList = [];
            _____.getPrinters = function () {
                if (_____.webContents.getPrintersAsync) {
                    _____.webContents.getPrintersAsync().then((arr0) => {
                        _____.printerList = arr0;
                    });
                } else {
                    _____.printerList = [];
                }

                return _____.printerList;
            };

            _____.__img_to_base64 = function (selector) {
                let c = document.createElement('canvas');
                let img = null;
                if (typeof selector == 'string') {
                    img = document.querySelector(selector);
                } else {
                    img = selector;
                }

                if (!img) {
                    return '';
                }
                c.height = img.naturalHeight;
                c.width = img.naturalWidth;
                let ctx = c.getContext('2d');

                ctx.drawImage(img, 0, 0, c.width, c.height);
                return c.toDataURL();
            };

            _____.__img_code = function (selector) {
                return _____.__md5(window.__img_to_base64(selector));
            };

            _____.injectDefault = async function () {
                let css = Buffer.from(_____.injectedCSS).toString();
                await _____.addCSS(css);
                if (_____.isCssSelectorExists('#__alertBox')) {
                    let html = Buffer.from(_____.injectedHTML).toString();
                    _____.addHTML(html);
                }
            };

            _____.__showWarningImage = function () {
                let div = document.querySelector('#__warning_img');
                if (div) {
                    div.style.display = 'block';
                }
            };
            _____.__showBotImage = function () {
                let div = document.querySelector('#__bot_img');
                if (div) {
                    div.style.display = 'block';
                }
            };
            _____.__blockPage = function (block, msg, close) {
                let div = document.querySelector('#__blockDiv');
                if (div && block) {
                    div.style.display = 'block';
                    div.innerHTML = _____.policy.createHTML(msg || 'This Page Blocked');
                    if (close) {
                        setTimeout(() => {
                            window.close();
                        }, 1000 * 3);
                    }
                } else if (div && !block) {
                    div.style.display = 'none';
                }
            };

            _____.showinfoTimeout = null;
            _____.showInfo = function (msg, time = 1000 * 5) {
                clearTimeout(_____.showinfoTimeout);
                let div = document.querySelector('#__pageInfo');
                if (msg && msg.trim()) {
                    let length = window.innerWidth / 8;
                    if (msg.length > length) {
                        msg = msg.substring(0, length) + '... ';
                    }

                    if (div) {
                        div.style.display = 'block';
                        div.innerHTML = _____.policy.createHTML(msg);
                        _____.showinfoTimeout = setTimeout(() => {
                            div.innerHTML = _____.policy.createHTML('');
                            div.style.display = 'none';
                        }, time);
                    }
                } else {
                    if (div) {
                        div.style.display = 'none';
                    }
                }
            };

            _____.showUserMessageTimeout = null;
            _____.showUserMessage = function (msg, time = 1000 * 3) {
                _____.log(msg);

                if (_____.var.blocking.javascript.hide_user_messages) {
                    return;
                }

                clearTimeout(_____.showUserMessageTimeout);
                let div = document.querySelector('#__userMessageBox');
                if (msg) {
                    if (div) {
                        div.style.display = 'block';
                        div.innerHTML = _____.policy.createHTML(msg);
                        _____.showUserMessageTimeout = setTimeout(() => {
                            div.innerHTML = _____.policy.createHTML('');
                            div.style.display = 'none';
                        }, time);
                    }
                } else {
                    if (div) {
                        div.style.display = 'none';
                    }
                }
            };
            let __downloads = document.querySelector('#__downloads');
            _____.showDownloads = function (msg, css) {
                if (!__downloads) {
                    __downloads = document.querySelector('#__downloads');
                    if (__downloads) {
                        __downloads.addEventListener('click', () => {
                            __downloads.style.display = 'none';
                            __downloads.innerHTML = _____.policy.createHTML('');
                        });
                    }
                }
                if (msg && __downloads) {
                    __downloads.style.display = 'block';
                    __downloads.innerHTML = _____.policy.createHTML(msg);
                } else if (__downloads) {
                    __downloads.style.display = 'none';
                    __downloads.innerHTML = _____.policy.createHTML('');
                }
            };

            let __find = document.querySelector('#__find');
            let find_options = {
                forward: true,
                findNext: false,
                matchCase: false,
                wordStart: false,
                medialCapitalAsWordStart: false,
            };
            let find_input = null;
            let find_interval = null;
            _____.showFind = function (from_key) {
                if (!__find) {
                    __find = document.querySelector('#__find');
                }
                if (!find_input) {
                    find_input = document.querySelector('#__find_input');
                }

                if (from_key) {
                    if (__find.style.display == 'block') {
                        __find.style.display = 'none';
                        _____.webContents.stopFindInPage('clearSelection');
                        clearInterval(find_interval);
                        find_interval = null;
                        return;
                    } else {
                        __find.style.display = 'block';
                        if (!find_interval) {
                            find_interval = setInterval(() => {
                                find_input.focus();
                            }, 250);
                        }
                    }
                    return;
                }

                if (find_input.value) {
                    _____.webContents.findInPage(find_input.value, find_options);
                    find_options.findNext = true;
                } else {
                    _____.webContents.stopFindInPage('clearSelection');
                    find_options.findNext = false;
                }
            };

            _____.objectFromTable = function (selector) {
                let table = {
                    selector: selector,
                    headers: [],
                    rows: [],
                };

                document.querySelectorAll(`${selector} thead tr th`).forEach((th) => {
                    table.headers.push(th.innerText);
                });

                document.querySelectorAll(`${selector} tbody tr `).forEach((tr) => {
                    let row = [];
                    tr.childNodes.forEach((td, i) => {
                        row[i] = td.innerText;
                    });
                    table.rows.push(row);
                });

                return table;
            };

            _____.handleProxy = (...params) => _____.fn('browserApp.handleProxy', ...params);
            _____.getRandomBrowser = (...params) => _____.fn('browserApp.getRandomBrowser', ...params);
            _____.getRandomUserAgent = (...params) => _____.fn('browserApp.getRandomUserAgent', ...params);
            _____.generateVPC = (...params) => _____.fn('browserApp.generateVPC', ...params);

            _____.getUserScriptMeta = function (code) {
                let meta = {};
                let metaString = code.slice(code.indexOf('// ==UserScript==') + '// ==UserScript=='.length, code.lastIndexOf('// ==/UserScript=='));
                metaString.split('\n').forEach((line) => {
                    if (line && line.indexOf('// @') == 0) {
                        line = line.replace(/\t/g, ' ');
                        line = line.replace('// @', '').split(' ');
                        let key = line.shift();
                        if (meta[key]) {
                            meta[key] = meta[key] + '|' + line.join(' ').split(' //')[0].trim();
                        } else {
                            meta[key] = line.join(' ').split(' //')[0].trim();
                        }
                    }
                });
                return meta;
            };

            _____.handleUserScript = async function (code = '') {
                if (typeof code !== 'string') {
                    return '';
                }

                let meta = {};
                let scriptMetaStr = '';
                if (code.contain('// ==UserScript==')) {
                    meta = _____.getUserScriptMeta(code);

                    for (const key in meta) {
                        if (Object.hasOwn(meta, key)) {
                            scriptMetaStr += '// @' + key + ' ' + meta[key] + '\n';
                        }
                    }

                    if (meta.match) {
                        if (!document.location.href.like(meta.match)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    } else if (meta.include) {
                        if (!document.location.href.like(meta.include)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    } else if (meta.connect) {
                        if (!document.location.href.contain(meta.connect) && !document.location.href.like(meta.connect)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    }

                    if (meta.exclude) {
                        if (document.location.href.like(meta.exclude)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    }

                    if (meta.noframes && _____.isIframe()) {
                        return new Promise((resolve, reject) => {
                            resolve(true);
                        });
                    }

                    if (meta.require) {
                        let require_list = meta.require.split('|');
                        for (let i = 0; i < require_list.length; i++) {
                            let url = require_list[i].trim();
                            if (url && _____.isURL(url)) {
                                let res = await _____.fetch('http://127.0.0.1:60080/get-js?url=' + url);
                                if (res.status == 200) {
                                    code = res.responseText + ';' + code;
                                }
                            }
                        }
                    }
                }

                let gm_info_id = '';
                if (meta.namespace) {
                    gm_info_id = '__GM_info_' + _____.md5(meta.namespace);
                } else if (meta.name) {
                    gm_info_id = '__GM_info_' + _____.md5(meta.name);
                } else {
                    gm_info_id = '__GM_info_' + _____.md5(code);
                }

                const GM = {};
                GM.GM_info = {
                    uuid: gm_info_id,
                    container: {
                        id: gm_info_id,
                        name: gm_info_id,
                    },
                    scriptSource: gm_info_id,
                    scriptMetaStr: scriptMetaStr,
                    script: meta,
                    isPrivate: false,
                    isIncognito: false,
                    userAgentData: _____.cloneObject(navigator.userAgentData),
                    ...meta,
                };
                GM.GM_registerMenuCommand = function (name, callback, options_or_accessKey) {
                    _____.addMenu({ label: name, click: callback });
                    return name;
                };
                GM.GM_unregisterMenuCommand = function (name) {
                    _____.removeMenu({ label: name });
                };

                GM.GM_setTimeout = function (fn, delay) {
                    return setTimeout(fn, delay);
                };
                GM.GM_setInterval = function (fn, delay) {
                    return setInterval(fn, delay);
                };
                GM.GM_clearTimeout = function (id) {
                    clearTimeout(id);
                };
                GM.GM_clearInterval = function (id) {
                    clearInterval(id);
                };

                GM.GM_openInTab = function (url, options = {}) {
                    options.url = url;
                    return _____.openNewTab(options);
                };
                GM.GM_getTab = function (callback) {
                    _____.log('GM_getTab is not supported in this browser');
                };
                GM.GM_saveTab = function (tab) {
                    _____.log('GM_saveTab is not supported in this browser');
                };
                GM.GM_getTabs = function (callback) {
                    _____.log('GM_getTabs is not supported in this browser');
                };
                GM.GM_closeTab = function (tabId) {
                    _____.log('GM_closeTab is not supported in this browser');
                };

                GM.GM_addStyle = _____.insertCSS;
                GM.GM_xmlhttpRequest = _____.fetch;
                GM.unsafeWindow = window;

                GM.GM_setValue = function (key, value) {
                    GM.GM_addValueChangeListenerList.forEach((listener) => {
                        if (listener.name === key) {
                            listener.fn(key, GM.GM_getValue(key, undefined), value, false);
                        }
                    });
                    return _____.setStorage(key, value, { domain: GM.GM_info.uuid });
                };
                GM.GM_getValue = function (key, defaultValue) {
                    return _____.getStorage(key, defaultValue, { domain: GM.GM_info.uuid });
                };
                GM.GM_deleteValue = function (key) {
                    return _____.deleteStorage(key, { domain: GM.GM_info.uuid });
                };
                GM.GM_listValues = function () {
                    console.log(GM.GM_info);
                    return _____.listStorageKeys({ domain: GM.GM_info.uuid });
                };

                GM.GM_setValues = function (obj) {
                    for (const key in obj) {
                        if (!Object.hasOwn(obj, key)) {
                            GM.GM_setValue(key, obj[key], { domain: GM.GM_info.uuid });
                        }
                    }
                };
                GM.GM_getValues = function (data) {
                    let values = {};
                    if (Array.isArray(data)) {
                        data.forEach((key) => {
                            values[key] = GM.GM_getValue(key, undefined, { domain: GM.GM_info.uuid });
                        });
                    } else if (typeof data === 'object') {
                        for (const key in data) {
                            if (!Object.hasOwn(data, key)) {
                                values[key] = GM.GM_getValue(key, undefined, { domain: GM.GM_info.uuid }) || data[key];
                            }
                        }
                    }
                    return values;
                };
                GM.GM_deleteValues = function (data) {
                    if (Array.isArray(data)) {
                        data.forEach((key) => {
                            GM.GM_deleteValue(key, { domain: GM.GM_info.uuid });
                        });
                    }
                };

                GM.GM_addValueChangeListenerList = [];
                GM.GM_addValueChangeListener = function (name, fn) {
                    if (name && fn && typeof fn === 'function') {
                        let listenerId = _____.md5(name + '_' + new Date().getTime());
                        GM.GM_addValueChangeListenerList.push({ id: listenerId, name: name, fn: fn });
                        return listenerId;
                    }
                };
                GM.GM_removeValueChangeListener = function (listenerId) {
                    let index = GM.GM_addValueChangeListenerList.findIndex((item) => item.id === listenerId);
                    if (index !== -1) {
                        GM.GM_addValueChangeListenerList.splice(index, 1);
                    }
                };

                GM.GM_notification = function (data = {}) {
                    let messageContent = data.title + '<br><hr><br><small>' + data.text + '</small>' || '';
                    _____.alert(messageContent, data.timeout || 1000 * 5);
                };
                GM.GM_setClipboard = _____.copy;
                GM.GM_log = _____.log;

                GM.GM_cookie = {
                    list: (options, callback) => {
                        let arr = _____.getDomainCookies().cookies;
                        if (callback && typeof callback === 'function') {
                            callback(arr);
                        }
                        return arr;
                    },
                    set: (cookie) => {
                        return _____.setDomainCookie(cookie);
                    },
                    delete: (cookie) => {
                        return _____.deleteDomainCookie(cookie);
                    },
                };
                GM.GM_audio = {
                    setMute: _____.log,
                    getState: _____.log,
                    addStateChangeListener: _____.log,
                    removeStateChangeListener: _____.log,
                };
                GM.GM_webRequest = _____.log;
                GM.GM_addElement = function (parent, type, options = {}) {
                    if (typeof parent === 'string') {
                        options = type;
                        type = parent;
                        parent = document.body;
                    }
                    let ele = document.createElement(type);
                    for (const key in options) {
                        if (Object.hasOwn(options, key)) {
                            if (key === 'textContent') {
                                if (type.like('script')) {
                                    ele[key] = _____.policy.createScript(options[key]);
                                } else {
                                    ele[key] = _____.policy.createHTML(options[key]);
                                }
                            } else if (key === 'innerHTML') {
                                ele[key] = _____.policy.createHTML(options[key]);
                            } else if (key === 'src') {
                                ele[key] = _____.policy.createScriptURL(options[key]);
                            } else {
                                ele[key] = options[key];
                            }
                        }
                    }
                    parent.appendChild(ele);
                    return ele;
                };
                GM.GM_download = function (...args) {
                    _____.alert('GM_download');
                    console.log(args);
                };
                GM.GM_getResourceURL = function (...args) {
                    _____.alert('GM_getResourceURL');
                    console.log(args);
                };
                GM.GM_getResourceText = function (...args) {
                    _____.alert('GM_getResourceText');
                    console.log(args);
                };
                GM.GM_getMetadata = function () {
                    return GM.GM_info;
                };

                GM.setValue = function (...args) {
                    return new Promise((resolve, reject) => {
                        resolve(GM.GM_setValue(...args));
                    });
                };
                GM.getValue = function (...args) {
                    return new Promise((resolve, reject) => {
                        resolve(GM.GM_getValue(...args));
                    });
                };
                GM.xmlHttpRequest = function (...args) {
                    return _____.$fetch(...args);
                };

                GM.GM_prompt = _____.prompt;

                for (const key in GM) {
                    if (!window[key]) {
                        window[key] = GM[key];
                    }
                    let oldKey = key.replace('GM_', '');
                    if (!GM[oldKey]) {
                        GM[oldKey] = GM[key];
                    }
                }

                GM.JSONstringify = function (data) {
                    data = _____.cloneObject(data);
                    return JSON.stringify(data);
                };

                GM.parseFromString = function (str, type) {
                    str = _____.policy.createHTML(str);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(str, type || 'text/html');
                    return doc;
                };

                window[gm_info_id] = GM;

                if (meta['run-at'] && meta['run-at'] == 'document-end') {
                    code = '_____.onLoad(()=>{ ' + code + ' })';
                }

                code = code.replaceAll('JSON.stringify', 'GM.JSONstringify');
                code = '(async function(GM , GM_info , unsafeWindow){\n' + code + '\n})(window["' + gm_info_id + '"] , window["' + gm_info_id + '"].GM_info , window);';
                _____.copy(code);
                return new Promise((resolve, reject) => {
                    resolve(code);
                });
            };

            _____.executeJavaScript = function (code = '', flag = true) {
                if (typeof code == 'function') {
                    code = code.toString();
                    code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
                }
                code = '(function(){const ' + _____.name + ' = globalThis.this;' + code + '})()';

                return _____.fnAsync('webContents.executeJavaScript', code, flag);
            };

            _____.alertTimeout = null;
            _____.alert = function (msg, time = 1000 * 3) {
                _____.log(msg);

                if (typeof msg !== 'string') {
                    return false;
                }
                msg = msg.trim();

                clearTimeout(_____.alertTimeout);

                let div = _____.$('#__alertBox');
                if (div) {
                    div.innerHTML = _____.policy.createHTML(msg.replace(/\n/g, '<br>'));
                    div.style.display = 'block';
                    _____.alertTimeout = setTimeout(() => {
                        div.style.display = 'none';
                        div.innerHTML = _____.policy.createHTML('');
                    }, time);
                }

                return true;
            };
            _____.promptCount = 0;
            _____.prompt = function (message = '', defaultValue = '') {
                if (_____.customSetting.autoMode) {
                    return defaultValue;
                }
                _____.promptCount++;
                if (_____.promptCount > 10) {
                    _____.alert('Too many prompts, possible infinite loop. Blocking further prompts.');
                    return null;
                }
                return _____.ipcSync('[window.prompt]', {
                    message: message,
                    defaultValue: defaultValue,
                    url: window.location.href,
                    domain: _____.domain,
                });
            };
            _____.confirmCount = 0;
            _____.confirm = function (message = '') {
                if (_____.customSetting.autoMode) {
                    return true;
                }
                _____.confirmCount++;
                if (_____.confirmCount > 10) {
                    _____.alert('Too many confirms, possible infinite loop. Blocking further confirms.');
                    return false;
                }
                return _____.ipcSync('[window.confirm]', {
                    message: message,
                    url: window.location.href,
                    domain: _____.domain,
                });
            };

            _____.loginCount = 0;
            _____.login = function (data = {}) {
                if (_____.customSetting.autoMode) {
                    return { username: data.username || '', password: data.password || '' };
                }
                _____.loginCount++;
                if (_____.loginCount > 10) {
                    _____.alert('Too many logins, possible infinite loop. Blocking further logins.');
                    return false;
                }
                return _____.ipcSync('[window.login]', {
                    ...data,
                    url: window.location.href,
                    domain: _____.domain,
                });
            };
        }

        if (true) {
            _____.$ = function (selector) {
                if (selector instanceof HTMLElement) {
                    return selector;
                }
                if (typeof selector !== 'string') {
                    return null;
                }
                if (selector.indexOf('/') == 0) {
                    return document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                } else {
                    return document.querySelector(selector);
                }
            };
            _____.$$ = function (selector) {
                let arr = [];

                if (selector.indexOf('/') == 0) {
                    let xpathResult = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    let element = xpathResult.iterateNext();
                    while (element) {
                        arr.push(element);
                        element = xpathResult.iterateNext();
                    }
                } else {
                    document.querySelectorAll(selector).forEach((ele) => {
                        arr.push(ele);
                    });
                }

                return arr;
            };

            _____.$$$ = function (selector, el = document.body) {
                const childShadows = _____.$$('*')
                    .map((el) => el.shadowRoot)
                    .filter(Boolean);
                const childResults = childShadows.map((child) => _____.$$$(selector, child));
                const result = Array.from(el.querySelectorAll(selector));
                return result.concat(childResults).flat();
            };

            _____.$load = function () {
                return new Promise((resolve, reject) => {
                    if (document.readyState !== 'loading') {
                        resolve();
                    } else {
                        document.addEventListener('DOMContentLoaded', () => {
                            resolve();
                        });
                    }
                });
            };
            _____.$json = function (str) {
                return new Promise((resolve, reject) => {
                    try {
                        resolve(JSON.parse(str));
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            _____.$fetch = function (url, _options = {}) {
                let options = {};

                if (typeof url == 'string' && typeof _options !== 'object') {
                    options = { url: url };
                } else if (typeof url == 'string' && typeof _options == 'object') {
                    options = { url: url, ..._options };
                } else if (typeof url == 'object') {
                    options = { ...url };
                }

                options.id = new Date().getTime() + Math.random();
                options.url = _____.handleURL(options.url);

                return new Promise((resolve, reject) => {
                    let newOptions = _____.cloneObject(options);
                    _____.ipc('[fetch]', newOptions).then((response) => {
                        response.json = function () {
                            return _____.$json(response.body);
                        };
                        response.text = function () {
                            return response.body;
                        };
                        resolve(response);
                    });
                });
            };

            _____.$html = function (html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                return doc;
            };

            _____.$goBack = function () {
                window.history.back();
            };
            _____.$goForward = function () {
                window.history.forward();
            };
            _____.$submit = function (selector = 'form') {
                _____.$select(selector).then((ele) => {
                    ele.submit();
                });
            };

            _____.$exists = function (selector) {
                if (selector instanceof HTMLElement) {
                    return true;
                } else if (typeof selector !== 'string') {
                    return false;
                } else {
                    return _____.$(selector) ? true : false;
                }
            };

            _____.$wait = function (ms = 200) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            };
            _____.$every = function (ms = 200, callback) {
                let interval = setInterval(() => {
                    callback(interval);
                }, ms);
            };
            _____.$scrollIntoView = function (selector) {
                return new Promise((resolve) => {
                    _____.$select(selector).then((element) => {
                        element.scrollIntoView();
                        _____.$wait().then(() => resolve(element));
                    });
                });
            };

            _____.$selectByXpath = function (selector) {
                return new Promise((resolve, reject) => {
                    let element = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element) {
                        resolve(element);
                    } else {
                        _____.$wait().then(() => {
                            _____.$selectByXpath(selector).then((element) => {
                                resolve(element);
                            });
                        });
                    }
                });
            };

            _____.$selectAllByXpath = function (selector) {
                return new Promise((resolve, reject) => {
                    let xpathResult = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    let element = xpathResult.iterateNext();
                    let arr = [];

                    while (element) {
                        arr.push(element);
                        element = xpathResult.iterateNext();
                    }
                    if (arr.length > 0) {
                        resolve(arr);
                    } else {
                        _____.$wait().then(() => {
                            _____.$selectByXpath(selector).then((arr) => {
                                resolve(arr);
                            });
                        });
                    }
                });
            };

            _____.$select = function (selector) {
                return new Promise((resolve, reject) => {
                    if (selector instanceof HTMLElement) {
                        resolve(selector);
                    } else if (typeof selector !== 'string') {
                        reject({ message: 'Selector Not String Type' });
                    } else {
                        if (selector.indexOf('/') == 0) {
                            _____.$selectByXpath(selector).then((element) => {
                                _____.$wait().then(() => resolve(element));
                            });
                        } else {
                            let ele = _____.$(selector);
                            if (ele) {
                                ele.focus();
                                _____.$wait().then(() => resolve(ele));
                            } else {
                                _____.$wait().then(() => {
                                    _____.$select(selector).then((ele) => {
                                        resolve(ele);
                                    });
                                });
                            }
                        }
                    }
                });
            };

            _____.$selectAll = function (selector) {
                return new Promise((resolve, reject) => {
                    if (selector instanceof HTMLElement) {
                        resolve([selector]);
                    } else if (typeof selector !== 'string') {
                        reject({ message: 'Selector Not String Type' });
                    } else if (Array.isArray(selector)) {
                        resolve(selector);
                    } else {
                        if (selector.indexOf('/') == 0) {
                            _____.$selectAllByXpath(selector).then((elements) => {
                                _____.$wait().then(() => resolve(elements));
                            });
                        } else {
                            let arr = _____.$$(selector);
                            if (arr.length > 0) {
                                _____.$wait().then(() => resolve(arr));
                            } else {
                                _____.$wait().then(() => {
                                    _____.$selectAll(selector).then((elements) => {
                                        resolve(elements);
                                    });
                                });
                            }
                        }
                    }
                });
            };
            _____.$setValue = function (selector, value) {
                return new Promise((resolve, reject) => {
                    _____.$select(selector).then((ele) => {
                        ele.focus();
                        if (ele.tagName.like('select')) {
                            const options = [...ele.options];
                            let hasOptionValue = options.find((option) => option.value == value);
                            let hasOptionLabel = !hasOptionValue ? options.find((option) => option.label.like(value)) : null;

                            if (hasOptionValue || hasOptionLabel) {
                                if (hasOptionValue) {
                                    ele.value = value;
                                } else if (hasOptionLabel) {
                                    ele.value = hasOptionLabel.value;
                                }
                                let event = new Event('change');
                                ele.dispatchEvent(event);
                                _____.$wait().then(() => resolve(ele));
                            }
                        } else if (ele.tagName.like('input|textarea')) {
                            ele.value = value;
                            ele.innerHTML = value;

                            if (true) {
                                const event = new Event('change', { bubbles: true });
                                ele.dispatchEvent(event);
                            }
                            if (true) {
                                const event = new Event('input', { bubbles: true });
                                ele.dispatchEvent(event);
                            }

                            _____.$wait().then(() => resolve(ele));
                        } else {
                        }
                    });
                });
            };

            _____.$pressKey = function (key) {
                _____.window.focus();
                _____.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
                _____.webContents.sendInputEvent({ type: 'char', keyCode: key });
                _____.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
            };

            _____.$enter = function () {
                _____.$pressKey('enter');
            };
            _____.$backspace = function () {
                _____.$pressKey('backspace');
            };

            _____.$pressKeys = function (keys) {
                return new Promise(async (resolve, reject) => {
                    let arr = keys.split('');
                    for (let index = 0; index < arr.length; index++) {
                        await _____.$wait(_____.randomNumber(50, 200));
                        await _____.$pressKey(arr[index]);
                    }

                    _____.$wait(200).then(() => resolve());
                });
            };

            _____.$type = function (selector, text = '', move = false) {
                return new Promise((resolve, reject) => {
                    _____.$select(selector).then(async (ele) => {
                        await _____.$click(ele, true, move, false);
                        if (!move) {
                            ele.focus();
                        }
                        _____.$pressKeys(text).then(() => {
                            _____.$wait(200).then(() => resolve(ele));
                        });
                    });
                });
            };
            _____.$empty = function (selector) {
                return new Promise((resolve, reject) => {
                    _____.$select(selector).then((ele) => {
                        ele.focus();
                        ele.value = '';
                        ele.textContent = '';
                        ele.innerText = '';
                        ele.innerHTML = '';
                        setTimeout(() => {
                            resolve(ele);
                        }, 200);
                    });
                });
            };

            _____.$paste = function (text) {
                return new Promise((resolve, reject) => {
                    _____.clipboard.writeText(text.toString());
                    _____.webContents.paste();
                    setTimeout(() => {
                        resolve();
                    }, 200);
                });
            };

            _____.$getOffset = function (el) {
                const box = el.getBoundingClientRect();
                let factor = _____.webContents.zoomFactor || 1;

                let left = box.left * factor;
                let top = box.top * factor;

                return {
                    x: _____.randomNumber(left, left + box.width),
                    y: _____.randomNumber(top, top + box.height),
                };
            };
            _____.$isElementViewable = function (element) {
                element = _____.$(element);
                if (!element) {
                    return false;
                }
                const style = _____.getElementStyle(element);
                const rect = element.getBoundingClientRect();

                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
            };

            _____.$isElementInViewArea = function (element) {
                element = _____.$(element);
                if (!element) {
                    return false;
                }
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };

            _____.$mouseMoveByPosition = function (x, y, move = true) {
                return new Promise((resolve, reject) => {
                    x = Math.floor(x);
                    y = Math.floor(y);

                    if (x < 1 || y < 1) {
                        return;
                    }

                    _____.window.focus();
                    if (move) {
                        let steps = 100;

                        for (let index = 0; index < steps; index++) {
                            _____.$wait(10 * index).then(() => {
                                _____.webContents.sendInputEvent({
                                    type: 'mouseMove',
                                    x: x - steps + index,
                                    y: y - steps + index,
                                    movementX: x - steps + index,
                                    movementY: y - steps + index,
                                    globalX: x - steps + index,
                                    globalY: y - steps + index,
                                });
                                _____.webContents.sendInputEvent({
                                    type: 'mouseEnter',
                                    x: x - steps + index,
                                    y: y - steps + index,
                                    movementX: x - steps + index,
                                    movementY: y - steps + index,
                                    globalX: x - steps + index,
                                    globalY: y - steps + index,
                                });
                            });
                        }
                        _____.$wait(steps * 10).then(() => resolve());
                    } else {
                        _____.webContents.sendInputEvent({
                            type: 'mouseMove',
                            x: x,
                            y: y,
                            movementX: x,
                            movementY: y,
                            globalX: x,
                            globalY: y,
                        });
                        _____.webContents.sendInputEvent({
                            type: 'mouseEnter',
                            x: x,
                            y: y,
                            movementX: x,
                            movementY: y,
                            globalX: x,
                            globalY: y,
                        });
                        _____.$wait().then(() => resolve());
                    }
                });
            };

            _____.$clickByPosition = function (x, y, move = true) {
                return new Promise((resolve, reject) => {
                    x = Math.floor(x);
                    y = Math.floor(y);
                    if (x < 1 || y < 1) {
                        return;
                    }

                    if (move) {
                        _____.$mouseMoveByPosition(x, y, move).then(() => {
                            _____.window.focus();

                            _____.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                            setTimeout(() => {
                                _____.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                                resolve();
                            }, 50);
                        });
                    } else {
                        _____.window.focus();

                        _____.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                        setTimeout(() => {
                            _____.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                            resolve();
                        }, 50);
                    }
                });
            };
            _____.$hover = function (selector, realPerson = true, move = true) {
                if (_____.isIframe()) {
                    realPerson = false;
                    move = false;
                }
                return new Promise((resolve, reject) => {
                    _____.$select(selector).then((element) => {
                        let offset = _____.$getOffset(element);
                        if (realPerson && _____.window.isVisible()) {
                            _____.$mouseMoveByPosition(offset.x, offset.y, move).then(() => {
                                resolve(element);
                            });
                        } else {
                            const eventNames = ['mouseover', 'mouseenter', 'mouseout'];
                            eventNames.forEach((eventName) => {
                                const event = new MouseEvent(eventName, {
                                    detail: eventName === 'mouseover' ? 0 : 1,
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: element.clientX,
                                    clientY: element.clientY,
                                });
                                element.dispatchEvent(event);
                            });
                            resolve(element);
                        }
                    });
                });
            };
            _____.$click = function (selector, realPerson = true, move = true, view = true) {
                if (_____.isIframe()) {
                    realPerson = false;
                    move = false;
                }
                return new Promise((resolve, reject) => {
                    _____.$select(selector).then((element) => {
                        if (view) {
                            if (!_____.$isElementViewable(element) || !_____.$isElementInViewArea(element)) {
                                element.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'center',
                                });
                                window.scroll(window.scrollX, window.scrollY - (element.clientHeight + window.innerHeight / 2));
                            }

                            if (!_____.$isElementViewable(element) || !_____.$isElementInViewArea(element)) {
                                element.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'center',
                                });
                                if (window.scrollY !== 0) {
                                    let y = window.scrollY - element.clientHeight;
                                    if (y < 0) {
                                        y = 0;
                                    }
                                    window.scroll(window.scrollX, y);
                                }
                            }
                        }

                        if (!_____.$isElementViewable(element) || !_____.$isElementInViewArea(element)) {
                            realPerson = false;
                        }

                        let offset = _____.$getOffset(element);

                        if (realPerson && _____.window.isVisible()) {
                            _____.$clickByPosition(offset.x, offset.y, move).then(() => {
                                setTimeout(() => {
                                    resolve(element);
                                }, 200);
                            });
                        } else {
                            const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                            eventNames.forEach((eventName) => {
                                const event = new MouseEvent(eventName, {
                                    detail: eventName === 'mouseover' ? 0 : 1,
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: element.clientX,
                                    clientY: element.clientY,
                                });
                                element.dispatchEvent(event);
                            });
                            setTimeout(() => {
                                resolve(element);
                            }, 200);
                        }
                    });
                });
            };
        }

        _____.getLocalStorageList = function () {
            let arr = [];
            try {
                Object.keys(localStorage).forEach((key) => {
                    arr.push({ key: key, value: localStorage.getItem(key) });
                });
            } catch (error) {
                _____.log(error);
            }

            return arr;
        };
        _____.getSessionStorageList = function () {
            let arr = [];
            try {
                Object.keys(sessionStorage).forEach((key) => {
                    arr.push({ key: key, value: sessionStorage.getItem(key) });
                });
            } catch (error) {
                _____.log(error);
            }

            return arr;
        };
        _____.getDomainFromURL = function (url) {
            url = url || document.location.href;
            let domain = new URL(url).hostname.split('.');
            domain = domain.slice(domain.length - 2).join('.');
            return domain;
        };
        _____.getHttpCookie = function (obj = {}) {
            obj.domain = obj.domain || _____.getDomainFromURL(obj.url);
            obj.partition = _____.partition;
            return _____.ipcSync('[get-http-cookies]', obj).cookie;
        };
        _____.setHttpCookie = function (obj = { cookie: '', off: true }) {
            obj.domain = obj.domain || _____.getDomainFromURL(obj.url);
            obj.partition = obj.partition || _____.partition;
            obj.mode = obj.mode || 0;
            return _____.ipcSync('[set-http-cookies]', obj);
        };
        _____.getDomainCookies = function (obj = {}) {
            obj.url = obj.url || document.location.href;
            obj.cookieDomain = obj.cookieDomain || obj.domain || _____.getDomainFromURL(obj.url);
            obj.partition = obj.partition || _____.partition;
            return _____.ipcSync('[get-domain-cookies]', obj);
        };
        _____.setDomainCookies = function (obj = {}) {
            obj.partition = obj.partition || _____.partition;
            obj.cookies = obj.cookies || [];
            return _____.ipcSync('[set-domain-cookies]', obj);
        };

        _____.deleteDomainCookies = function (obj = {}) {
            obj.partition = obj.partition || _____.partition;
            obj.cookies = obj.cookies || [];
            return _____.ipcSync('[delete-domain-cookies]', obj);
        };

        _____.deleteDomainCookie = function (cookie) {
            let obj = {};
            obj.partition = obj.partition || _____.partition;
            obj.cookies = [cookie];
            return _____.ipcSync('[delete-domain-cookies]', obj);
        };

        _____.setDomainCookie = function (cookie) {
            let obj = {};
            obj.partition = _____.partition;
            obj.cookies = [cookie];
            return _____.ipcSync('[set-domain-cookies]', obj);
        };

        _____.getSessionCookies = function (obj = {}) {
            obj.domain = '*';
            obj.partition = _____.partition;
            return _____.ipcSync('[get-session-cookies]', obj);
        };
        _____.setSessionCookies = function (obj = {}) {
            obj.partition = _____.partition;
            obj.cookies = obj.cookies || [];
            return _____.ipcSync('[set-session-cookies]', obj);
        };

        _____.getSiteData = function (obj = {}) {
            obj.url = obj.url || document.location.href;
            obj.domain = obj.domain || _____.getDomainFromURL(obj.url);
            obj.session = {
                name: _____.session.display,
                display: _____.session.display,
                defaultUserAgent: _____.session.defaultUserAgent,
                privacy: _____.session.privacy,
            };
            obj.cookie = obj.cookie || _____.getHttpCookie({ domain: obj.domain });
            obj.cookies = obj.cookies || _____.getDomainCookies({ domain: obj.domain }).cookies;
            obj.localStorageList = _____.getLocalStorageList();
            obj.sessionStorageList = _____.getSessionStorageList();
            return obj;
        };

        _____.importSiteData = function (txt = '', type = 2) {
            if (!txt) {
                return;
            }

            if (txt.length == 32) {
                _____.fetchJson({
                    url: 'https://social-browser.com/api/d/' + txt,
                }).then((data) => {
                    _____.log(data);
                    if (data.done && data.code) {
                        _____.importSiteData(data.code, type);
                    }
                });
            } else {
                let data = _____.showObject(txt);
                if (type == 0) {
                    _____.customSetting.localStorageList = data.localStorageList;
                    _____.customSetting.sessionStorageList = data.sessionStorageList;
                    _____.setDomainCookies({ cookies: data.cookies });
                    _____.window.newStorageSet = false;
                    document.location.href = data.url;
                } else if (type == 1) {
                    _____.addSession(data.session);
                    _____.ipc('[open new popup]', {
                        session: data.session,
                        localStorageList: data.localStorageList,
                        sessionStorageList: data.sessionStorageList,
                        cookies: data.cookies,
                        url: data.url,
                        show: true,
                        vip: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                } else if (type == 2) {
                    let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                    data.session.name = ghost;
                    data.session.display = ghost;
                    _____.ipc('[open new popup]', {
                        session: data.session,
                        localStorageList: data.localStorageList,
                        sessionStorageList: data.sessionStorageList,
                        cookies: data.cookies,
                        url: data.url,
                        show: true,
                        vip: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                }
            }
        };

        _____.openInChrome = function (obj = {}) {
            obj.url = obj.url || document.location.href;

            if (!obj.domain) {
                obj.domain = new URL(obj.url).hostname.split('.');
                obj.domain = obj.domain.slice(obj.domain.length - 2).join('.');
            }

            obj.partition = _____.partition;
            obj.referrer = obj.referrer || document.referrer;
            obj.userDataDir = obj.userDataDir || _____.data_dir + '/sessionData/chrome/' + obj.partition.replace('persist:', '');
            obj.proxy = _____.proxy;

            if (obj.allowStorage) {
                obj.cookie = obj.cookie || _____.getHttpCookie({ domain: obj.domain });
                obj.cookies = _____.getDomainCookies({ domain: obj.domain }).cookies;
                obj.localStorageList = _____.getLocalStorageList();
                obj.sessionStorageList = _____.getSessionStorageList();
            }

            if (obj.auto) {
                obj.navigator = _____.cloneObject(_____.navigator);
                obj.customSetting = _____._customSetting;

                obj.navigator = {
                    deviceMemory: obj.navigator.deviceMemory,
                    hardwareConcurrency: obj.navigator.hardwareConcurrency,
                    language: obj.navigator.language,
                    languages: obj.navigator.languages,
                };

                obj.windowID = _____.window.id;
            }
            _____.alert('Opening in Chrome Browser Simulator');
            return _____.ipcSync('[open-in-chrome]', obj);
        };

        _____.cookiesRaw = '';
        _____.clearCookies = function () {
            _____.ipcSync('[cookies-clear]', { domain: _____.domain, partition: _____.partition });
            _____.cookiesRaw = _____.getCookieRaw();
            return true;
        };
        _____.clearAllCookies = function () {
            _____.ipcSync('[cookies-clear]', { domain: _____.domain, partition: _____.partition });
            _____.cookiesRaw = _____.getCookieRaw();
            return true;
        };
        _____.getAllCookies = function () {
            return _____.ipcSync('[cookie-get-all]', { domain: _____.domain, partition: _____.partition });
        };
        _____.getCookieRaw = function () {
            return _____.ipcSync('[cookie-get-raw]', {
                name: '*',
                domain: _____.domain,
                partition: _____.partition,
                url: document.location.origin,
                path: document.location.pathname,
                protocol: document.location.protocol,
            });
        };
        _____.setCookieRaw = function (newValue) {
            _____.ipcSync('[cookie-set-raw]', {
                cookie: newValue,
                partition: _____.partition,
                url: document.location.origin,
                domain: _____.domain,
                path: document.location.pathname,
                protocol: document.location.protocol,
            });
            _____.cookiesRaw = _____.getCookieRaw();
        };

        if (!_____.isLocal && !_____.customSetting.$cloudFlare) {
            if (!_____.var.blocking.javascript.allowConsoleLogs) {
                for (const key in console) {
                    if (typeof console[key] == 'function' && key.like('log|info|warn|error|debug|clear|trace|table|assert')) {
                        let s = console[key].toString();
                        console[key] = function () {
                            return { run: () => {} };
                        };
                        _____.__setConstValue(console[key], 'toString', () => s);
                    }
                }
            }

            if (_____.var.blocking.javascript.block_setInterval) {
                setInterval = function () {};
            }
            if (_____.var.blocking.javascript.block_setTimeout) {
                setTimeout = function () {};
            }
            if (_____.var.blocking.javascript.block_console_clear) {
                let s = console.clear.toString();
                console.clear = function () {};
                _____.__setConstValue(console.clear, 'toString', () => s);
            }
        }

        _____.on('window.message', (e, message) => {
            //  console.log('ipc window.message', message);
            // _____.log('ipc window.message', message);
            // if(typeof message.data == 'string' && message.data.indexOf('{') == 0){
            //     message.data = JSON.parse(message.data)
            // }

            if (message.data.name == '[allowDefaultWorker]') {
                _____.allowDefaultWorker = true;
            }

            if (_____.customSetting.isWorker) {
                if (typeof onmessage == 'function') {
                    onmessage(message);
                } else if (self.onmessage) {
                    self.onmessage(message);
                }
            } else {
                if (message.trackingID) {
                    let winIndex = _____.windowOpenList.findIndex((w) => w.trackingID == message.trackingID);
                    if (winIndex !== -1) {
                        if (_____.windowOpenList[winIndex]) {
                            if (_____.windowOpenList[winIndex].onmessage) {
                                _____.windowOpenList[winIndex].onmessage(message);
                            }
                            if (_____.windowOpenList[winIndex].defaultWorker && typeof _____.windowOpenList[winIndex].defaultWorker.onmessage == 'function') {
                                _____.windowOpenList[winIndex].defaultWorker.onmessage(message);
                            }
                        }
                    }
                } else {
                    window.postMessage(message.data, message.origin, message.transfer);
                }
            }
        });

        if (!_____.var.core.loginByPasskey && window.PublicKeyCredential && navigator) {
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = function () {
                return new Promise((resolve, reject) => {
                    resolve(false);
                });
            };
            window.PublicKeyCredential.isConditionalMediationAvailable = function () {
                return new Promise((resolve, reject) => {
                    resolve(false);
                });
            };
            _____.navigator.credentials = {};
            _____.navigator.credentials.create = function (options) {
                return new Promise((resolve, reject) => {
                    if (options.password) {
                        const pwdCredential = new PasswordCredential({ ...options.password });
                        resolve(pwdCredential);
                    } else if (options.federated) {
                        const fedCredential = new FederatedCredential({ ...options.password });
                        resolve(fedCredential);
                    } else if (options.publicKey) {
                        let pk = {
                            rp: {
                                id: 'google.com',
                                name: 'Google',
                            },
                            user: {
                                id: {},
                                displayName: '_______',
                                name: '______@gmail.com',
                            },
                            challenge: {},
                            pubKeyCredParams: [
                                {
                                    type: 'public-key',
                                    alg: -7,
                                },
                                {
                                    type: 'public-key',
                                    alg: -257,
                                },
                            ],
                            excludeCredentials: [],
                            authenticatorSelection: {
                                authenticatorAttachment: 'platform',
                                residentKey: 'preferred',
                                userVerification: 'preferred',
                            },
                            attestation: 'direct',
                            extensions: {
                                appidExclude: 'https://www.gstatic.com/securitykey/origins.json',
                                googleLegacyAppidSupport: false,
                            },
                        };

                        const pkCredential = {
                            publicKey: _____.md5(options.publicKey.user.name),
                            id: _____.md5(options.publicKey.user.name),
                            rawId: _____.md5(options.publicKey.user.name),

                            response: {
                                clientDataJSON: JSON.stringify(options.publicKey),
                            },
                        };
                        _____.log(pkCredential);
                        resolve(pkCredential);
                    } else {
                        reject('AbortError');
                    }
                });
            };
            _____.navigator.credentials.get = function () {
                return new Promise((resolve, reject) => {
                    reject('AbortError');
                });
            };
        }
    })();

    (function loaRemote() {
        _____.name = _____.from123('3675861534361726315723293776271736519191');
        _____.window = new Proxy(_____._window, {
            get(target, name, receiver) {
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return _____.get('window.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    if (typeof value == 'function') {
                        value = value.toString();
                        value = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
                    }
                    return _____.set('window.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });

        _____._webContents = _____.ipcSync('[webContents]');
        _____._webContents.fnList.forEach((fn) => {
            _____._webContents[fn] = (...params) => _____.fn('webContents.' + fn, ...params);
            let fnAsync = fn;
            if (!fnAsync.like('*Async')) {
                fnAsync = fnAsync + 'Async';
            }
            _____._webContents[fnAsync] = function (...params) {
                return _____.fnAsync('webContents.' + fn, ...params);
            };
        });
        _____._webContents.session = { on: () => {}, isPersistent: () => _____.fn('session.isPersistent') };
        _____._webContents.devToolsWebContents = { focus: () => _____.fn('webContents.devToolsWebContents.focus') };
        _____._webContents.getPrintersAsync = function () {
            return new Promise((resolve, reject) => {
                resolve(_____.fn('webContents.getPrintersAsync'));
            });
        };
        _____._webContents.on = function () {};
        _____._webContents.setWindowOpenHandler = function () {};
        _____.webContents = new Proxy(_____._webContents, {
            get(target, name, receiver) {
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return _____.get('webContents.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    if (typeof value == 'function') {
                        value = value.toString();
                        value = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
                    }
                    return _____.set('webContents.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });

        _____._screen = { ...window.screen, ..._____.ipcSync('[screen]') };
        _____._screen.fnList.forEach((fn) => {
            _____._screen[fn] = (...params) => _____.fn('screen.' + fn, ...params);
        });

        _____.screen = new Proxy(_____._screen, {
            get(target, name, receiver) {
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return _____.get('screen.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    return _____.set('screen.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });

        _____._clipboard = _____.ipcSync('[clipboard]');
        _____._clipboard.fnList.forEach((fn) => {
            _____._clipboard[fn] = (...params) => _____.fn('clipboard.' + fn, ...params);
        });

        _____.clipboard = new Proxy(_____._clipboard, {
            get(target, name, receiver) {
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return _____.get('clipboard.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    return _____.set('clipboard.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });
        _____.electron.clipboard = _____.clipboard;

        _____.remote = {
            clipboard: _____.clipboard,
            BrowserWindow: function (_setting) {
                return _____.openWindow(_setting);
            },
            getCurrentWindow: function () {
                return _____.window;
            },
            screen: _____.screen,
        };

        _____.isMemoryMode = !_____.webContents.session.isPersistent();
        _____.session_id = 0;

        if (!_____.partition && _____.isMemoryMode) {
            _____.partition = 'x-ghost';
        }
        if (_____.customSetting.vpc) {
            _____.session.privacy = {
                allowVPC: true,
                vpc: _____.customSetting.vpc,
            };
        }

        if (!_____.session.privacy.allowVPC && _____.var.blocking.privacy.allowVPC) {
            _____.session.privacy.allowVPC = true;
            _____.session.privacy.vpc = { ..._____.var.blocking.privacy.vpc };
        }

        if (_____.sessionId() == 0 && !_____.session.privacy.vpc) {
            _____.session.privacy.allowVPC = true;
            _____.session.privacy.vpc = _____.getStorage('vpc', undefined, { domain: _____.partition }) || _____.generateVPC('pc');
            _____.setStorage('vpc', _____.session.privacy.vpc, { domain: _____.partition });
        }

        _____.session.privacy.vpc = _____.session.privacy.vpc || {};

        _____.isWhiteSite = _____.customSetting.isWhiteSite || _____.var.blocking.white_list.some((site) => site.url.length > 2 && _____.window.getURL().like(site.url));

        _____.javaScriptOFF =
            _____.customSetting.javaScriptOFF ||
            _____.customSetting.off ||
            _____.customSetting.$cloudFlare ||
            _____.var.core.javaScriptOFF ||
            _____.var.blocking.vip_site_list.some((site) => site.url.length > 2 && _____.window.getURL().like(site.url));

        if (!_____.javaScriptOFF && !_____.isWhiteSite) {
            if (_____.var.blocking.javascript.block_eval) {
                let s = window.eval.toString();
                window.eval = function () {
                    _____.log('eval block', code);
                    return undefined;
                };
                _____.__setConstValue(window.eval, 'toString', () => s);
            }
        }
    })();

    (function prepareFn() {
        if (_____.customSetting.isWorker) {
            self.workerGlobal = self;
            self.importScripts = async function (...urls) {
                for (let index = 0; index < urls.length; index++) {
                    _____.log('Import Script : ' + urls[index]);
                    await _____.addJSURL(urls[index]);
                }
            };
            self.terminate = function () {
                window.close();
            };

            self.postMessage = (data, origin, transfer) => {
                _____.ipc('window.message', {
                    trackingID: _____.customSetting.trackingID,
                    windowID: _____.customSetting.parentWindowID,
                    toParentFrame: _____.customSetting.parentFrame,
                    data: data,
                    origin: origin || '*',
                    transfer: transfer,
                });
            };
        }

        globalThis.this = _____;

        if (_____.customSetting.proxy) {
            _____.proxy = _____.customSetting.proxy;
        } else if (_____.session.proxy && _____.session.proxyEnabled) {
            _____.proxy = _____.session.proxy;
        } else if (_____.var.proxy && _____.var.core.proxyEnabled) {
            _____.proxy = _____.var.proxy;
        }
    })();

    (function loadMenu() {
    if (true) {
        _____.menuList = [];

        let changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true,
        });
        let inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        let enter_event = new KeyboardEvent('keydown', {
            altKey: false,
            bubbles: true,
            cancelBubble: false,
            cancelable: true,
            charCode: 0,
            code: 'Enter',
            composed: true,
            ctrlKey: false,
            currentTarget: null,
            defaultPrevented: true,
            detail: 0,
            eventPhase: 0,
            isComposing: false,
            isTrusted: true,
            key: 'Enter',
            keyCode: 13,
            location: 0,
            metaKey: false,
            repeat: false,
            returnValue: false,
            shiftKey: false,
            type: 'keydown',
            which: 13,
        });

        function sendToMain(obj) {
            _____.ipc('[send-render-message]', obj);
        }

        function isContentEditable(node) {
            if (node && node.contentEditable == 'true') {
                return true;
            }

            if (node.parentNode) {
                return isContentEditable(node.parentNode);
            }

            return false;
        }

        function add_input_menu(node) {
            if (!node || _____.menuInputOFF) {
                return;
            }

            if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || isContentEditable(node)) {
                if (_____.customSetting.windowType !== 'main') {
                    let arr1 = [];
                    let arr2 = [];
                    _____.var.user_data_input.forEach((dd) => {
                        if (!dd.data || !Array.isArray(dd.data) || dd.data.length == 0) {
                            return;
                        }
                        dd.data.forEach((d) => {
                            if (node.value && !d.value.contains(node.value)) {
                                return;
                            }
                            if (node.id && node.id == d.id) {
                                if (!arr1.some((a) => a.label.trim() == d.value.trim())) {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            _____.$type(node, d.value);
                                        },
                                    });

                                    arr2.push({
                                        label: d.value,
                                        click() {
                                            _____.$type(node, d.value).then(() => {
                                                dd.data.forEach((d2) => {
                                                    if (d2.type == 'hidden' || d2.type == 'submit') {
                                                        return;
                                                    }
                                                    let e1 = null;
                                                    if (d2.id) {
                                                        e1 = document.getElementById(d2.id);
                                                    }
                                                    if (!e1 && d2.name) {
                                                        e1 = document.getElementsByName(d2.name);
                                                    }

                                                    if (e1) {
                                                        e1.value = d2.value;
                                                        e1.innerHTML = _____.policy.createHTML(d2.value);
                                                        if (e1.dispatchEvent) {
                                                            e1.dispatchEvent(inputEvent);
                                                            e1.dispatchEvent(changeEvent);
                                                        }
                                                    }
                                                });
                                            });
                                        },
                                    });
                                }
                            } else if (node.name && node.name == d.name) {
                                let exists = false;
                                arr1.forEach((a) => {
                                    if (a.label.trim() == d.value.trim()) {
                                        exists = true;
                                    }
                                });
                                if (!exists) {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            _____.$type(node, d.value);
                                        },
                                    });

                                    arr2.push({
                                        label: d.value,
                                        click() {
                                            _____.$type(node, d.value).then(() => {
                                                dd.data.forEach((d2) => {
                                                    if (d2.type == 'hidden' || d2.type == 'submit') {
                                                        return;
                                                    }
                                                    let e1 = null;
                                                    if (d2.id) {
                                                        e1 = document.getElementById(d2.id);
                                                    }
                                                    if (!e1 && d2.name) {
                                                        e1 = document.getElementsByName(d2.name);
                                                    }

                                                    if (e1) {
                                                        e1.value = d2.value;
                                                        e1.innerHTML = _____.policy.createHTML(d2.value);
                                                        if (e1.dispatchEvent) {
                                                            e1.dispatchEvent(inputEvent);
                                                            e1.dispatchEvent(changeEvent);
                                                        }
                                                    }
                                                });
                                            });
                                        },
                                    });
                                }
                            } else {
                                let exists = false;
                                arr1.forEach((a) => {
                                    if (a.label.trim() == d.value.trim()) {
                                        exists = true;
                                    }
                                });
                                if (!exists) {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            _____.$type(node, d.value);
                                        },
                                    });
                                }
                            }
                        });
                    });

                    _____.var.user_data.forEach((dd) => {
                        if (!dd.data) {
                            return;
                        }
                        dd.data.forEach((d) => {
                            if (arr1.some((a) => a.label.trim() == d.value.trim())) {
                                return;
                            }
                            if (node.value && !d.value.contains(node.value)) {
                                return;
                            }

                            if (node.id && node.id == d.id) {
                                arr1.push({
                                    label: d.value,
                                    click() {
                                        _____.$type(node, d.value);
                                    },
                                });

                                arr2.push({
                                    label: d.value,
                                    click() {
                                        _____.$type(node, d.value).then(() => {
                                            dd.data.forEach((d2) => {
                                                if (d2.type == 'hidden' || d2.type == 'submit') {
                                                    return;
                                                }
                                                let e1 = null;
                                                if (d2.id) {
                                                    e1 = document.getElementById(d2.id);
                                                }
                                                if (!e1 && d2.name) {
                                                    e1 = document.getElementsByName(d2.name);
                                                }

                                                if (e1) {
                                                    e1.value = d2.value;
                                                    e1.innerHTML = _____.policy.createHTML(d2.value);
                                                    if (e1.dispatchEvent) {
                                                        e1.dispatchEvent(inputEvent);
                                                        e1.dispatchEvent(changeEvent);
                                                    }
                                                }
                                            });
                                        });
                                    },
                                });
                            } else if (node.name && node.name == d.name) {
                                arr1.push({
                                    label: d.value,
                                    click() {
                                        _____.$type(node, d.value);
                                    },
                                });

                                arr2.push({
                                    label: d.value,
                                    click() {
                                        _____.$type(node, d.value).then(() => {
                                            dd.data.forEach((d2) => {
                                                if (d2.type == 'hidden' || d2.type == 'submit') {
                                                    return;
                                                }
                                                let e1 = null;
                                                if (d2.id) {
                                                    e1 = document.getElementById(d2.id);
                                                }
                                                if (!e1 && d2.name) {
                                                    e1 = document.getElementsByName(d2.name);
                                                }

                                                if (e1) {
                                                    e1.value = d2.value;
                                                    e1.innerHTML = _____.policy.createHTML(d2.value);
                                                    if (e1.dispatchEvent) {
                                                        e1.dispatchEvent(inputEvent);
                                                        e1.dispatchEvent(changeEvent);
                                                    }
                                                }
                                            });
                                        });
                                    },
                                });
                            } else {
                                arr1.push({
                                    label: d.value,
                                    click() {
                                        _____.$type(node, d.value);
                                    },
                                });
                            }
                        });
                    });

                    if (arr1.length > 0) {
                        arr1.sort((a, b) => (a.label > b.label ? 1 : -1));

                        _____.menuList.push({
                            label: 'Fill',
                            type: 'submenu',
                            submenu: arr1,
                        });
                    }
                    if (arr2.length > 0) {
                        arr2.sort((a, b) => (a.label > b.label ? 1 : -1));
                        _____.menuList.push({
                            label: 'Auto Fill All',
                            type: 'submenu',
                            submenu: arr2,
                        });
                    }
                }

                if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() == 'password' && node.value.length > 0) {
                    _____.menuList.push({
                        label: 'Show Text',
                        click() {
                            node.setAttribute('type', 'text');
                        },
                    });
                }

                _____.menuList.push({
                    label: 'Paste',
                    click() {
                        _____.webContents.paste();
                    },
                });

                if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() !== 'password' && node.value.length > 0) {
                    _____.menuList.push({
                        label: 'Hide Text',
                        click() {
                            node.setAttribute('type', 'password');
                        },
                    });
                }

                _____.menuList.push({
                    type: 'separator',
                });

                return;
            }
        }

        function get_url_menu_list(url) {
            let arr = [];
            if (_____.var.core.id.like('*developer*')) {
                arr.push({
                    label: ' in Trusted window',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            show: true,
                            iframe: true,
                            trusted: true,
                            center: true,
                        });
                    },
                });
                arr.push({
                    label: ' in Security OFF window',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            show: true,
                            iframe: true,
                            security: false,
                            center: true,
                        });
                    },
                });
                arr.push({
                    label: ' in Not Sandbox window',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            show: true,
                            iframe: true,
                            sandbox: false,
                            center: true,
                        });
                    },
                });
                arr.push({
                    label: ' in CloudFlare window',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            show: true,
                            iframe: true,
                            cloudFlare: true,
                            allowAds: true,
                            allowPopup: true,
                            center: true,
                        });
                    },
                });
                arr.push({
                    label: ' in Context Isolation window',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            show: true,
                            iframe: true,
                            contextIsolation: true,
                            allowAds: true,
                            allowPopup: true,
                            center: true,
                        });
                    },
                });
                arr.push({
                    type: 'separator',
                });
            }
            arr.push({
                label: ' in ( New tab )',
                iconURL: 'http://127.0.0.1:60080/images/link.png',
                click() {
                    _____.ipc('[open new tab]', {
                        url: url,
                        referrer: document.location.href,
                        partition: _____.partition,
                        user_name: _____.session.display,
                        windowID: _____.window.id,
                    });
                },
            });
            arr.push({
                label: ' in ( New Ghost tab )',
                iconURL: 'http://127.0.0.1:60080/images/link.png',
                click() {
                    let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                    _____.ipc('[open new tab]', { url: url, referrer: document.location.href, partition: ghost, user_name: ghost, windowID: _____.window.id });
                },
            });
            arr.push({
                label: ' in ( Current window )',
                iconURL: 'http://127.0.0.1:60080/images/page.png',
                click() {
                    document.location.href = url;
                },
            });
            arr.push({
                label: ' in ( New window )',
                iconURL: 'http://127.0.0.1:60080/images/page.png',
                click() {
                    _____.ipc('[open new popup]', {
                        url: url,
                        referrer: document.location.href,
                        partition: _____.partition,
                        show: true,
                        iframe: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                },
            });
            arr.push({
                label: ' in ( Ads window )',
                iconURL: 'http://127.0.0.1:60080/images/page.png',
                click() {
                    _____.ipc('[open new popup]', {
                        partition: _____.partition,
                        url: url,
                        referrer: document.location.href,
                        allowAds: true,
                        show: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                },
            });
            arr.push({
                label: ' in ( OFF Window )',
                iconURL: 'http://127.0.0.1:60080/images/page.png',
                click() {
                    _____.ipc('[open new popup]', {
                        partition: _____.partition,
                        url: url,
                        referrer: document.location.href,
                        allowAds: true,
                        off: true,
                        show: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                },
            });
              arr.push({
                    label: ' in [ Basic window ]',
                     iconURL: 'http://127.0.0.1:60080/images/page.png',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            show: true,
                            iframe: true,
                            contextIsolation: true,
                            allowAds: true,
                            allowPopup: true,
                            center: true,
                        });
                    },
                });
            arr.push({
                label: ' in ( Ghost window )',
                iconURL: 'http://127.0.0.1:60080/images/page.png',
                click() {
                    let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;

                    _____.ipc('[open new popup]', {
                        url: url,
                        referrer: document.location.href,
                        partition: ghost,
                        user_name: ghost,
                        defaultUserAgent: _____.getRandomBrowser('pc'),
                        vpc: _____.generateVPC('pc'),
                        show: true,
                        iframe: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: ' in ( External Browser - Default System Browser )',
                iconURL: 'http://127.0.0.1:60080/images/browser.png',
                click() {
                    _____.openExternal(document.location.href);
                },
            });
            arr.push({
                label: ' in ( Chrome Browser Simulator ) ',
                iconURL: 'http://127.0.0.1:60080/images/chrome.png',
                click() {
                    _____.openInChrome({ allowStorage: false, url: url });
                },
            });
            arr.push({
                label: ' in ( Chrome Browser Simulator ) [ Shared Cookies , User Data , Extentions ]',
                iconURL: 'http://127.0.0.1:60080/images/chrome.png',
                click() {
                    _____.openInChrome({ allowStorage: true, url: url });
                },
            });

            if (_____.var.session_list.length > 1) {
                arr.push({
                    type: 'separator',
                });

                _____.var.session_list
                    .filter((s) => !s.hide)
                    .forEach((ss, i) => {
                        arr.push({
                            label: ` As ( ${i + 1} ) [ ${ss.display} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/person.png',
                            click() {
                                _____.ipc('[open new tab]', {
                                    referrer: document.location.href,
                                    url: url,
                                    partition: ss.name,
                                    user_name: ss.display,
                                    windowID: _____.window.id,
                                });
                            },
                        });
                    });
            }
            return arr;
        }

        function add_a_menu(node) {
            if (!node || _____.menuAOFF) {
                return;
            }

            if (node.nodeName === 'A' && node.getAttribute('href') && !node.getAttribute('href').startsWith('#')) {
                let href = node.getAttribute('href');
                let u = _____.handleURL(href);

                let u_string = ' [ ' + u.substring(0, 70) + ' ] ';
                if (u.like('mailto:*')) {
                    let mail = u.replace('mailto:', '');
                    _____.menuList.push({
                        label: `Copy Email ${u_string}`,
                        click() {
                            _____.copy(mail);
                        },
                    });
                    return;
                } else {
                    _____.selectedURL = u;

                    _____.menuList.push({
                        label: `Open link ${u_string} in ( new tab ) `,
                        iconURL: 'http://127.0.0.1:60080/images/link.png',
                        click() {
                            _____.ipc('[open new tab]', {
                                referrer: document.location.href,
                                url: _____.handleURL(u),
                                partition: _____.partition,
                                user_name: _____.session.display,
                                windowID: _____.window.id,
                                center: true,
                            });
                        },
                    });

                    _____.menuList.push({
                        label: `Open link ${u_string} in ( current window ) `,
                        iconURL: 'http://127.0.0.1:60080/images/link.png',
                        click() {
                            document.location.href = u;
                        },
                    });

                    _____.menuList.push({
                        type: 'separator',
                    });

                    _____.menuList.push({
                        label: `Copy link ${u_string}`,
                        click() {
                            _____.copy(u);
                        },
                    });

                    let arr = get_url_menu_list(u);
                    _____.menuList.push({
                        label: `Open link ${u_string} `,
                        iconURL: 'http://127.0.0.1:60080/images/link.png',
                        type: 'submenu',
                        submenu: arr,
                    });
                }
                _____.menuList.push({
                    type: 'separator',
                });

                if (u.like('https://www.youtube.com/watch*')) {
                    _____.menuList.push({
                        label: 'Play Youtube video ',
                        click() {
                            _____.ipc('[open new popup]', {
                                windowType: 'youtube',
                                url: u || 'https://www.youtube.com/embed/' + u.split('=')[1].split('&')[0],
                                partition: _____.partition,
                                referrer: document.location.href,
                                eval3: () => {
                                    // playing problem
                                    _____.onLoad(() => {
                                        _____.addCSS('#masthead-container{display:none}');
                                    });
                                },
                            });
                        },
                    });
                    _____.menuList.push({
                        label: 'Download Youtube video ',
                        click() {
                            _____.ipc('[open new popup]', {
                                url: u.replace('youtube', 'ssyoutube'),
                                partition: _____.partition,
                                referrer: document.location.href,
                                allowAds: true,
                                allowPopup: true,
                                show: true,
                                center: true,
                            });
                        },
                    });

                    _____.menuList.push({
                        type: 'separator',
                    });
                }

                if (u.like('*youtube.com/short*')) {
                    _____.menuList.push({
                        label: 'Play Youtube Shorts video ',
                        click() {
                            _____.ipc('[open new popup]', {
                                windowType: 'popup',
                                title: 'YouTube',
                                alwaysOnTop: true,
                                center: true,
                                width: 550,
                                height: 850,
                                show: true,
                                url: u,
                                partition: _____.partition,
                                referrer: document.location.href,
                                eval2: () => {
                                    _____.addCSS('#masthead-container{display:none}');
                                },
                            });
                        },
                    });

                    _____.menuList.push({
                        type: 'separator',
                    });
                }

                return;
            }

            add_a_menu(node.parentNode);
        }

        function get_img_menu(node) {
            if (!node || _____.menuImgOFF) {
                return;
            }

            if (node.nodeName == 'IMG' && node.getAttribute('src')) {
                let url = node.getAttribute('src');
                url = _____.handleURL(url);
                u_string = ' [ ' + url.substring(0, 70) + ' ] ';
                _____.menuList.push({
                    label: `Open image ${u_string} in ( new tab ) `,
                    click() {
                        _____.ipc('[open new tab]', {
                            url: url,
                            referrer: document.location.href,
                            windowID: _____.window.id,
                        });
                    },
                });

                let arr = get_url_menu_list(url);
                _____.menuList.push({
                    label: `Open Image link ${u_string} `,
                    type: 'submenu',
                    submenu: arr,
                });

                _____.menuList.push({
                    label: `Copy image address ${u_string} `,
                    click() {
                        _____.copy(url);
                    },
                });

                _____.menuList.push({
                    label: `Save image ${u_string} `,
                    click() {
                        _____.downloadURL(url);
                        return;
                        sendToMain({
                            name: '[download-link]',
                            url: url,
                        });
                    },
                });

                _____.menuList.push({
                    type: 'separator',
                });
                return;
            }
            get_img_menu(node.parentNode);
        }

        function add_div_menu(node) {
            if (!node || _____.menuDivOFF) {
                return;
            }

            if (node.nodeName === 'DIV') {
                _____.menuList.push({
                    label: 'Copy inner text',
                    click() {
                        _____.copy(node.innerText);
                    },
                });
                _____.menuList.push({
                    label: 'Copy inner html',
                    click() {
                        _____.copy(node.innerText);
                    },
                });
                _____.menuList.push({
                    type: 'separator',
                });
                return;
            }
            add_div_menu(node.parentNode);
        }

        let isImageHidden = false;
        let image_interval = null;

        let isIframesDeleted = false;
        let iframe_interval = null;

        function removeIframes() {
            isIframesDeleted = true;
            iframe_interval = setInterval(() => {
                document.querySelectorAll('iframe').forEach((frm) => {
                    frm.remove();
                });
            }, 1000);
        }

        function get_options_menu(node) {
            if (_____.menuOptionsOFF) {
                return;
            }

            let arr = [];

            arr.push({
                label: 'Copy page Link',
                click() {
                    _____.copy(window.location.href);
                },
            });
            arr.push({
                label: 'Copy Profile Name',
                sublabel: _____.session.display,
                click() {
                    _____.copy(_____.session.display);
                },
            });
            arr.push({
                label: 'Copy Profile ID',
                sublabel: _____.session.name,
                click() {
                    _____.copy(_____.session.name);
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: '( Social Session ) ==> Copy to Clipboard',
                click() {
                    _____.copy(_____.hideObject(_____.getSiteData()));
                    _____.alert('Site Data Text Copied !!');
                },
            });

            arr.push({
                label: '( Social Session ) Import from Clipboard to ==> current profile ',
                click() {
                    let txt = _____.clipboard.readText();
                    _____.alert('Social Session Imported !!');
                    _____.importSiteData(txt, 0);
                },
            });
            arr.push({
                label: '( Social Session ) Import from Clipboard to ==> Copied profile ',
                click() {
                    let txt = _____.clipboard.readText();
                    _____.alert('Social Session Imported !!');
                    _____.importSiteData(txt, 1);
                },
            });
            arr.push({
                label: '( Social Session ) Import from Clipboard to ==> Ghost profile ',
                click() {
                    let txt = _____.clipboard.readText();
                    _____.alert('Social Session Imported !!');
                    _____.importSiteData(txt, 2);
                },
            });
            arr.push({
                type: 'separator',
            });

            arr.push({
                label: '( Json Cookies ) ==> Copy to Clipboard',
                click() {
                    _____.copy(_____.toJson(_____.getDomainCookies().cookies));
                    _____.alert('Json Cookies Copied !!');
                },
            });
            arr.push({
                label: '( Json Cookies ) ==> Import from Clipboard',
                click() {
                    _____.setDomainCookies({ cookies: _____.fromJson(_____.clipboard.readText()) });
                    _____.alert('Json Cookies Imported !!');
                    _____.window.reload();
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: '( HTTP Cookies ) ==> Copy to Clipboard',
                click() {
                    _____.copy(_____.getHttpCookie());
                    _____.alert('HTTP Cookies Text Copied !!');
                },
            });
            arr.push({
                label: '( HTTP Cookies ) ==> Import from Clipboard',
                click() {
                    _____.setHttpCookie({ cookie: _____.clipboard.readText(), mode: 0 });
                    _____.alert('HTTP Cookies Set !!');
                    _____.window.reload();
                },
            });
            arr.push({
                label: '( HTTP Cookies ) ==> Remove Imported Cookies',
                click() {
                    _____.setHttpCookie({ cookie: '', off: true });
                    _____.alert('Imported HTTP Cookies Removed !!');
                    _____.window.reload();
                },
            });
            arr.push({
                type: 'separator',
            });
            if (_____.var.core.flags.like('*v2*')) {
                arr.push({
                    label: 'Copy Private Key',
                    click() {
                        _____.copy('_KEY_' + _____.md5(_____.var.core.id) + '_');
                    },
                });

                arr.push({
                    type: 'separator',
                });
            }

            arr.push({
                label: 'Save page',
                accelerator: 'CommandOrControl+s',
                click() {
                    _____.showUserMessage('Page Saving <br> ' + document.location.href);
                    _____.webContents.downloadURL(document.location.href);
                },
            });

            arr.push({
                label: 'Save page as PDF',
                click() {
                    _____.showUserMessage('Page Saving as PDF: ' + document.location.href);
                    sendToMain({
                        name: '[save-window-as-pdf]',
                        windowID: _____.window.id,
                    });
                },
            });

            arr.push({
                label: 'Print page',
                accelerator: 'CommandOrControl+p',
                click() {
                    window.print();
                },
            });

            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'Sound on/off',
                click() {
                    _____.webContents.setAudioMuted(!_____.webContents.audioMuted);
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'Hard Refresh',
                accelerator: 'CommandOrControl+F5',
                click() {
                    _____.ipc('[window-reload-hard]', {
                        windowID: _____.window.id,
                        origin: document.location.origin || document.location.href,
                        partition: _____.partition,
                        storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
                    });
                },
            });
            arr.push({
                type: 'separator',
            });

            arr.push({
                label: 'Full Screen',
                accelerator: 'F11',
                click() {
                    sendToMain({
                        name: '[toggle-fullscreen]',
                        windowID: _____.window.id,
                    });
                },
            });

            arr.push({
                type: 'separator',
            });

            arr.push({
                label: 'Clear Site Cache',
                accelerator: 'CommandOrControl+F5',
                click() {
                    _____.ipc('[window-reload-hard]', {
                        windowID: _____.window.id,
                        origin: document.location.origin || document.location.href,
                        storages: ['appcache', 'filesystem', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
                    });
                },
            });

            arr.push({
                label: 'Clear Site Cookies',
                click() {
                    _____.ipc('[window-reload-hard]', {
                        windowID: _____.window.id,
                        origin: document.location.origin || document.location.href,
                        storages: ['cookies'],
                    });
                },
            });

            arr.push({
                label: 'Clear All Site Data',
                click() {
                    _____.ipc('[window-reload-hard]', {
                        windowID: _____.window.id,
                        origin: document.location.origin || document.location.href,
                        storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage', 'cookies'],
                    });
                },
            });

            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'Hide window',
                click() {
                    _____.window.setSkipTaskbar(true);
                    _____.window.setAlwaysOnTop(false);
                    _____.window.setFullScreen(false);
                    _____.webContents.setAudioMuted(true);
                    setTimeout(() => {
                        _____.window.hide();
                    }, 500);
                },
            });
            arr.push({
                label: 'Close window',
                click() {
                    _____.window.close();
                },
            });
            if (_____.var.core.id.like('*developer*')) {
                arr.push({
                    label: 'Destroy window',
                    click() {
                        _____.window.destroy();
                    },
                });
            }

            arr.push({
                type: 'separator',
            });

            let m = {
                label: decodeURI(document.location.href),
                sublabel: 'Page Options',
                iconURL: 'http://127.0.0.1:60080/images/page.png',
                type: 'submenu',
                submenu: arr,
            };

            _____.menuList.push(m);

            let arr2 = [];

            document.querySelectorAll('iframe').forEach((f, i) => {
                if (i > 10) {
                    return;
                }
                if (f.src && !f.src.like('*javascript*') && !f.src.like('*about:*')) {
                    arr2.push({
                        label: f.src,
                        sublabel: 'Open Frame in new popup',
                        click() {
                            _____.ipc('[open new popup]', {
                                partition: _____.partition,
                                url: 'http://127.0.0.1:60080/iframe?url=' + f.src,
                                referrer: document.location.href,
                                show: true,
                                vip: true,
                                center: true,
                                alwaysOnTop: true,
                            });
                        },
                    });

                    arr2.push({
                        label: f.src,
                        sublabel: 'Copy link ',
                        click() {
                            _____.copy(f.src);
                        },
                    });
                    arr2.push({
                        label: f.src,
                        sublabel: 'Download link ',
                        click() {
                            sendToMain({
                                name: '[download-link]',
                                url: f.src,
                            });
                        },
                    });
                    arr2.push({
                        type: 'separator',
                    });
                }
            });

            if (arr2.length > 0) {
                let m2 = {
                    label: 'Frames on page',
                    iconURL: 'http://127.0.0.1:60080/images/page.png',
                    type: 'submenu',
                    submenu: arr2,
                };
                _____.menuList.push(m2);
            }

            let arr3 = [];

            _____.video_list.forEach((f, i) => {
                if (i > 5 || !f.src.startsWith('http')) {
                    return;
                }
                arr3.push({
                    label: f.src,
                    sublabel: 'Play  Video',
                    click() {
                        _____.ipc('[open new popup]', {
                            alwaysOnTop: true,
                            partition: _____.partition,
                            url: 'browser://video?url=' + f.src,
                            referrer: document.location.href,
                            show: true,
                            vip: true,
                            center: true,
                        });
                    },
                });

                arr3.push({
                    label: f.src,
                    sublabel: 'Download Video',
                    click() {
                        sendToMain({
                            name: '[download-link]',
                            url: f.src,
                        });
                    },
                });

                arr3.push({
                    label: f.src,
                    sublabel: 'Copy Video Link',
                    click() {
                        _____.copy(f.src);
                    },
                });
                arr3.push({
                    type: 'separator',
                });
            });

            if (arr3.length > 0) {
                let m3 = {
                    label: 'Videos on page',
                    type: 'submenu',
                    submenu: arr3,
                };
                _____.menuList.push(m3);
                _____.menuList.push({
                    type: 'separator',
                });
            }

            return;
        }

        function get_custom_menu() {
            if (_____.menuCustomOFF) {
                return;
            }

            let vids = document.querySelectorAll('video');
            if (vids.length > 0) {
                vids.forEach((v) => {
                    if (v.currentTime != v.duration && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
                        _____.menuList.push({
                            label: 'Skip playing video ',
                            click() {
                                v.currentTime = v.duration;
                            },
                        });
                        if (v.src.like('http*')) {
                            _____.menuList.push({
                                label: 'Download playing video ',
                                click() {
                                    sendToMain({
                                        name: '[download-link]',
                                        url: v.src,
                                    });
                                },
                            });
                        }

                        _____.menuList.push({
                            type: 'separator',
                        });
                    }
                });
            }

            if (document.location.href.like('https://www.youtube.com/watch*')) {
                _____.menuList.push({
                    label: 'Open current video',
                    click() {
                        _____.ipc('[open new popup]', {
                            windowType: 'youtube',
                            url: document.location.href || 'https://www.youtube.com/embed/' + document.location.href.split('=')[1].split('&')[0],
                            partition: _____.partition,
                            referrer: document.location.href,
                        });
                    },
                });

                _____.menuList.push({
                    label: 'Download current video',
                    click() {
                        _____.ipc('[open new popup]', {
                            partition: _____.partition,
                            referrer: document.location.href,
                            url: document.location.href.replace('youtube', 'ssyoutube'),
                            show: true,
                            allowAds: true,
                            allowPopup: true,
                            center: true,
                            vip: true,
                        });
                    },
                });

                _____.menuList.push({
                    type: 'separator',
                });
            }
        }
        function getCustomSettingMenu() {
            let arr = [];

            arr.push({
                label: 'Allow Default Web Worker ( Solve Captcha Problems )',
                type: 'checkbox',
                checked: _____.customSetting.allowDefaultWorker || false,
                click() {
                    _____.customSetting.allowDefaultWorker = !_____.customSetting.allowDefaultWorker;
                },
            });

            arr.push({
                type: 'separator',
            });

            arr.push({
                label: 'Block Load Images',
                type: 'checkbox',
                checked: _____.customSetting.blockImages || false,
                click() {
                    _____.customSetting.blockImages = !_____.customSetting.blockImages;
                },
            });
            arr.push({
                label: 'Block Load Media / Videos',
                type: 'checkbox',
                checked: _____.customSetting.blockMedia || false,
                click() {
                    _____.customSetting.blockMedia = !_____.customSetting.blockMedia;
                },
            });
            arr.push({
                label: 'Block Load JavaScript Files',
                type: 'checkbox',
                checked: _____.customSetting.blockJS || false,
                click() {
                    _____.customSetting.blockJS = !_____.customSetting.blockJS;
                },
            });
            arr.push({
                label: 'Block XMLHttpRequest / fetch ',
                type: 'checkbox',
                checked: _____.customSetting.blockXHR || false,
                click() {
                    _____.customSetting.blockXHR = !_____.customSetting.blockXHR;
                },
            });
            arr.push({
                label: 'Block Load Sub Frames',
                type: 'checkbox',
                checked: _____.customSetting.blockSubFrame || false,
                click() {
                    _____.customSetting.blockSubFrame = !_____.customSetting.blockSubFrame;
                },
            });
            arr.push({
                label: 'Block Load CSS Files',
                type: 'checkbox',
                checked: _____.customSetting.blockCSS || false,
                click() {
                    _____.customSetting.blockCSS = !_____.customSetting.blockCSS;
                },
            });
            arr.push({
                label: 'Block Load Fonts',
                type: 'checkbox',
                checked: _____.customSetting.blockFonts || false,
                click() {
                    _____.customSetting.blockFonts = !_____.customSetting.blockFonts;
                },
            });
            arr.push({
                label: 'Block WebSocket connection',
                type: 'checkbox',
                checked: _____.customSetting.blockWebSocket || false,
                click() {
                    _____.customSetting.blockWebSocket = !_____.customSetting.blockWebSocket;
                },
            });
            arr.push({
                label: 'Block CSP Reports',
                type: 'checkbox',
                checked: _____.customSetting.blockCspReport || false,
                click() {
                    _____.customSetting.blockCspReport = !_____.customSetting.blockCspReport;
                },
            });
            arr.push({
                label: 'Block Object Resources',
                type: 'checkbox',
                checked: _____.customSetting.blockObject || false,
                click() {
                    _____.customSetting.blockObject = !_____.customSetting.blockObject;
                },
            });
            arr.push({
                label: 'Block Other Resources',
                type: 'checkbox',
                checked: _____.customSetting.blockOther || false,
                click() {
                    _____.customSetting.blockOther = !_____.customSetting.blockOther;
                },
            });

            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'allow Ads',
                type: 'checkbox',
                checked: _____.customSetting.allowAds || false,
                click() {
                    _____.customSetting.allowAds = !_____.customSetting.allowAds;
                },
            });
            arr.push({
                label: 'allow Popup',
                type: 'checkbox',
                checked: _____.customSetting.allowPopup || false,
                click() {
                    _____.customSetting.allowPopup = !_____.customSetting.allowPopup;
                },
            });
            arr.push({
                label: 'allow URL Redirect',
                type: 'checkbox',
                checked: _____.customSetting.allowRedirect || false,
                click() {
                    _____.customSetting.allowRedirect = !_____.customSetting.allowRedirect;
                },
            });

            arr.push({
                label: 'allow Open in External Apps',
                type: 'checkbox',
                checked: _____.customSetting.allowOpenExternal || false,
                click() {
                    _____.customSetting.allowOpenExternal = !_____.customSetting.allowOpenExternal;
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'allow Cross Origin Requests',
                type: 'checkbox',
                checked: _____.customSetting.allowCrossOrigin || false,
                click() {
                    _____.customSetting.allowCrossOrigin = !_____.customSetting.allowCrossOrigin;
                },
            });

            arr.push({
                label: 'allow Google Translate',
                type: 'checkbox',
                checked: _____.customSetting.allowGoogleTranslate || false,
                click() {
                    _____.customSetting.allowGoogleTranslate = !_____.customSetting.allowGoogleTranslate;
                    if (_____.customSetting.allowGoogleTranslate) {
                        _____.allowGoogleTranslate();
                    }
                },
            });
            arr.push({
                label: 'allow Download',
                type: 'checkbox',
                checked: _____.customSetting.allowDownload || false,
                click() {
                    _____.customSetting.allowDownload = !_____.customSetting.allowDownload;
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'Mark Window as ( White Site )',
                type: 'checkbox',
                checked: _____.customSetting.isWhiteSite || false,
                click() {
                    _____.customSetting.isWhiteSite = !_____.customSetting.isWhiteSite;
                },
            });
            arr.push({
                type: 'separator',
            });
            arr.push({
                label: 'turn off / [ Javascript Engine ]',
                type: 'checkbox',
                checked: _____.customSetting.javaScriptOFF || false,
                click() {
                    _____.customSetting.javaScriptOFF = !_____.customSetting.javaScriptOFF;
                },
            });
            arr.push({
                label: 'turn off / [ Browser Engine ]',
                type: 'checkbox',
                checked: _____.customSetting.enginOFF || false,
                click() {
                    _____.customSetting.enginOFF = !_____.customSetting.enginOFF;
                },
            });
            arr.push({
                label: 'turn off / [ ALL Engine ]',
                type: 'checkbox',
                checked: _____.customSetting.off || false,
                click() {
                    _____.customSetting.off = !_____.customSetting.off;
                },
            });
            if (_____.isDeveloperMode()) {
                arr.push({
                    label: 'Allow Javascript _____',
                    type: 'checkbox',
                    checked: _____.customSetting.allow_____ || false,
                    click() {
                        _____.customSetting.allow_____ = !_____.customSetting.allow_____;
                        _____.window.reload();
                    },
                });
            }
            if (arr.length > 0) {
                _____.menuList.push({
                    label: 'Custom Setting',
                    iconURL: 'http://127.0.0.1:60080/images/page.png',
                    type: 'submenu',
                    submenu: arr,
                });

                _____.menuList.push({
                    type: 'separator',
                });
            }
        }

        function get2faMenu() {
            let arr = [];
            _____.var.faList.forEach((fa) => {
                arr.push({
                    label: `Paste New Token ==> ${fa.email || fa.partition} / ${fa.domain}  /  ${fa.code}`,
                    click() {
                        _____.fetchJson({ url: 'https://2fa.live/tok/' + fa.code.replaceAll(' ', '') }).then((data) => {
                            if (data && data.token) {
                                _____.copy(data.token);
                                _____.paste();
                            } else {
                                _____.alert('Error While Get Token');
                                _____.log(data);
                            }
                        });
                    },
                });
            });

            if (arr.length > 0) {
                _____.menuList.push({
                    label: '2FA Codes',
                    type: 'submenu',
                    submenu: arr,
                });

                _____.menuList.push({
                    type: 'separator',
                });
            }
        }

        function getEmailMenu() {
            let arr = [];
            if (_____.var.core.emails && _____.var.core.emails.enabled && _____.session.display) {
                if (_____.session.display.contains('@')) {
                    arr.push({
                        label: 'paste - Current Email',
                        sublabel: _____.session.display,
                        click() {
                            _____.$paste(_____.session.display);
                        },
                    });
                    let currentLogin = _____.var.user_data_input.filter((d) => d.username == _____.session.display)[0];
                    if (currentLogin && currentLogin.password) {
                        arr.push({
                            label: 'paste - Current Password',
                            click() {
                                _____.$paste(currentLogin.password);
                            },
                        });
                    }
                    if (_____.session.display.contains('@gmail.com')) {
                        arr.push({
                            label: 'Open - Gmail Inbox',
                            click() {
                                _____.ipc('[open new popup]', {
                                    partition: _____.partition,
                                    referrer: document.location.href,
                                    url: 'https://mail.google.com/mail/u/0',
                                    show: true,
                                    allowDevTools: false,
                                    allowNewWindows: true,
                                    allowPopup: true,
                                    center: true,
                                    vip: true,
                                });
                            },
                        });
                    }

                    if (_____.var.core.emails.domain) {
                        let newEmail = _____.session.display.split('@')[0] + '@' + _____.var.core.emails.domain;
                        if (newEmail !== _____.session.display) {
                            arr.push({
                                label: 'paste - Current Temp Mail',
                                sublabel: newEmail,
                                click() {
                                    _____.$paste(newEmail);
                                },
                            });
                        }

                        arr.push({
                            label: 'paste - OTP Code',
                            sublabel: newEmail,
                            click() {
                                let _url = 'http://emails.' + _____.var.core.emails.domain + '/api/emails/view';
                                _____.fetchJson(
                                    {
                                        url: _url,
                                        method: 'POST',
                                        headers: { 'X-Browser': (_____.var.core.brand || 'social') + '.' + _____.var.core.id },
                                        body: { to: newEmail },
                                    },
                                    (data) => {
                                        _____.log(data);
                                        if (data.isVIP && !data.doc) {
                                            _____.alert('EMail Address is Banned / Deleted ..');
                                        } else if (data.done && data.doc) {
                                            var codeRex = /(?:[-+() ]*\d){5,10}/gm;

                                            let email = data.doc;
                                            let code = email.subject.match(codeRex) || email.text.match(codeRex) || email.html.match(codeRex);
                                            if (code) {
                                                code = code[0];
                                                _____.$paste(code);
                                                return true;
                                            } else {
                                                _____.alert('No Code Exists ..');
                                            }
                                        } else {
                                            _____.alert('No Messages Found ..');
                                        }
                                    },
                                );
                            },
                        });

                        arr.push({
                            type: 'separator',
                        });
                        arr.push({
                            label: 'Show / All Temp Mail Messages',
                            click() {
                                _____.ipc('[open new popup]', {
                                    partition: _____.partition,
                                    referrer: document.location.href,
                                    url: 'http://emails.' + _____.var.core.emails.domain + '/vip?email=' + newEmail,
                                    show: true,
                                    allowDevTools: false,
                                    alwaysOnTop: true,
                                    trusted: true,
                                    vip: true,
                                    center: true,
                                    vip: true,
                                });
                            },
                        });
                        arr.push({
                            type: 'separator',
                        });
                    }
                } else {
                    arr.push({
                        label: 'paste - Current Profile Name',
                        click() {
                            _____.$paste(_____.session.display);
                        },
                    });
                    arr.push({
                        label: 'paste - Temp Email',
                        click() {
                            _____.$paste(_____.session.display + '@' + _____.tempMailServer);
                        },
                    });
                }

                if (_____.var.core.emails.password) {
                    arr.push({
                        label: 'paste - Default Password',
                        click() {
                            _____.$paste(_____.var.core.emails.password);
                        },
                    });
                }
                if (_____.var.core.emails.password2) {
                    arr.push({
                        label: 'paste - Default Password 2',
                        click() {
                            _____.$paste(_____.var.core.emails.password2);
                        },
                    });
                }
                if (_____.var.core.emails.password3) {
                    arr.push({
                        label: 'paste - Default Password 3',
                        click() {
                            _____.$paste(_____.var.core.emails.password3);
                        },
                    });
                }
            }

            if (_____.session.user) {
                arr.push({
                    type: 'separator',
                });

                if (_____.session.user.mainEmail) {
                    arr.push({
                        label: 'paste - Main Email',
                        sublabel: _____.session.user.mainEmail,
                        click() {
                            _____.$paste(_____.session.user.mainEmail);
                        },
                    });
                }
                if (_____.session.user.tempEmail) {
                    arr.push({
                        label: 'paste - Temp Email',
                        sublabel: _____.session.user.tempEmail,
                        click() {
                            _____.$paste(_____.session.user.tempEmail);
                        },
                    });
                }
                if (_____.session.user.mainPassword) {
                    arr.push({
                        label: 'paste - Main Password',
                        click() {
                            _____.$paste(_____.session.user.mainPassword);
                        },
                    });
                }
                if (_____.session.user.tempPassword) {
                    arr.push({
                        label: 'paste - Temp Password',
                        click() {
                            _____.$paste(_____.session.user.tempPassword);
                        },
                    });
                }
                if (_____.session.user.firstName) {
                    arr.push({
                        label: 'paste - First Name',
                        sublabel: _____.session.user.firstName,
                        click() {
                            _____.$paste(_____.session.user.firstName);
                        },
                    });
                }
                if (_____.session.user.lastName) {
                    arr.push({
                        label: 'paste - Last Name',
                        sublabel: _____.session.user.lastName,
                        click() {
                            _____.$paste(_____.session.user.lastName);
                        },
                    });
                }
                if (_____.session.user.birthDate) {
                    _____.session.user.birthDate = new Date(_____.session.user.birthDate);
                    arr.push({
                        label: 'paste - BirthDate',
                        sublabel: _____.session.user.birthDate.toLocaleDateString(),
                        click() {
                            _____.$paste(_____.session.user.birthDate.toLocaleDateString());
                        },
                    });
                }
                let gender = _____.session.user.isFemale ? 'Female' : 'Male';
                arr.push({
                    label: 'Gender is ' + gender + ' ( click to paste )',
                    click() {
                        _____.$paste(gender);
                    },
                });
            }
            if (arr.length > 0) {
                _____.menuList.push({
                    label: 'User Profile Information',
                    sublabel: 'Email + Passwords + Personal Data',
                    type: 'submenu',
                    submenu: arr,
                    iconURL: 'http://127.0.0.1:60080/images/person.png',
                });

                _____.menuList.push({
                    type: 'separator',
                });
            }
        }

        function createChromeMenu() {
            let arr = [];

            arr.push({
                label: 'With Default Profile',
                click() {
                    _____.openInChrome({
                        args: ['--start-maximized'],
                    });
                },
            });

            arr.push({
                label: 'With Amr Profile 1',
                click() {
                    _____.openInChrome({
                        args: ['--start-maximized', '--profile-directory=Profile 1'],
                    });
                },
            });
            arr.push({
                label: 'With Amr Profile 2',
                click() {
                    _____.openInChrome({
                        args: ['--start-maximized', '--profile-directory=Profile 2'],
                    });
                },
            });
            arr.push({ type: 'separator' });

            _____.var.session_list
                .filter((s) => !s.hide)
                .forEach((s, i) => {
                    let currentID = _____.partition.replace('persist:', '');
                    let userID = s.name.replace('persist:', '');
                    arr.push({
                        label: ` As ( ${i + 1} ) [ ${s.display} ] `,
                        iconURL: 'http://127.0.0.1:60080/images/person.png',
                        click() {
                            _____.openInChrome({
                                userDataDir: _____.userDataDir.replace(currentID, userID) + '/chrome',
                                //  args: ['--start-maximized', '--profile-directory=' + s.name],
                            });
                        },
                    });
                });

            if (arr.length > 0) {
                _____.menuList.push({
                    label: 'Open in Google Chrome',
                    iconURL: 'http://127.0.0.1:60080/images/chrome.png',
                    type: 'submenu',
                    submenu: arr,
                });
                _____.menuList.push({ type: 'separator' });
            }
        }

        function createDevelopmentMenu() {
            if (_____.menuTestOFF) {
                return;
            }
            let arr = [];

            arr.push({
                label: 'Inspect Element',
                iconURL: 'http://127.0.0.1:60080/images/dev.png',
                click() {
                    _____.webContents.inspectElement(_____.rightClickPosition.x2, _____.rightClickPosition.y2);
                    if (_____.webContents.isDevToolsOpened()) {
                        _____.webContents.devToolsWebContents.focus();
                    }
                },
            });

            arr.push({
                label: 'Developer Tools',
                iconURL: 'http://127.0.0.1:60080/images/dev.png',
                accelerator: 'F12',
                click() {
                    _____.webContents.openDevTools();
                },
            });

            _____.menuList.push({
                type: 'separator',
            });

            arr.push({
                label: 'Solve Google Captcha',
                click() {
                    _____.sendMessage({ name: '[recaptcha-detected]' });
                },
            });
            arr.push({ type: 'separator' });
            arr.push({
                label: 'Exist Social Browser',
                click() {
                    _____.ws({ type: '[close]' });
                },
            });

            if (arr.length > 0) {
                _____.menuList.push({
                    label: 'Development Menu',
                    iconURL: 'http://127.0.0.1:60080/images/dev.png',
                    type: 'submenu',
                    submenu: arr,
                });
            }
        }

        function createMenuList(node) {
            if (_____.customSetting.windowType !== 'main') {
                add_input_menu(node);
                add_a_menu(node);

                _____.menu_list.forEach((m) => {
                    _____.menuList.push(m);
                });

                if (_____.memoryText() && _____.isValidURL(_____.memoryText())) {
                    let arr = get_url_menu_list(_____.memoryText());
                    _____.menuList.push({
                        label: `Open link [ ${_____.memoryText().substring(0, 70)} ] `,
                        iconURL: 'http://127.0.0.1:60080/images/link.png',
                        type: 'submenu',
                        submenu: arr,
                    });

                    _____.menuList.push({ type: 'separator' });
                } else {
                    if (_____.memoryText()) {
                        let stext = _____.memoryText().substring(0, 70);

                        _____.menuList.push({
                            label: `Translate [ ${stext} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/translate.png',
                            click() {
                                _____.ipc('[open new popup]', {
                                    partition: _____.partition,
                                    show: true,
                                    center: true,
                                    url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(_____.memoryText()),
                                });
                            },
                        });

                        _____.menuList.push({
                            label: `Search  [ ${stext} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/search.png',
                            click() {
                                _____.ipc('[open new tab]', {
                                    referrer: document.location.href,
                                    url: 'https://www.google.com/search?q=' + encodeURIComponent(_____.memoryText()),
                                    windowID: _____.window.id,
                                });
                            },
                        });

                        _____.menuList.push({
                            type: 'separator',
                        });
                    }
                }

                get_img_menu(node);

                if (_____.var.blocking.open_list.length > 0) {
                    _____.var.blocking.open_list.forEach((o) => {
                        if (o.enabled) {
                            if (o.multi) {
                                let arr = get_url_menu_list(o.url || document.location.href);
                                _____.menuList.push({
                                    iconURL: 'http://127.0.0.1:60080/images/menu.png',
                                    label: o.name,
                                    type: 'submenu',
                                    submenu: arr,
                                });
                            } else {
                                _____.menuList.push({
                                    label: o.name,
                                    iconURL: 'http://127.0.0.1:60080/images/menu.png',
                                    click() {
                                        _____.ipc('[open new tab]', {
                                            partition: _____.partition,
                                            url: o.url || document.location.href,
                                            referrer: document.location.href,
                                            show: true,
                                            windowID: _____.window.id,
                                        });
                                    },
                                });
                            }

                            _____.menuList.push({
                                type: 'separator',
                            });
                        }
                    });
                }
                //  createChromeMenu();
                get_custom_menu();
                if (_____.var.blocking.context_menu.copy_div_content) {
                    add_div_menu(node);
                }

                _____.menuList.push({
                    label: 'Refresh',
                    accelerator: 'F5',
                    iconURL: 'http://127.0.0.1:60080/images/reload.png',
                    click: function () {
                        _____.webContents.reload();
                    },
                });

                _____.menuList.push({
                    type: 'separator',
                });

                if (_____.var.blocking.context_menu.proxy_options) {
                    let arr = [];
                    arr.push({
                        label: 'open current URL in 5 Random Proxies ( Ghost Profile )',
                        click() {
                            _____.startProxyIndex = _____.startProxyIndex || 0;
                            _____.var.proxy_list.slice(_____.startProxyIndex, _____.startProxyIndex + 5).forEach((p, i) => {
                                setTimeout(
                                    () => {
                                        _____.openNewPopup({
                                            show: true,
                                            url: document.location.href,
                                            proxy: p,
                                            partition: 'x-ghost_' + new Date().getTime(),
                                            iframe: true,
                                            center: true,
                                            alwaysOnTop: true,
                                            eval: () => {
                                                var _____ = globalThis.this;
                                                _____.onLoad(() => {
                                                    _____.$('title').innerHTML += ' , Prxoy : ' + _____.customSetting.proxy.url;
                                                });
                                            },
                                        });
                                    },
                                    1000 * 2 * i,
                                );
                            });
                            _____.startProxyIndex += 5;
                            if (_____.startProxyIndex > _____.var.proxy_list.length - 1) {
                                _____.startProxyIndex = 0;
                            }
                        },
                    });
                    arr.push({
                        label: 'open current URL in 10 Random Proxies ( Ghost Profile )',
                        click() {
                            _____.startProxyIndex = _____.startProxyIndex || 0;
                            _____.var.proxy_list.slice(_____.startProxyIndex, _____.startProxyIndex + 10).forEach((p, i) => {
                                setTimeout(
                                    () => {
                                        _____.openNewPopup({
                                            show: true,
                                            url: document.location.href,
                                            proxy: p,
                                            partition: 'x-ghost_' + new Date().getTime(),
                                            iframe: true,
                                            center: true,
                                            alwaysOnTop: true,
                                            eval: () => {
                                                var _____ = globalThis.this;
                                                _____.onLoad(() => {
                                                    _____.$('title').innerHTML += ' , Prxoy : ' + _____.customSetting.proxy.url;
                                                });
                                            },
                                        });
                                    },
                                    1000 * 3 * i,
                                );
                            });
                            _____.startProxyIndex += 10;
                            if (_____.startProxyIndex > _____.var.proxy_list.length - 1) {
                                _____.startProxyIndex = 0;
                            }
                        },
                    });
                    arr.push({
                        label: 'open current URL in 50 Random Proxies ( Ghost Profile )',
                        click() {
                            _____.startProxyIndex = _____.startProxyIndex || 0;
                            _____.var.proxy_list.slice(_____.startProxyIndex, _____.startProxyIndex + 50).forEach((p, i) => {
                                setTimeout(
                                    () => {
                                        _____.openNewPopup({
                                            show: true,
                                            url: document.location.href,
                                            proxy: p,
                                            partition: 'x-ghost_' + new Date().getTime(),
                                            iframe: true,
                                            center: true,
                                            alwaysOnTop: true,
                                            eval: () => {
                                                var _____ = globalThis.this;
                                                _____.onLoad(() => {
                                                    _____.$('title').innerHTML += ' , Prxoy : ' + _____.customSetting.proxy.url;
                                                });
                                            },
                                        });
                                    },
                                    1000 * 5 * i,
                                );
                            });
                            _____.startProxyIndex += 50;
                            if (_____.startProxyIndex > _____.var.proxy_list.length - 1) {
                                _____.startProxyIndex = 0;
                            }
                        },
                    });
                    arr.push({
                        type: 'separator',
                    });
                    _____.var.proxy_list.slice(0, 50).forEach((p) => {
                        if (!p) {
                            return;
                        }
                        arr.push({
                            label: p.name || p.url,
                            sublabel: 'open use Proxy ( new Window / Ghost Profile )',
                            click() {
                                _____.ipc('[open new popup]', {
                                    show: true,
                                    url: document.location.href,
                                    proxy: p,
                                    partition: 'x-ghost_' + new Date().getTime(),
                                    iframe: true,
                                    center: true,
                                    alwaysOnTop: true,
                                });
                            },
                        });
                    });

                    if (arr.length > 0) {
                        _____.menuList.push({
                            label: 'Proxy Menu Options',
                            type: 'submenu',
                            iconURL: 'http://127.0.0.1:60080/images/proxy.png',
                            submenu: arr,
                        });
                    }
                }

                if (_____.var.blocking.context_menu.page_options) {
                    get_options_menu(node);
                }
                getCustomSettingMenu();
                if (_____.var.blocking.context_menu.inspect && _____.customSetting.allowDevTools) {
                    _____.menuList.push({
                        type: 'separator',
                    });

                    _____.menuList.push({
                        label: 'Inspect Element',
                        iconURL: 'http://127.0.0.1:60080/images/dev.png',
                        click() {
                            _____.webContents.inspectElement(_____.rightClickPosition.x2, _____.rightClickPosition.y2);
                            if (_____.webContents.isDevToolsOpened()) {
                                _____.webContents.devToolsWebContents.focus();
                            }
                        },
                    });
                }

                if (_____.var.blocking.context_menu.dev_tools && _____.customSetting.allowDevTools) {
                    _____.menuList.push({
                        label: 'Developer Tools',
                        iconURL: 'http://127.0.0.1:60080/images/dev.png',
                        accelerator: 'F12',
                        click() {
                            _____.webContents.openDevTools();
                        },
                    });
                }

                if (_____.var.core.id.like('*developer*')) {
                    createDevelopmentMenu();
                }
            } else {
                if (node.classList.contains('social-tab') && !node.classList.contains('plus')) {
                    let currentTab = _____.getCurrentTabInfo();
                    let url = currentTab.url;
                    let partition = currentTab.partition;
                    let user_name = currentTab.user_name;
                    let browserAppProcessID = currentTab.browserAppProcessID;

                    _____.menuList.push({
                        label: 'New tab',
                        iconURL: 'http://127.0.0.1:60080/images/link.png',
                        click() {
                            _____.ipc('[open new tab]', { mainWindowID: _____.window.id });
                        },
                    });
                    _____.menuList.push({
                        label: 'Duplicate tab',
                        iconURL: 'http://127.0.0.1:60080/images/duplicate.png',
                        click() {
                            _____.ipc('[open new tab]', { url: url, partition: partition, user_name: user_name, mainWindowID: _____.window.id });
                        },
                    });
                    _____.menuList.push({
                        type: 'separator',
                    });

                    _____.menuList.push({
                        label: 'Hide tab',
                        iconURL: 'http://127.0.0.1:60080/images/stop.png',
                        click() {
                            node.classList.add('display-none');
                            browserTabs.layoutTabs();
                        },
                    });
                    _____.menuList.push({
                        label: '==> Hide other tabs',
                        iconURL: 'http://127.0.0.1:60080/images/stop.png',
                        click() {
                            document.querySelectorAll('.social-tab:not(.plus)').forEach((el) => {
                                if (el.id !== node.id) {
                                    el.classList.add('display-none');
                                }
                            });
                            browserTabs.layoutTabs();
                        },
                    });
                    _____.menuList.push({
                        label: '==> Show hidden tabs',
                        iconURL: 'http://127.0.0.1:60080/images/allow.png',
                        click() {
                            document.querySelectorAll('.social-tab').forEach((t) => {
                                t.classList.remove('display-none');
                            });
                            browserTabs.layoutTabs();
                        },
                    });
                    _____.menuList.push({
                        type: 'separator',
                    });
                    _____.menuList.push({
                        label: 'New Ghost tab',
                        iconURL: 'http://127.0.0.1:60080/images/link.png',
                        click() {
                            let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                            _____.ipc('[open new tab]', { url: _____.var.core.newTabURL, partition: ghost, iframe: true, user_name: ghost, mainWindowID: _____.window.id });
                        },
                    });
                    _____.menuList.push({
                        label: 'Duplicate tab in Ghost tab',
                        iconURL: 'http://127.0.0.1:60080/images/duplicate.png',
                        click() {
                            let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                            _____.ipc('[open new tab]', { url: url, partition: ghost, user_name: ghost, mainWindowID: _____.window.id });
                        },
                    });
                    _____.menuList.push({
                        type: 'separator',
                    });

                    _____.menuList.push({
                        label: 'Duplicate tab in window',
                        iconURL: 'http://127.0.0.1:60080/images/duplicate.png',
                        click() {
                            _____.ipc('[open new popup]', {
                                browserAppProcessID: browserAppProcessID,
                                show: true,
                                center: true,
                                url: url,
                                partition: partition,
                                user_name: user_name,
                                mainWindowID: _____.window.id,
                            });
                        },
                    });
                    _____.menuList.push({
                        label: 'Duplicate tab in Ghost window',
                        iconURL: 'http://127.0.0.1:60080/images/duplicate.png',
                        click() {
                            let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                            _____.ipc('[open new popup]', {
                                browserAppProcessID: browserAppProcessID,
                                show: true,
                                center: true,
                                url: url,
                                partition: ghost,
                                user_name: ghost,
                                defaultUserAgent: _____.getRandomBrowser('pc'),
                                vpc: _____.generateVPC('pc'),
                                mainWindowID: _____.window.id,
                            });
                        },
                    });
                    _____.menuList.push({
                        type: 'separator',
                    });
                    _____.menuList.push({
                        label: 'Close',
                        iconURL: 'http://127.0.0.1:60080/images/close.png',
                        click() {
                            client.call('remove-tab', node);
                        },
                    });
                    _____.menuList.push({
                        label: 'Close other tabs',
                        iconURL: 'http://127.0.0.1:60080/images/close.png',
                        click() {
                            document.querySelectorAll('.social-tab').forEach((node2) => {
                                if (!node2.classList.contains('plus') && node.id !== node2.id) {
                                    client.call('remove-tab', node2);
                                }
                            });
                        },
                    });

                    if (_____.var.core.id.contains('developer')) {
                        _____.menuList.push({
                            type: 'separator',
                        });

                        _____.menuList.push({
                            label: 'Inspect Element',
                            iconURL: 'http://127.0.0.1:60080/images/dev.png',
                            click() {
                                _____.webContents.inspectElement(_____.rightClickPosition.x2, _____.rightClickPosition.y2);
                                if (_____.webContents.isDevToolsOpened()) {
                                    _____.webContents.devToolsWebContents.focus();
                                }
                            },
                        });

                        _____.menuList.push({
                            label: 'Developer Tools',
                            iconURL: 'http://127.0.0.1:60080/images/dev.png',
                            accelerator: 'F12',
                            click() {
                                _____.webContents.openDevTools();
                            },
                        });

                        _____.menuList.push({
                            label: 'Exist Social Browser',
                            click() {
                                _____.ws({ type: '[close]' });
                            },
                        });
                    }
                }
            }

            return;
        }

        _____.showMenu = function (menuList) {
            _____.menuList = menuList;
            _____.ipc('[show-menu]', {
                list: _____.menuList?.map((m) => ({
                    label: m.label,
                    sublabel: m.sublabel,
                    visible: m.visible,
                    type: m.type,
                    checked: m.checked,
                    iconURL: m.iconURL,
                    submenu: m.submenu?.map((m2) => ({
                        label: m2.label,
                        type: m2.type,
                        checked: m2.checked,
                        sublabel: m2.sublabel,
                        visible: m2.visible,
                        iconURL: m2.iconURL,
                        submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, checked: m3.checked, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
                    })),
                })),
            });
        };

        _____.contextmenu = function (e) {
            if (_____.contextmenuBusy) {
                return false;
            }
            _____.contextmenuBusy = true;
            setTimeout(() => {
                _____.contextmenuBusy = false;
            }, 200);

            if (
                !_____.rightClickPosition ||
                !_____.rightClickPosition.x ||
                !_____.rightClickPosition.y ||
                !Number.isFinite(_____.rightClickPosition.x) ||
                !Number.isFinite(_____.rightClickPosition.y)
            ) {
                return false;
            }
            try {
                e = e || { x: 0, y: 0 };
                _____.memoryText = () => _____.readCopy();
                _____.selectedText = () => (getSelection() || '').toString().trim();
                _____.selectedURL = null;

                _____.menuList = [];

                let node = document.elementFromPoint(_____.rightClickPosition.x, _____.rightClickPosition.y);

                if (_____.selectedText()) {
                    if (_____.isValidURL(_____.selectedText())) {
                        let arr = get_url_menu_list(_____.selectedText());
                        _____.menuList.push({
                            label: `Open link [ ${_____.selectedText().substring(0, 70)} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/link.png',
                            type: 'submenu',
                            submenu: arr,
                        });

                        _____.menuList.push({ type: 'separator' });
                    }

                    let faMatch = _____.selectedText().match(/\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}/);
                    if (faMatch) {
                        let code = faMatch[0].replaceAll(' ', '');
                        _____.menuList.push({
                            label: `Save as 2FA Code : [ ${code} ] `,
                            click() {
                                _____.add2faCode(code);
                                _____.fetchJson({ url: 'https://2fa.live/tok/' + code }).then((data) => {
                                    if (data && data.token) {
                                        _____.copy(data.token);
                                        _____.alert('Saved as 2FA Code & Copy New Token : ' + data.token);
                                    } else {
                                        _____.alert('Saved But : Error While Checking Token');
                                        _____.log(data);
                                    }
                                });
                            },
                        });
                        _____.menuList.push({
                            label: `Get 2FA Code : [ ${code} ] `,
                            click() {
                                _____.fetchJson({
                                    url: 'https://2fa.live/tok/' + code,
                                }).then((data) => {
                                    if (data && data.token) {
                                        _____.alert('New Token : ' + data.token);
                                    } else {
                                        _____.alert('Error While Checking Token');
                                        _____.log(data);
                                    }
                                });
                            },
                        });

                        _____.menuList.push({ type: 'separator' });
                    }

                    let stext = _____.selectedText().substring(0, 70);
                    _____.menuList.push({
                        label: 'Cut',
                        click() {
                            _____.webContents.cut();
                        },
                    });

                    _____.menuList.push({
                        label: `Copy`,
                        click() {
                            _____.copy(_____.selectedText());
                        },
                    });
                    _____.menuList.push({
                        label: 'Paste',
                        click() {
                            _____.webContents.paste();
                        },
                    });
                    _____.menuList.push({
                        label: 'Delete',
                        click() {
                            _____.webContents.delete();
                        },
                    });
                    _____.menuList.push({
                        label: `Translate [ ${stext} ] `,
                        iconURL: 'http://127.0.0.1:60080/images/translate.png',
                        click() {
                            _____.ipc('[open new popup]', {
                                partition: _____.partition,
                                show: true,
                                center: true,
                                url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(_____.selectedText()),
                            });
                        },
                    });

                    _____.menuList.push({
                        label: `Search  [ ${stext} ] `,
                        iconURL: 'http://127.0.0.1:60080/images/search.png',
                        click() {
                            _____.ipc('[open new tab]', {
                                referrer: document.location.href,
                                url: 'https://www.google.com/search?q=' + encodeURIComponent(_____.selectedText()),
                                windowID: _____.window.id,
                            });
                        },
                    });

                    _____.menuList.push({
                        type: 'separator',
                    });

                    if (_____.var.core.flags.like('*v2*')) {
                        if (_____.selectedText().startsWith('_') && _____.selectedText().endsWith('_')) {
                            if (_____.selectedText().startsWith('_PUBLIC_')) {
                                _____.menuList.push({
                                    label: 'Decrypt By [ Public Key ]',
                                    click() {
                                        _____.decryptedText = _____.decryptText(_____.selectedText().replace('_PUBLIC_', '').replace('_', ''));
                                        _____.replaceSelectedText(_____.decryptedText);
                                    },
                                });
                            } else if (_____.selectedText().startsWith('_SITE_')) {
                                _____.menuList.push({
                                    label: 'Decrypt By [ Site Key ]',
                                    click() {
                                        _____.decryptedText = _____.decryptText(_____.selectedText().replace('_SITE_', '').replace('_', ''), _____.domain);
                                        _____.replaceSelectedText(_____.decryptedText);
                                    },
                                });
                            } else if (_____.selectedText().startsWith('_PRIVATE_')) {
                                _____.menuList.push({
                                    label: 'Decrypt By [ Private Key ]',
                                    click() {
                                        _____.decryptedText = _____.decryptText(_____.selectedText().replace('_PRIVATE_', '').replace('_', ''), _____.md5(_____.var.core.id));
                                        _____.replaceSelectedText(_____.decryptedText);
                                    },
                                });
                                if (_____.var.privateKeyList.length > 0) {
                                    _____.menuList.push({
                                        type: 'separator',
                                    });
                                    let arr = [];
                                    _____.var.privateKeyList.forEach((info) => {
                                        arr.push({
                                            label: ' [ Key : ' + (info.name || info.key) + ' ]',
                                            click() {
                                                _____.decryptedText = _____.decryptText(_____.selectedText().replace('_PRIVATE_', '').replace('_', ''), info.key);
                                                _____.replaceSelectedText(_____.decryptedText);
                                            },
                                        });
                                    });
                                    if (arr.length > 0) {
                                        _____.menuList.push({
                                            label: 'Decrypt By',
                                            type: 'submenu',
                                            submenu: arr,
                                        });
                                    }
                                }
                            } else if (_____.selectedText().startsWith('_KEY_')) {
                                _____.menuList.push({
                                    label: 'Add To Private Key List',
                                    click() {
                                        _____.var.privateKeyList = _____.var.privateKeyList || [];
                                        let key = _____.selectedText().replace('_KEY_', '').replace('_', '');
                                        if (!_____.var.privateKeyList.some((info) => info.key === key)) {
                                            _____.var.privateKeyList.push({ name: key, key: key });
                                            _____.updateBrowserVar('privateKeyList', _____.var.privateKeyList);

                                            _____.alert('Private Key Added To Private Key List');
                                        } else {
                                            _____.alert('Private Key Exists');
                                        }
                                    },
                                });
                            }
                        } else {
                            let arr = [];
                            arr.push({
                                label: 'Encrypt By [ Public Key ]',
                                click() {
                                    _____.encryptedText = _____.encryptText(_____.selectedText());
                                    if (_____.encryptedText) {
                                        _____.encryptedText = '_PUBLIC_' + _____.encryptedText + '_';
                                        _____.replaceSelectedText(_____.encryptedText);
                                    }
                                },
                            });
                            arr.push({
                                label: 'Encrypt By [ Site Key ]',
                                click() {
                                    _____.encryptedText = _____.encryptText(_____.selectedText(), _____.domain);
                                    if (_____.encryptedText) {
                                        _____.encryptedText = '_SITE_' + _____.encryptedText + '_';
                                        _____.replaceSelectedText(_____.encryptedText);
                                    }
                                },
                            });
                            arr.push({
                                label: 'Encrypt By [ Private Key ]',
                                click() {
                                    _____.encryptedText = _____.encryptText(_____.selectedText(), _____.md5(_____.var.core.id));
                                    if (_____.encryptedText) {
                                        _____.encryptedText = '_PRIVATE_' + _____.encryptedText + '_';
                                        _____.replaceSelectedText(_____.encryptedText);
                                    }
                                },
                            });
                            if (_____.var.privateKeyList.length > 0) {
                                arr.push({
                                    type: 'separator',
                                });

                                _____.var.privateKeyList.forEach((info) => {
                                    arr.push({
                                        label: ' [ Key : ' + (info.name || info.key) + ' ]',
                                        click() {
                                            _____.encryptedText = _____.encryptText(_____.selectedText(), info.key);
                                            if (_____.encryptedText) {
                                                _____.encryptedText = '_PRIVATE_' + _____.encryptedText + '_';
                                                _____.replaceSelectedText(_____.encryptedText);
                                            }
                                        },
                                    });
                                });
                            }
                            if (arr.length > 0) {
                                _____.menuList.push({
                                    label: 'Encrypt By',
                                    type: 'submenu',
                                    submenu: arr,
                                });
                            }
                        }

                        _____.menuList.push({
                            type: 'separator',
                        });
                    }
                } else {
                    if (!node || !!node.oncontextmenu) {
                        return null;
                    }

                    if (!_____.customSetting.allowMenu) {
                        add_input_menu(node);
                    } else {
                        createMenuList(node);
                    }
                }
                if (!_____.customSetting.windowType.contain('main|address|profile')) {
                    getEmailMenu();
                    get2faMenu();
                    if ((_____.scriptsMenuTRUE = true)) {
                        let arr = [];

                        let scriptList = _____.var.scriptList.filter(
                            (s) => s.show && !document.location.href.like('*127.0.0.1:60080*|*file://*') && document.location.href.like(s.allowURLs) && !document.location.href.like(s.blockURLs),
                        );

                        arr.push({
                            label: 'Translate this page',
                            iconURL: 'http://127.0.0.1:60080/images/code.png',
                            click: () => {
                                _____.ipc('[window-action]', { name: 'translate' });
                            },
                        });
                        arr.push({
                            label: 'Edit Page Content',
                            iconURL: 'http://127.0.0.1:60080/images/code.png',
                            click: () => {
                                _____.ipc('[toggle-window-edit]');
                            },
                        });
                        arr.push({
                            label: 'Hide / Show - Page Images',
                            iconURL: 'http://127.0.0.1:60080/images/code.png',
                            click: () => {
                                _____.ipc('[window-action]', { name: 'toggle-page-images' });
                            },
                        });
                        arr.push({
                            label: 'Hide / Show - Page Content',
                            iconURL: 'http://127.0.0.1:60080/images/code.png',
                            click: () => {
                                _____.ipc('[window-action]', { name: 'toggle-page-content' });
                            },
                        });

                        if (scriptList.length > 0) {
                            arr.push({
                                type: 'separator',
                            });
                            scriptList.forEach((script) => {
                                arr.push({
                                    label: script.title,
                                    iconURL: 'http://127.0.0.1:60080/images/code.png',
                                    click: () => {
                                        _____.ipc('[run-user-script]', { windowID: _____.window.id, script: script });
                                    },
                                });
                            });
                        }
                        _____.menuList.push({ type: 'separator' });
                        _____.menuList.push({
                            label: 'User Scripts',
                            iconURL: 'http://127.0.0.1:60080/images/code.png',
                            type: 'submenu',
                            submenu: arr,
                        });
                    }
                }

                if (_____.menuList.length > 0) {
                    _____.showMenu(_____.menuList);
                }
            } catch (error) {
                _____.log(error);
            }
        };

        if (_____.isIframe()) {
            window.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                if (_____.webContents.isDevToolsOpened()) {
                    return;
                }

                let factor = _____.webContents.zoomFactor || 1;

                if (e.x) {
                    _____.rightClickPosition = {
                        y: Math.round(e.y / factor),
                        x2: Math.round(e.x),
                        y2: Math.round(e.y),
                    };
                }
                _____.contextmenu(e);
            });
        } else {
            _____.on('context-menu', (e, data) => {
                let factor = _____.webContents.zoomFactor || 1;
                if (data.x) {
                    _____.rightClickPosition = {
                        x: Math.round(data.x / factor),
                        y: Math.round(data.y / factor),
                        x2: Math.round(data.x),
                        y2: Math.round(data.y),
                    };
                }

                _____.contextmenu(data);
            });
        }

        window.addEventListener('mouseup', (e) => {
            if (_____.webContents.isDevToolsOpened()) {
                return;
            }
            if (e.target.tagName.like('video')) {
                return;
            }
            let rightclick;
            if (!e) var e = window.event;
            if (e.which) {
                rightclick = e.which == 3;
            } else if (e.button) {
                rightclick = e.button == 2;
            }
            if (rightclick) {
                let factor = _____.webContents.zoomFactor || 1;
                _____.rightClickPosition = {
                    x: Math.round(e.clientX),
                    y: Math.round(e.clientY),
                    x2: Math.round(e.clientX * factor),
                    y2: Math.round(e.clientY * factor),
                };
                _____.contextmenu(e);
            }
        });

        _____.on('[run-menu]', (e, data) => {
            if (_____.menuList.length == 0) {
                return;
            }
            if (typeof data.index !== 'undefined' && typeof data.index2 !== 'undefined' && typeof data.index3 !== 'undefined') {
                let m = _____.menuList[data.index];
                if (m && m.submenu) {
                    let m2 = m.submenu[data.index2];
                    if (m2 && m2.submenu) {
                        let m3 = m2.submenu[data.index3];
                        m3.click();
                    }
                }
            } else if (typeof data.index !== 'undefined' && typeof data.index2 !== 'undefined') {
                let m = _____.menuList[data.index];
                if (m && m.submenu) {
                    let m2 = m.submenu[data.index2];
                    if (m2) {
                        m2.click();
                    }
                }
            } else if (typeof data.index !== 'undefined') {
                let m = _____.menuList[data.index];
                if (m && m.click) {
                    m.click();
                }
            }
            _____.menuList = [];
        });
    }
})();


    (function loadCloudflare() {
        if (_____.javaScriptOFF) {
            return;
        }
        if (document.location.href.like('*://challenges.cloudflare.com/*')) {
            _____.sendMessage({ name: '[captcha-detected]' });
            _____.customSetting.$cloudFlare = true;
            if (_____.var.blocking.javascript.cloudflareON) {
                if (document.location.href.like('*://challenges.cloudflare.com/*')) {
                    _____.sendMessage({ name: '[cloudflare-detected]' });

                    _____.onLoad(() => {
                        async function ShadowFinder() {
                            const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                            const delay = async (milliseconds) => await new Promise((resolve) => setTimeout(resolve, milliseconds));
                            const randomInteger = (n, r) => {
                                return Math.floor(Math.random() * (r - n + 1)) + n;
                            };
                            const simulateMouseClick = (element, box, clientX = null, clientY = null) => {
                                return _____.click(element);
                                box = element.getBoundingClientRect();

                                clientX = randomInteger(box.left, box.left + box.width);
                                clientY = randomInteger(box.top, box.top + box.height);

                                eventNames.forEach((eventName) => {
                                    const event = new MouseEvent(eventName, {
                                        detail: eventName === 'mouseover' ? 0 : 1,
                                        view: window,
                                        bubbles: true,
                                        cancelable: true,
                                        clientX: clientX,
                                        clientY: clientY,
                                    });
                                    element.dispatchEvent(event);
                                });
                            };

                            async function Click2(shadowRoot) {
                                if (shadowRoot.querySelector('div[style*="display: grid"] > div > label')) {
                                    const element = shadowRoot.querySelector('div[style*="display: grid"] > div input');

                                    if (element) {
                                        if (element.getAttribute('aria-checked') !== null) {
                                        } else {
                                            simulateMouseClick(element);
                                        }
                                    }
                                }
                                await delay(randomInteger(200, 4000));
                                Click2(shadowRoot);
                            }

                            const originalAttachShadow = Element.prototype.attachShadow;
                            Element.prototype.attachShadow = function (init) {
                                let shadowRoot = originalAttachShadow.call(this, init);
                                window.parent !== window && shadowRoot ? Click2(shadowRoot) : undefined;
                                return shadowRoot;
                            };
                        }
                        ShadowFinder();
                        // const attachShadowReplacement = '(' + ShadowFinder.toString().replace('ShadowFinder', '') + ')();';
                        // _____.eval(attachShadowReplacement);
                    });
                }
            }
        }
    })();

    (function loadGoogleCapatch() {
        if (_____.javaScriptOFF) {
            return;
        }

        window.addEventListener('urlchange', () => {
            _____.log('location changed from event : ' + document.location.href);
        });

        if (document.location.href.like('*://*/recaptcha/*')) {
            _____.sendMessage({ name: '[recaptcha-detected]' });

            if (_____.var.blocking.javascript.googleCaptchaON) {
                _____.onLoad(() => {
                    (function () {
                        function qSelectorAll(selector) {
                            return document.querySelectorAll(selector);
                        }

                        function qSelector(selector) {
                            return document.querySelector(selector);
                        }

                        let solved = false;
                        let checkBoxClicked = false;
                        let waitingForAudioResponse = false;

                        const CHECK_BOX = '.recaptcha-checkbox-border';
                        const AUDIO_BUTTON = '#recaptcha-audio-button';
                        const PLAY_BUTTON = '.rc-audiochallenge-play-button .rc-button-default';
                        const AUDIO_SOURCE = '#audio-source';
                        const IMAGE_SELECT = '#rc-imageselect';
                        const RESPONSE_FIELD = '.rc-audiochallenge-response-field';
                        const AUDIO_ERROR_MESSAGE = '.rc-audiochallenge-error-message';
                        const AUDIO_RESPONSE = '#audio-response';
                        const RELOAD_BUTTON = '#recaptcha-reload-button';
                        const RECAPTCHA_STATUS = '#recaptcha-accessible-status';
                        const DOSCAPTCHA = '.rc-doscaptcha-body';
                        const VERIFY_BUTTON = '#recaptcha-verify-button';
                        const MAX_ATTEMPTS = 5;
                        let requestCount = 0;
                        let recaptchaLanguage = qSelector('html').getAttribute('lang');
                        let audioUrl = '';
                        let recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : '';
                        let serversList = [
                            _____.from123('431932754619268325738657455847524278377641538271483932614578825245595779431837734234825445787591'),
                            _____.from123('431932754619268325738657455847524278377641541668461957754318866841388282477852574658366841788667'),
                        ];
                        let latencyList = Array(serversList.length).fill(10000);

                        function isHidden(el) {
                            return el.offsetParent === null;
                        }

                        async function getTextFromAudio(URL) {
                            let minLatency = 100000;
                            let url = '';

                            for (let k = 0; k < latencyList.length; k++) {
                                if (latencyList[k] <= minLatency) {
                                    minLatency = latencyList[k];
                                    url = serversList[k];
                                }
                            }

                            requestCount = requestCount + 1;
                            URL = URL.replace('recaptcha.net', 'google.com');
                            if (recaptchaLanguage.length < 1) {
                                _____.log('Recaptcha Language is not recognized');
                                recaptchaLanguage = 'en-US';
                            }

                            _____.log('Recaptcha Language is ' + recaptchaLanguage);

                            _____.fetch({
                                method: 'POST',
                                url: url,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                data: 'input=' + encodeURIComponent(URL) + '&lang=' + recaptchaLanguage,
                                timeout: 60000,
                                onload: function (response) {
                                    _____.log('Response::' + response.responseText);
                                    try {
                                        if (response && response.responseText) {
                                            var responseText = response.responseText;
                                            if (responseText == '0' || responseText.includes('<') || responseText.includes('>') || responseText.length < 2 || responseText.length > 50) {
                                                _____.log('Invalid Response. Retrying..');
                                            } else if (
                                                qSelector(AUDIO_SOURCE) &&
                                                qSelector(AUDIO_SOURCE).src &&
                                                audioUrl == qSelector(AUDIO_SOURCE).src &&
                                                qSelector(AUDIO_RESPONSE) &&
                                                !qSelector(AUDIO_RESPONSE).value &&
                                                qSelector(AUDIO_BUTTON).style.display == 'none' &&
                                                qSelector(VERIFY_BUTTON)
                                            ) {
                                                qSelector(AUDIO_RESPONSE).value = responseText;
                                                qSelector(VERIFY_BUTTON).click();
                                            } else {
                                                _____.log('Could not locate text input box');
                                            }
                                            waitingForAudioResponse = false;
                                        }
                                    } catch (err) {
                                        _____.log(err.message);
                                        _____.log('Exception handling response. Retrying..');
                                        waitingForAudioResponse = false;
                                    }
                                },
                                onerror: function (e) {
                                    _____.log(e);
                                    waitingForAudioResponse = false;
                                },
                                ontimeout: function () {
                                    _____.log('Response Timed out. Retrying..');
                                    waitingForAudioResponse = false;
                                },
                            });
                        }

                        async function pingTest(url) {
                            var start = new Date().getTime();
                            _____.fetch({
                                method: 'GET',
                                url: url,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                data: '',
                                timeout: 8000,
                                onload: function (response) {
                                    if (response && response.responseText && response.responseText == '0') {
                                        var end = new Date().getTime();
                                        var milliseconds = end - start;

                                        for (let i = 0; i < serversList.length; i++) {
                                            if (url == serversList[i]) {
                                                latencyList[i] = milliseconds;
                                            }
                                        }
                                    }
                                },
                                onerror: function (e) {
                                    _____.log(e);
                                },
                                ontimeout: function () {
                                    _____.log('Ping Test Response Timed out for ' + url);
                                },
                            });
                        }

                        if (qSelector(CHECK_BOX)) {
                            qSelector(CHECK_BOX).click();
                        } else if (window.location.href.includes('bframe')) {
                            for (let i = 0; i < serversList.length; i++) {
                                pingTest(serversList[i]);
                            }
                        }

                        let startInterval = setInterval(function () {
                            try {
                                if (!checkBoxClicked && qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
                                    qSelector(CHECK_BOX).click();
                                    checkBoxClicked = true;
                                }
                                if (qSelector(RECAPTCHA_STATUS) && qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus) {
                                    solved = true;
                                    _____.log('SOLVED');
                                    clearInterval(startInterval);
                                }
                                if (requestCount > MAX_ATTEMPTS) {
                                    _____.log('Attempted Max Retries. Stopping the solver');
                                    solved = true;
                                    clearInterval(startInterval);
                                }
                                if (!solved) {
                                    if (qSelector(AUDIO_BUTTON) && !isHidden(qSelector(AUDIO_BUTTON)) && qSelector(IMAGE_SELECT)) {
                                        qSelector(AUDIO_BUTTON).click();
                                    }
                                    if (
                                        (!waitingForAudioResponse &&
                                            qSelector(AUDIO_SOURCE) &&
                                            qSelector(AUDIO_SOURCE).src &&
                                            qSelector(AUDIO_SOURCE).src.length > 0 &&
                                            audioUrl == qSelector(AUDIO_SOURCE).src &&
                                            qSelector(RELOAD_BUTTON)) ||
                                        (qSelector(AUDIO_ERROR_MESSAGE) && qSelector(AUDIO_ERROR_MESSAGE).innerText.length > 0 && qSelector(RELOAD_BUTTON) && !qSelector(RELOAD_BUTTON).disabled)
                                    ) {
                                        qSelector(RELOAD_BUTTON).click();
                                    } else if (
                                        !waitingForAudioResponse &&
                                        qSelector(RESPONSE_FIELD) &&
                                        !isHidden(qSelector(RESPONSE_FIELD)) &&
                                        !qSelector(AUDIO_RESPONSE).value &&
                                        qSelector(AUDIO_SOURCE) &&
                                        qSelector(AUDIO_SOURCE).src &&
                                        qSelector(AUDIO_SOURCE).src.length > 0 &&
                                        audioUrl != qSelector(AUDIO_SOURCE).src &&
                                        requestCount <= MAX_ATTEMPTS
                                    ) {
                                        waitingForAudioResponse = true;
                                        audioUrl = qSelector(AUDIO_SOURCE).src;
                                        getTextFromAudio(audioUrl);
                                    } else {
                                    }
                                }
                                if (qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
                                    _____.log('Automated Queries Detected');
                                    clearInterval(startInterval);
                                }
                            } catch (err) {
                                _____.log(err.message);
                                _____.log('An error occurred while solving. Stopping the solver.');
                                clearInterval(startInterval);
                            }
                        }, 5000);
                    })();
                });
            }
        }
    })();

        (function loadKeyboard() {
        if (_____.javaScriptOFF) {
            return;
        }
        if (true) {
            let mousemove = null;

            window.addEventListener('mousemove', (e) => {
                mousemove = e;
            });

            if (_____.customSetting.windowType === 'main') {
                return;
            }

            function sendToMain(obj) {
                _____.ipc('[send-render-message]', obj);
            }

            window.addEventListener('wheel', function (e) {
                if (e.ctrlKey == true) {
                    sendToMain({
                        name: '[window-zoom' + (e.deltaY > 0 ? '-' : '+') + ']',
                        windowID: _____.window.id,
                    });
                }
            });

            window.addEventListener(
                'keydown',
                (e) => {
                    //e.preventDefault();
                    //e.stopPropagation();
                    if (e.key == 'F12' /*f12*/ && _____.customSetting.allowDevTools && _____.customSetting.allowMenu) {
                        _____.ipc('[show-window-dev-tools]', {
                            windowID: _____.window.id,
                        });
                    } else if (e.key == 'F11' /*f11*/ && _____.customSetting.allowDevTools && _____.customSetting.allowMenu) {
                        sendToMain({
                            name: '[toggle-fullscreen]',
                            windowID: _____.window.id,
                        });
                    } else if (e.keyCode == 121 /*f10*/ && _____.customSetting.allowDevTools && _____.customSetting.allowMenu) {
                        sendToMain({
                            name: 'service worker',
                        });
                    } else if (e.keyCode == 117 /*f6*/) {
                        _____.ipc('[show-addressbar]');
                    } else if (e.keyCode == 70 /*f*/) {
                        if (e.ctrlKey == true) {
                            window.showFind(true);
                        }
                    } else if (e.keyCode == 115 /*f4*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: 'close tab',
                            });
                        }
                    } else if (e.keyCode == 107 /*+*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[window-zoom+]',
                                windowID: _____.window.id,
                            });
                        }
                    } else if (e.keyCode == 109 /*-*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[window-zoom-]',
                                windowID: _____.window.id,
                            });
                        }
                    } else if (e.keyCode == 48 /*0*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[window-zoom]',
                                windowID: _____.window.id,
                            });
                        }
                    } else if (e.keyCode == 49 /*1*/) {
                        if (e.ctrlKey == true) {
                            ipc('[window-action]', { name: 'toggle-window-audio' });
                        }
                    } else if (e.keyCode == 74 /*j*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: 'downloads',
                            });
                        }
                    } else if (e.keyCode == 83 /*s*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[download-link]',
                                url: window.location.href,
                            });
                        }
                    } else if (e.keyCode == 80 /*p*/) {
                        if (e.ctrlKey == true) {
                            window.print();
                        }
                    } else if (e.keyCode == 46 /*delete*/) {
                        if (e.ctrlKey == true && mousemove) {
                            let node = mousemove.target;
                            if (node) {
                                node.remove();
                            }
                        }
                    } else if (e.keyCode == 27 /*escape*/) {
                        sendToMain({
                            name: 'escape',
                        });
                    } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/) {
                        _____.ipc('[edit-window]', { windowID: _____.window.id });
                    } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*n*/) {
                        if (e.ctrlKey == true) {
                            _____.ipc('[open new tab]', {
                                windowID: _____.window.id,
                            });
                        }
                    } else if (e.keyCode == 116 /*f5*/) {
                        if (e.ctrlKey === true) {
                            sendToMain({
                                name: '[window-reload-hard]',
                                origin: document.location.origin || document.location.href,
                            });
                        } else {
                            sendToMain({
                                name: '[window-reload]',
                            });
                        }
                    }

                    return false;
                },
                true,
            );
        }
    })();
      (function loadDom() {
        if (true) {
            if (_____.javaScriptOFF || _____.customSetting.windowType === 'main' || document.location.href.like('*http://127.0.0.1*')) {
                _____.log('.... [ DOM Blocking OFF] .... ' + document.location.href);
                return;
            }

            function removeAdDoms() {
                let arr = _____.var.blocking.html_tags_selector_list;
                arr.forEach((sl) => {
                    if (window.location.href.like(sl.url) && !window.location.href.like(sl.ex_url || '')) {
                        document.querySelectorAll(sl.select).forEach((el) => {
                            _____.log('Remove Next DOM With Selector : ', sl.select, el);
                            if (sl.remove) {
                                el.remove();
                            } else if (sl.hide) {
                                el.style.display = 'none';
                            } else if (sl.empty) {
                                el.innerHTML = _____.policy.createHTML('');
                            }
                        });
                    }
                });

                setTimeout(() => {
                    removeAdDoms();
                }, 1000 * 3);
            }

            if (_____.var.blocking.core.block_html_tags) {
                _____.onload(() => {
                    removeAdDoms();
                });
            } else {
                _____.log('.... [ DOM Blocking OFF] .... ' + document.location.href);
            }
        }
    })();
        (function loadNodes() {
        if (true) {
            if (_____.javaScriptOFF) {
                return false;
            }
            _____.log('.... [ HTML Elements Script Activated ].... ' + document.location.href);

            _____.onLoad(() => {
                document.querySelectorAll('a,input,iframe').forEach((node) => {
                    if (node && node.tagName == 'A') {
                        a_handle(node);
                    } else if (node && node.tagName == 'INPUT') {
                        input_handle(node);
                    } else if (node && node.tagName == 'IFRAME') {
                        iframe_handle(node);
                    }
                });
            });

            _____.dataInputPost = {
                name: 'user_data',
                date: new Date().getTime(),
                id: _____.window.id + '_' + _____.partition + '_' + new Date().getTime(),
                partition: _____.partition,
                hostname: _____.domain,
                url: document.location.href,
                data: [],
            };

            function collectData() {
                if (!_____.customSetting.allowSaveUserData) {
                    return;
                }

                if (_____.customSetting.windowType === 'main' || document.location.href.like('*127.0.0.1:60080*|*browser://*')) {
                    return;
                }

                _____.dataInputPost.data = [];

                document.querySelectorAll('input , select , textarea , [contentEditable]').forEach((el, index) => {
                    if (el.tagName === 'INPUT') {
                        if (!el.value || el.type.contains('hidden|submit|range|checkbox|button|color|file|image|radio|reset|search|date|time')) {
                            return;
                        }

                        if (el.type.toLowerCase() === 'password') {
                            _____.dataInputPost.name = 'user_data_input';
                        }

                        _____.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value,
                            className: el.className,
                            type: el.type,
                        });
                    } else if (el.tagName === 'SELECT') {
                        if (!el.value) {
                            return;
                        }
                        _____.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value,
                            className: el.className,
                            type: el.type,
                        });
                    } else if (el.tagName === 'TEXTAREA') {
                        if (!el.value) {
                            return;
                        }
                        _____.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value,
                            className: el.className,
                            type: el.type,
                        });
                    } else {
                        _____.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value || el.innerText,
                            className: el.className,
                            type: el.type,
                        });
                    }
                });

                if (JSON.stringify(_____.dataInputPost) !== _____.dataInputPostString) {
                    _____.dataInputPostString = JSON.stringify(_____.dataInputPost);
                    _____.ipc(_____.dataInputPost.name, _____.dataInputPost);
                }

                setTimeout(() => {
                    collectData();
                }, 200);
            }

            collectData();

            function input_handle(input) {
                if (input.getAttribute('x-handled') == 'true' || (input.getAttribute('type') || '').like('*checkbox*|*radio*|*button*|*submit*|*hidden*')) {
                    return;
                }
                input.setAttribute('x-handled', 'true');
            }

            function a_handle(a) {
                if (
                    a.tagName == 'A' &&
                    !a.getAttribute('x-handled') &&
                    a.href &&
                    a.getAttribute('target') == '_blank' &&
                    _____.isValidURL(a.href) &&
                    !a.href.like('*youtube.com*') &&
                    !a.href.like('*#___new_tab___*|*#___new_popup___*|*#___trusted_window___*') &&
                    !a.getAttribute('onclick')
                ) {
                    a.setAttribute('x-handled', 'true');
                    a.addEventListener('click', (e) => {
                        if (a.getAttribute('target') == '_blank') {
                            e.preventDefault();
                            e.stopPropagation();

                            if (_____.customSetting.windowType == 'view') {
                                _____.ipc('[open new tab]', {
                                    referrer: document.location.href,
                                    url: a.href,
                                    partition: _____.partition,
                                    user_name: _____.session.display,
                                    mainWindowID: _____.window.id,
                                });
                            } else {
                                window.location.href = a.href;
                            }
                        }
                    });
                }
            }

            function iframe_handle(iframe) {
                if (iframe.getAttribute('x-handled') == 'true') {
                    return;
                }
                iframe.setAttribute('x-handled', 'true');

                if (!_____.isWhiteSite) {
                    if (_____.var.blocking.core.block_empty_iframe && (!iframe.src || iframe.src == 'about:')) {
                        _____.log('[[ Remove ]]', iframe);
                        iframe.remove();
                    } else if (_____.var.blocking.core.remove_external_iframe && !iframe.src.like(document.location.protocol + '//*' + _____.domain + '*')) {
                        _____.log('[[ Remove ]]', iframe);
                        iframe.remove();
                    } else if (iframe.tagName == 'IFRAME') {
                    }
                }
            }

            document.addEventListener('dblclick', (e) => {
                if (_____.var.blocking.javascript.auto_paste) {
                    _____.paste();
                }

                let a = e.target.tagName === 'A' ? e.target : e.target.closest('a');

                if (a && a.href) {
                    if (a.getAttribute('force-click')) {
                        _____.ipc('[open new tab]', {
                            url: a.href,
                            referrer: document.location.href,
                            partition: _____.partition,
                            user_name: _____.session.display,
                            windowID: _____.window.id,
                        });
                    } else {
                        a.setAttribute('force-click', new Date().getTime().toString());
                    }
                }

                if (
                    !a &&
                    _____.var.blocking.javascript.removeTagONdblclick &&
                    _____.customSetting.windowType !== 'main' &&
                    !e.target.tagName.contains('body|input|video|embed|progress') &&
                    !e.target.className.contains('progress')
                ) {
                    e.target.remove();
                }
            });
        }
    })();
       (function loadSafty() {
        if (true) {
            if (
                _____.javaScriptOFF ||
                !_____.var.blocking.allow_safty_mode ||
                _____.isWhiteSite ||
                document.location.href.like('http://localhost*|https://localhost*|http://127.0.0.1*|https://127.0.0.1*|browser://*|chrome://*')
            ) {
                _____.log(' [Safty] OFF : ' + document.location.href);
                return;
            }

            _____.log(' >>> Safty Activated');

            let translated = false;
            let translated_text = '';

            let translate = function (text) {
                if (translated || !text) {
                    return;
                }

                translated = true;
                _____.translate(text, (info) => {
                    translated_text += info.translatedText;
                    check_unsafe_words();
                });
            };

            let check_unsafe_words_busy = false;
            function check_unsafe_words() {
                if (check_unsafe_words_busy) {
                    return;
                }

                _____.var.blocking.un_safe_words_list = _____.var.blocking.un_safe_words_list || [];
                if (_____.var.blocking.un_safe_words_list.length === 0) {
                    return;
                }
                check_unsafe_words_busy = true;
                let text = '';
                let title = document.querySelector('title');
                let body = document.querySelector('body');

                if (title && title.innerText) {
                    translate(title.innerText);
                    text += title.innerText + ' ' + document.location.href + ' ';
                }
                if (body) {
                    text += body.innerText + ' ';
                }

                text += translated_text;

                let block = false;

                _____.var.blocking.un_safe_words_list.forEach((word) => {
                    if (text.contains(word.text)) {
                        block = true;
                    }
                });

                window.__blockPage(block, 'Block Page [ Contains Unsafe Words ] , <p> <a target="_blank" href="http://127.0.0.1:60080/setting?open=safty"> goto setting </a></p>', false);

                check_unsafe_words_busy = false;

                setTimeout(() => {
                    check_unsafe_words();
                }, 1000 * 5);
            }

            _____.onLoad(() => {
                check_unsafe_words();
            });
        }
    })();
    (function loadAdsManager() {
    if (true) {
        if (
            _____.isWhiteSite ||
            _____.javaScriptOFF ||
            !_____.var.blocking.block_ads ||
            _____.customSetting.windowType === 'main' ||
            document.location.hostname.contain('localhost|127.0.0.1|browser')
        ) {
            _____.log('.... [ Ads Manager OFF ] .... ' + document.location.href);
            return;
        }
        _____.log('.... [ Ads Manager Activated ] .... ' + document.location.href);

    }
})();

(function loadSkipVideoAds() {
    if (_____.javaScriptOFF) {
        return;
    }
    _____.log('.... [ Skip Video Ads activated ] .... ' + document.location.href);
    _____.skipButtonSelector = '.ytp-skip-ad-button,.skip_button,#skip_button_bravoplayer,.videoad-skip,.skippable,.xplayer-ads-block__skip,.ytp-ad-skip-button,.ytp-ad-overlay-close-container';
    let adsProgressSelector = '.ad-interrupting .ytp-play-progress.ytp-swatch-background-color';

    function skipVideoAds() {
        let videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            document.querySelectorAll(_____.skipButtonSelector).forEach((b) => {
                _____.click(b, false, false, false);
                _____.log('<b>Ads Video Detected</b><p><i> Skip Button </i></p>', 1000);
            });
        }
        setTimeout(() => {
            skipVideoAds();
        }, 1000 * 1);
    }

    function skipYoutubeAds() {
        let videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            document.querySelectorAll(_____.skipButtonSelector).forEach((b) => {
                _____.click(b, false, false, false);
                //  _____.log('<b>Ads Youtube Video Detected</b><p><i> Try Skip it </i></p>', b);
            });

            // if (document.querySelector(adsProgressSelector)) {
            //     videos.forEach((v) => {
            //         if (v && !v.ended && v.readyState > 2) {
            //             v.currentTime = parseFloat(v.duration);
            //             alert('Ads Video Detected', 2000);
            //         }
            //     });
            // }
        }
        setTimeout(() => {
            skipYoutubeAds();
        }, 1000 * 1);
    }

    _____.onLoad(() => {
        if (_____.var.blocking.core.skip_video_ads) {
            if (_____.domain.like('*youtube.com*')) {
                skipYoutubeAds();
            } else {
                skipVideoAds();
            }
        }
    });
})();


    (function loadMainMoudles() {
        let s1 = window.alert.toString();
        let s2 = window.confirm.toString();
        let s3 = window.prompt.toString();

        _____.__setConstValue(window, 'alert', _____.alert);
        _____.__setConstValue(window, 'confirm', _____.confirm);
        _____.__setConstValue(window, 'prompt', _____.prompt);

        _____.__toString(window.alert, s1);
        _____.__toString(window.confirm, s2);
        _____.__toString(window.prompt, s3);

        if (_____.customSetting.parentWindowID) {
            window.opener = window.opener || Object.create(Window.prototype);
            Object.assign(window.opener, {
                closed: false,
                opener: window,
                innerHeight: 1028,
                innerWidth: 720,

                postMessage: (data, origin, transfer) => {
                    _____.log('window.opener.postMessage', data);
                    _____.ipc(
                        'window.message',
                        {
                            windowID: _____.customSetting.parentWindowID,
                            toParentFrame: _____.customSetting.parentFrame,
                            data: data,
                            origin: origin || '*',
                            transfer: transfer,
                        },
                        true,
                    );
                },
                eval: function () {},
                close: function () {},
                focus: function () {},
                blur: function () {},
                print: function () {},
                document: {
                    write: function () {},
                    open: function () {},
                    close: function () {},
                },
                location: {
                    href: _____.ipcSync(
                        '[window.actions]',
                        {
                            windowID: _____.customSetting.parentWindowID,
                            action: 'location.href',
                        },
                        true,
                    ),
                    replace: function (url) {
                        _____.ipcSync(
                            '[window.actions]',
                            {
                                windowID: _____.customSetting.parentWindowID,
                                action: 'location.replace',
                                url: url,
                            },
                            true,
                        );
                    },
                },
                self: window.opener,
                window: window.opener,
            });

            // window.opener = window.opener || {
            //     closed: false,
            //     postMessage: (data, origin, transfer) => {
            //         _____.log('window.opener.postMessage', data);
            //         _____.ipc(
            //             'window.message',
            //             {
            //                 windowID: _____.customSetting.parentWindowID,
            //                 toParentFrame: _____.customSetting.parentFrame,
            //                 data: data,
            //                 origin: origin || '*',
            //                 transfer: transfer,
            //             },
            //             true,
            //         );
            //     },
            // };
        }

        if (!_____.isWhiteSite && !_____.javaScriptOFF) {
            (function loadWindow() {
                if (!_____.isWhiteSite) {
                    if ((_____.openTRUE = true)) {
                        const originalwindowOpen = window.open;
                        let s = window.open.toString();
                        window.open = function (...args /*url, target, windowFeatures*/) {
                            let url = args[0];
                            let target = args[1];
                            let windowFeaturesString = args[2]; /*"left=100,top=100,width=320,height=320"*/
                            let windowFeatures = {};
                            if (windowFeaturesString) {
                                windowFeaturesString = windowFeaturesString.split(',');
                                windowFeaturesString.forEach((obj) => {
                                    obj = obj.split('=');
                                    windowFeatures[obj[0]] = obj[1];
                                });
                            }

                            let child_window = Object.create(Window.prototype);
                            Object.assign(child_window, {
                                closed: false,
                                opener: window,
                                innerHeight: 1028,
                                innerWidth: 720,

                                postMessage: function (...args) {
                                    //  _____.log('postMessage child_window', args);
                                },
                                eval: function () {
                                    // _____.log('eval child_window');
                                },
                                close: function () {
                                    //  _____.log('close child_window');
                                    child_window.closed = true;
                                },
                                focus: function () {
                                    // _____.log('focus child_window');
                                },
                                blur: function () {
                                    //  _____.log('focus child_window');
                                },
                                print: function () {
                                    // _____.log('print child_window');
                                },
                                document: {
                                    write: function () {
                                        // _____.log('document write child_window');
                                    },
                                    open: function () {
                                        // _____.log('document write child_window');
                                    },
                                    close: function () {
                                        // _____.log('document write child_window');
                                    },
                                },
                                location: {
                                    href: url,
                                },
                                self: child_window,
                                window: child_window,
                            });

                            if (!url) {
                                _____.showUserMessage('block Popup <br>  <p> Empty URL </p>');
                                return child_window;
                            }
                            if (url == document.location.href && _____.var.blocking.popup.block_same_page) {
                                _____.showUserMessage('Block current URL re-Open');
                                return child_window;
                            }

                            if (!url || url.like('javascript:*|about:*|*accounts.google*|*account.facebook*|*login.microsoft*|*appleid.apple*') || _____.customSetting.allowCorePopup) {
                                let opener = originalwindowOpen(...args);
                                console.log(opener);
                                return opener || child_window;
                            }

                            url = _____.handleURL(url);
                            child_window.url = url;

                            let allow = false;

                            if (_____.allowPopup || _____.customSetting.allowPopup) {
                                allow = true;
                            } else {
                                if (_____.customSetting.blockPopup || !_____.customSetting.allowNewWindows) {
                                    _____.showUserMessage('block Popup <p><a>' + url + '</a></p>');
                                    return child_window;
                                }

                                if (_____.customSetting.allowSelfWindow) {
                                    document.location.href = url;
                                    return child_window;
                                }

                                if (!_____.javaScriptOFF) {
                                    if (!_____.isAllowURL(url)) {
                                        _____.showUserMessage('Not Allow URL  <p><a>' + url + '<a></p>');
                                        return child_window;
                                    }

                                    allow = !_____.var.blocking.black_list.some((d) => url.like(d.url));

                                    if (!allow) {
                                        _____.showUserMessage('block popup >> black list  <p><a>' + url + '</a></p>');
                                        return child_window;
                                    }

                                    allow = false;
                                    let toUrlParser = _____.isValidURL(url) ? new URL(url) : null;
                                    let fromUrlParser = _____.isValidURL(document.location.href) ? new URL(document.location.href) : null;
                                    if (toUrlParser && fromUrlParser) {
                                        if ((toUrlParser.host.contains(fromUrlParser.host) || fromUrlParser.host.contains(toUrlParser.host)) && _____.var.blocking.popup.allow_internal) {
                                            allow = true;
                                        } else if (toUrlParser.host !== fromUrlParser.host && _____.var.blocking.popup.allow_external) {
                                            allow = true;
                                        } else {
                                            allow = _____.var.blocking.white_list.some((d) => toUrlParser.host.like(d.url) || fromUrlParser.host.like(d.url));
                                        }
                                    }
                                }

                                if (!allow) {
                                    _____.showUserMessage('Not Allow popup <br> <p><a>' + url + '</a></p>');
                                    return child_window;
                                }
                            }

                            let showPopup = false;
                            let skipTaskbar = true;
                            let center = false;

                            if (_____.customSetting.hide) {
                                showPopup = false;
                                skipTaskbar = true;
                            } else if (_____.customSetting.windowType === 'view') {
                                showPopup = true;
                                center = true;
                                skipTaskbar = false;
                            } else {
                                showPopup = _____.customSetting.show;
                            }

                            let win = _____.openWindow({
                                url: url,
                                windowType: 'client-popup',
                                show: showPopup,
                                center: center,
                                skipTaskbar: skipTaskbar,
                                width: windowFeatures.width || _____.customSetting.width,
                                height: windowFeatures.height || _____.customSetting.height,
                                resizable: true,
                                frame: true,
                            });

                            child_window.postMessage = function (data, origin, transfer) {
                                win.postMessage(data, origin, transfer);
                            };

                            child_window.addEventListener = win.on;

                            win.on('closed', (e) => {
                                child_window.postMessage = (data, origin, transfer) => {};
                                child_window.eval = () => {};
                                child_window.closed = true;
                            });

                            child_window.eval = win.eval;

                            child_window.close = win.close;

                            child_window.win = win;

                            return child_window;
                        };
                        _____.__setConstValue(window.open, 'toString', () => s);
                    }
                }

                if (!_____.javaScriptOFF) {
                    if ((_____.workerTRUE = true)) {
                        _____.blobObjectList = [];
                        URL.createObjectURL0 = URL.createObjectURL;
                        URL.createObjectURL = function (obj) {
                            let url = URL.createObjectURL0(obj);
                            _____.blobObjectList.push({ url: url, object: obj });
                            return url;
                        };
                        _____.__setConstValue(URL.createObjectURL, 'toString', function () {
                            return 'function createObjectURL() { [native code] }';
                        });

                        if (!_____.customSetting.allowDefaultWorker) {
                            if (!_____.var.blocking.javascript.maskWindowWorker) {
                                (() => {
    const OriginalWorker = window.Worker;

    const WorkerProxy = new Proxy(OriginalWorker, {
        construct(target, args) {
            let [url, options] = args;

            const bootstrap = `
           function __setConstValue(o, p, v) {
            try {
                Object.defineProperty(o, p, {
                    get() {
                        return v;
                    },
                });
            } catch (error) {}
        }
        __setConstValue(navigator, 'languages', '${navigator.languages}');
        __setConstValue(navigator, 'language', '${navigator.language}');
        __setConstValue(navigator, 'platform', '${navigator.platform}');
        __setConstValue(navigator, 'appName', '${navigator.appName}');
        __setConstValue(navigator, 'appCodeName', '${navigator.appCodeName}');
        __setConstValue(navigator, 'deviceMemory', '${navigator.deviceMemory}');
        __setConstValue(navigator, 'hardwareConcurrency', '${navigator.hardwareConcurrency}');
        
        let getTimezoneOffset = Date.prototype.getTimezoneOffset
         let getTimezoneOffsetProxy = new Proxy(getTimezoneOffset, {
            apply(target, thisArg, args) {
                return Number(${_____.timeZone.offset || 0} * 60);
                return Reflect.apply(target, thisArg, args);
            },
        });

        Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
            value: getTimezoneOffsetProxy,
            writable: true,
            configurable: true,
        });

        const __defineProperty = Object.defineProperty
         __setConstValue(Object, 'defineProperty', function (o, p, d) {
            if (o === navigator) {
                if (p == 'webdriver') {
                    return o;
                } else if (p == 'platform') {
                    return o;
                }
                return o;
            }
            return __defineProperty(o, p, d);
        });
        let loc = new URL("${_____.handleURL(url.toString())}");
         __setConstValue(globalThis, 'location', {
                        protocol: loc.protocol,
                        host: loc.host,
                        hostname: loc.hostname,
                        origin: loc.origin,
                        port: loc.port,
                        pathname: loc.pathname,
                        hash: loc.hash,
                        search: loc.search,
                        href: "${_____.handleURL(url.toString())}",
                        toString: function () {
                            return "${_____.handleURL(url.toString())}";
                        },
                    });
            importScripts("${_____.handleURL(url.toString())}");
        `;

            const blob = new Blob([bootstrap], {
                type: 'application/javascript',
            });

            return Reflect.construct(target, [URL.createObjectURL(blob), options]);
        },
    });

    window.Worker = WorkerProxy;

    _____.__setConstValue(window, 'Worker', WorkerProxy);
    _____.__setConstValue(window.Worker, 'toString', OriginalWorker.toString());
})();

(() => {
    _____.navigator.serviceWorker = Object.create(Object.getPrototypeOf(navigator.serviceWorker || {}));
    _____.__setConstValue(_____.navigator.serviceWorker, 'controller', navigator.serviceWorker ? navigator.serviceWorker.controller : {});
    _____.__setConstValue(_____.navigator.serviceWorker, 'ready', navigator.serviceWorker ? navigator.serviceWorker.ready : Promise.resolve());
    _____.__setConstValue(_____.navigator.serviceWorker, 'getRegistration', function () {
        return Promise.resolve();
    });
    _____.__setConstValue(_____.navigator.serviceWorker, 'getRegistrations', function () {
        return Promise.resolve([]);
    });
    _____.__setConstValue(_____.navigator.serviceWorker, 'register', function (...args) {
        _____.log('New service Worker : ' + args[0]);

        return new Promise((resolve, reject) => {
            let worker = new window.Worker(...args);
            resolve(_____.navigator.serviceWorker);
        });
    });
    _____.__setConstValue(_____.navigator.serviceWorker, 'startMessages', function () {
        return Promise.resolve();
    });
    _____.__setConstValue(_____.navigator.serviceWorker, 'addEventListener', function () {});

    _____.__setConstValue(window, 'SharedWorker', window.Worker);
    _____.__setConstValue(window.SharedWorker, 'toString', function () {
        return 'SharedWorker() { [native code] }';
    });
})();

                            } else {
                                _____.__setConstValue(window, 'Worker', function (url) {
                                    return _____.newWorker(url);
                                });
                                _____.__setConstValue(window.Worker, 'toString', function () {
                                    return 'function Worker() { [native code] }';
                                });

                                _____.navigator.serviceWorker = Object.create(Object.getPrototypeOf(navigator.serviceWorker || {}));
                                _____.__setConstValue(_____.navigator.serviceWorker, 'controller', navigator.serviceWorker ? navigator.serviceWorker.controller : {});
                                _____.__setConstValue(_____.navigator.serviceWorker, 'ready', navigator.serviceWorker ? navigator.serviceWorker.ready : Promise.resolve());
                                _____.__setConstValue(_____.navigator.serviceWorker, 'getRegistration', function () {
                                    return Promise.resolve();
                                });
                                _____.__setConstValue(_____.navigator.serviceWorker, 'getRegistrations', function () {
                                    return Promise.resolve([]);
                                });
                                _____.__setConstValue(_____.navigator.serviceWorker, 'register', function (...args) {
                                    _____.log('New service Worker : ' + args[0]);
                                    return new Promise((resolve, reject) => {
                                        let worker = new window.Worker(...args);
                                        resolve(_____.navigator.serviceWorker);
                                    });
                                });
                                _____.__setConstValue(_____.navigator.serviceWorker, 'startMessages', function () {
                                    return Promise.resolve();
                                });
                                _____.__setConstValue(_____.navigator.serviceWorker, 'addEventListener', function () {});

                                _____.__setConstValue(window, 'SharedWorker', window.Worker);
                                _____.__setConstValue(window.SharedWorker, 'toString', function () {
                                    return 'SharedWorker() { [native code] }';
                                });
                            }
                        }
                    }
                }

                if (_____.var.blocking.javascript.block_window_post_message) {
                    let s = window.postMessage.toString();
                    window.postMessage = function (data, origin, transfer) {
                        _____.log('Block Post Message ', data, origin, transfer);
                    };
                    _____.__setConstValue(window.postMessage, 'toString', () => s);
                }
            })();
        }

        _____.defaultUserAgent = _____.customSetting.$defaultUserAgent;

        if (_____.defaultUserAgent) {
            _____.userAgentURL = _____.defaultUserAgent.url;
        }

        if (_____.customSetting.$userAgentURL) {
            _____.userAgentURL = _____.customSetting.$userAgentURL;
        }

        if (!_____.userAgentURL) {
            _____.var.customHeaderList.forEach((h) => {
                if (h.type == 'request' && document.location.href.like(h.url)) {
                    h.list.forEach((v) => {
                        if (v && v.name && v.name == 'User-Agent' && v.value) {
                            _____.userAgentURL = v.value;
                            _____.defaultUserAgent = _____.var.userAgentList.find((u) => u.url == _____.userAgentURL);
                        }
                    });
                }
            });
        }

        if (!_____.userAgentURL) {
            if (_____.session.defaultUserAgent) {
                _____.defaultUserAgent = _____.session.defaultUserAgent;
                _____.userAgentURL = _____.session.defaultUserAgent.url;
            }
        }

        if (!_____.defaultUserAgent) {
            _____.defaultUserAgent = _____.var.userAgentList.find((u) => u.url == _____.userAgentURL);
            if (!_____.defaultUserAgent) {
                _____.defaultUserAgent = _____.var.core.defaultUserAgent;
            }
        }

        if (!_____.userAgentURL) {
            _____.userAgentURL = _____.defaultUserAgent.url;
        }

        if (_____.defaultUserAgent) {
            if (_____.defaultUserAgent.engine && _____.defaultUserAgent.engine.name) {
                _____.defaultUserAgent.name = _____.defaultUserAgent.engine.name;
            }

            _____.defaultUserAgent.name = _____.defaultUserAgent.name || _____.defaultUserAgent.url;

            if (_____.defaultUserAgent.name.contains('Edge')) {
            } else if (_____.defaultUserAgent.name.contains('Firefox')) {
                _____.isFirefox = true;
                _____.__setConstValue(window, 'mozRTCIceCandidate', window.RTCIceCandidate);
                _____.__setConstValue(window, 'mozRTCPeerConnection', window.RTCPeerConnection);
                _____.__setConstValue(window, 'mozRTCSessionDescription', window.RTCSessionDescription);
                _____.__setConstValue(window.CSS, 'supports', () => true);
                _____.__setConstValue(document, 'onmozfullscreenchange', () => true);
                _____.__setConstValue(document, 'onmozfullscreenerror', () => true);
                window.mozInnerScreenX = 0;
                window.mozInnerScreenY = 74;
            } else if (_____.defaultUserAgent.name.contains('Chrome')) {
            } else if (_____.defaultUserAgent.name.contains('Safari')) {
                _____.isSafari = true;
            }

            if (_____.defaultUserAgent.device && _____.defaultUserAgent.device.name === 'Mobile') {
                _____.userAgentData = _____.userAgentData || {};
                _____.userAgentData.mobile = true;
                _____.userAgentData.platform = _____.defaultUserAgent.platform;

                _____.navigator.maxTouchPoints = 5;
                _____.__setConstValue(window, 'ontouchstart', function () {});
            }

            if (_____.userAgentData) {
                _____.navigator.userAgentData = Object.create(Object.getPrototypeOf(navigator.userAgentData || {}));
                _____.__setConstValue(_____.navigator.userAgentData, 'brands', _____.userAgentData.brands);
                _____.__setConstValue(_____.navigator.userAgentData, 'mobile', _____.userAgentData.mobile);
                _____.__setConstValue(_____.navigator.userAgentData, 'platform', _____.userAgentData.platform);
                _____.__setConstValue(_____.navigator.userAgentData, 'oscpu', _____.userAgentData.oscpu);

                _____.__setConstValue(_____.navigator.userAgentData, 'getHighEntropyValues', function (arr) {
                    return new Promise((resolve, reject) => {
                        let obj = {};
                        obj.brands = _____.userAgentData.brands;
                        obj.mobile = _____.userAgentData.mobile;
                        obj.platform = _____.userAgentData.platform;
                        obj.kernelVersion = _____.userAgentData.kernelVersion;
                        obj.arch = _____.userAgentData.arch;
                        obj.oscpu = _____.userAgentData.oscpu;

                        if (Array.isArray(arr)) {
                            arr.forEach((a) => {
                                obj[a] = _____.userAgentData[a];
                            });
                        } else if (typeof arr == 'string') {
                            obj[arr] = _____.userAgentData[arr];
                        }
                        setTimeout(() => {
                            resolve(obj);
                        }, 0);
                    });
                });
            }

            _____.navigator.vendor = _____.defaultUserAgent.vendor;
            _____.navigator.platform = _____.defaultUserAgent.platform;
            _____.navigator.oscpu = _____.defaultUserAgent.oscpu;
        }

        if (_____.var.blocking.privacy.allowVPC && _____.var.blocking.privacy.vpc.maskUserAgentURL) {
            if (!_____.userAgentURL.like('*[xx-*')) {
                _____.userAgentURL = _____.userAgentURL.replace(') ', ') [xx-' + _____.guid() + '] ');
            }
        }

        document.hasPrivateStateToken =
            document.hasTrustToken =
            document.hasPrivateToken =
                function () {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                };

        _____.userAgent = navigator.userAgent;
        _____.navigator.userAgent = _____.userAgentURL;

        (function loadFingerPrint() {
            if (true) {
                let maskDate = false;
let timeZone = null;
if (_____.proxy && _____.proxy.vpc && _____.proxy.vpc.maskTimeZone && _____.proxy.vpc.timeZone) {
    maskDate = true;
    timeZone = _____.proxy.vpc.timeZone;
} else if (_____.session.privacy.allowVPC && _____.session.privacy.vpc && _____.session.privacy.vpc.maskTimeZone && _____.session.privacy.vpc.timeZone) {
    maskDate = true;
    timeZone = _____.session.privacy.vpc.timeZone;
}

_____.timeZone = timeZone;

if (maskDate && timeZone) {
    (function (o, acOffset) {
        const gmtNeg = function (n) {
            const _format = function (v) {
                return (v < 10 ? '0' : '') + v;
            };
            return (n <= 0 ? '+' : '-') + _format((Math.abs(n) / 60) | 0) + _format(Math.abs(n) % 60);
        };

        const GMT = function (n) {
            const _format = function (v) {
                return (v < 10 ? '0' : '') + v;
            };
            return (n <= 0 ? '-' : '+') + _format((Math.abs(n) / 60) | 0) + _format(Math.abs(n) % 60);
        };

        const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
        const {
            getDay,
            getDate,
            getYear,
            getMonth,
            getHours,
            toString,
            getMinutes,
            getSeconds,
            getFullYear,
            toLocaleString,
            getMilliseconds,
            getTimezoneOffset,
            toLocaleTimeString,
            toLocaleDateString,
        } = Date.prototype;

        Object.defineProperty(Date.prototype, '_offset', {
            configurable: true,
            get() {
                return getTimezoneOffset.call(this);
            },
        });

        Object.defineProperty(Date.prototype, '_date', {
            configurable: true,
            get() {
                return this._nd === undefined ? new Date(this.getTime() + (this._offset + o.offset * 60) * 60 * 1000) : this._nd;
            },
        });

        Object.defineProperty(Date.prototype, 'getDay', {
            value: function () {
                return getDay.call(this._date);
            },
        });

        Object.defineProperty(Date.prototype, 'getDate', {
            value: function () {
                return getDate.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'getYear', {
            value: function () {
                return getYear.call(this._date);
            },
        });

        let getTimezoneOffsetProxy = new Proxy(getTimezoneOffset, {
            apply(target, thisArg, args) {
                return Number(o.offset * 60);
                return Reflect.apply(target, thisArg, args);
            },
        });

        Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
            value: getTimezoneOffsetProxy,
            writable: true,
            configurable: true,
        });

        Object.defineProperty(Date.prototype, 'getMonth', {
            value: function () {
                return getMonth.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'getHours', {
            value: function () {
                return getHours.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'getMinutes', {
            value: function () {
                return getMinutes.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'getSeconds', {
            value: function () {
                return getSeconds.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'getFullYear', {
            value: function () {
                return getFullYear.call(this._date);
            },
        });

        Object.defineProperty(Date.prototype, 'getMilliseconds', {
            value: function () {
                return getMilliseconds.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'toLocaleString', {
            value: function () {
                return toLocaleString.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'toLocaleTimeString', {
            value: function () {
                return toLocaleTimeString.call(this._date);
            },
        });
        Object.defineProperty(Date.prototype, 'toLocaleDateString', {
            value: function () {
                return toLocaleDateString.call(this._date);
            },
        });

        Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
            value: function () {
                return Object.assign(resolvedOptions, { timeZone: o.text, locale: navigator.language });
            },
        });
        Object.defineProperty(Date.prototype, 'toString', {
            value: function () {
                return toString
                    .call(this._date)
                    .replace(gmtNeg(acOffset), GMT(o.offset * 60))
                    .replace(/\(.*\)/, '(' + o.value + ')');
            },
        });
    })(timeZone, new Date().getTimezoneOffset());
}

let maskLocation = false;
let newLocation = null;
if (_____.proxy && _____.proxy.vpc && _____.proxy.vpc.maskLocation && _____.proxy.vpc.location) {
    maskLocation = true;
    newLocation = _____.proxy.vpc.location;
} else if (_____.session.privacy.allowVPC && _____.session.privacy.vpc && _____.session.privacy.vpc.maskLocation && _____.session.privacy.vpc.location) {
    maskLocation = true;
    newLocation = _____.session.privacy.vpc.location;
}

if (maskLocation && newLocation) {
    let s = navigator.geolocation.getCurrentPosition.toString();
    _____.__setConstValue(navigator.geolocation, 'getCurrentPosition', function (success, error, options = { enableHighAccuracy: true, timeout: 0, maximumAge: 0 }) {
        if (success) {
            let latitude = parseFloat(newLocation.latitude || 0);
            let longitude = parseFloat(newLocation.longitude || 0);
            let accuracy = _____.getStorage('geolocation_accuracy', undefined, { domain: 'watchPosition' }) || _____.random(90, 120);
            _____.setStorage('geolocation_accuracy', accuracy, { domain: 'watchPosition' });
            success({
                timestamp: new Date().getTime(),
                coords: {
                    latitude: latitude,
                    longitude: longitude,
                    altitude: null,
                    accuracy: accuracy,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
            });
        }
    });
    _____.__setConstValue(navigator.geolocation.getCurrentPosition, 'toString', () => s);

    let s2 = navigator.geolocation.watchPosition.toString();
    _____.__setConstValue(navigator.geolocation, 'watchPosition', function (success, error, options = { enableHighAccuracy: true, timeout: 0, maximumAge: 0 }) {
        if (success) {
            let timeout = options.timeout || 0;
            let latitude = parseFloat(newLocation.latitude || 0);
            let longitude = parseFloat(newLocation.longitude || 0);
            let accuracy = _____.getStorage('geolocation_accuracy', undefined, { domain: 'watchPosition' }) || _____.random(90, 120);
            _____.setStorage('geolocation_accuracy', accuracy, { domain: 'watchPosition' });
            let data = {
                timestamp: new Date().getTime(),
                coords: {
                    latitude: latitude,
                    longitude: longitude,
                    altitude: null,
                    accuracy: accuracy,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
            };

            setTimeout(() => {
                success(data);
            }, 0);

            return setInterval(() => {
                data.coords.latitude += 0.00001;
                data.coords.longitude += 0.00001;
                success(data);
            }, 1000 * 60);
        }
        return 0;
    });
    _____.__setConstValue(navigator.geolocation.watchPosition, 'toString', () => s2);

    let s3 = navigator.geolocation.clearWatch.toString();
    _____.__setConstValue(navigator.geolocation, 'clearWatch', function (id) {
        return clearInterval(id);
    });
    _____.__setConstValue(navigator.geolocation.clearWatch, 'toString', () => s3);
}


                if (_____.session.privacy.vpc.maskPlugins) {
                    _____.navigator.plugins = Object.create(Object.getPrototypeOf(navigator.plugins || {}));

                    _____.__setConstValue(_____.navigator.plugins, 'length', 5);
                    let userID = _____.session.name.replace('persist:', '').split('@')[0];
                    for (let index = 0; index < 5; index++) {
                        let name = ' Plugin ' + userID + ' ' + index;
                        let description = 'Description of ' + ' Plugin ' + userID + ' ' + index;
                        _____.navigator.plugins[index] = _____.navigator.plugins[name] = Object.create(Plugin.prototype);
                        Object.assign(_____.navigator.plugins[index], navigator.plugins[0]);
                        Object.assign(_____.navigator.plugins[name], navigator.plugins[0]);
                        _____.__setConstValue(_____.navigator.plugins[index], 'name', name);
                        _____.__setConstValue(_____.navigator.plugins[name], 'name', name);
                        _____.__setConstValue(_____.navigator.plugins[index], 'filename', name);
                        _____.__setConstValue(_____.navigator.plugins[name], 'filename', name);
                        _____.__setConstValue(_____.navigator.plugins[index], 'description', description);
                        _____.__setConstValue(_____.navigator.plugins[name], 'description', description);
                        _____.__setConstValue(_____.navigator.plugins[index], 'length', 2);
                        _____.__setConstValue(_____.navigator.plugins[name], 'length', 2);
                        _____.__setConstValue(_____.navigator.plugins[index], 'version', 1);
                        _____.__setConstValue(_____.navigator.plugins[name], 'version', 1);
                    }
                }

                if (_____.javaScriptOFF || _____.customSetting.windowType === 'main' || !_____.session.privacy.allowVPC) {
                    _____.log('.... [ Finger Printing OFF ] .... ' + document.location.href);
                    return;
                }

                if (_____.session.privacy.vpc.maskCPU) {
                    _____.navigator.hardwareConcurrency = _____.session.privacy.vpc.cpu_count;
                }
                if (_____.session.privacy.vpc.maskMemory) {
                    _____.navigator.deviceMemory = _____.session.privacy.vpc.memory_count;
                }

                if (true) {
    let width = 0;
    let height = 0;
    let availWidth = 0;
    let availHeight = 0;

    if (!_____.screenHidden && _____.defaultUserAgent.screen) {
        width = _____.defaultUserAgent.screen.width;
        height = _____.defaultUserAgent.screen.height;
        availWidth = _____.defaultUserAgent.screen.availWidth;
        availHeight = _____.defaultUserAgent.screen.availHeight;

        _____.screenHidden = true;
    }

    if (!_____.screenHidden && _____.session.privacy.vpc.hide_screen && _____.session.privacy.vpc.screen) {
        width = _____.session.privacy.vpc.screen.width;
        height = _____.session.privacy.vpc.screen.height;
        availWidth = _____.session.privacy.vpc.screen.availWidth;
        availHeight = _____.session.privacy.vpc.screen.availHeight;

        _____.screenHidden = true;
    }

    if (width) {
        _____.__setConstValue(window, 'innerWidth', width);
        _____.__setConstValue(window, 'outerWidth', width);
        _____.__setConstValue(screen, 'width', width);

        if (!availWidth) {
            availWidth = width;
        }
    }
    if (height) {
        _____.__setConstValue(window, 'innerHeight', height);
        _____.__setConstValue(window, 'outerHeight', height);
        _____.__setConstValue(screen, 'height', height);

        if (!availHeight) {
            availHeight = height - 48;
        }
        if (availHeight == height) {
            availHeight = height - 48;
        }
    }
    if (availWidth) {
        _____.__setConstValue(screen, 'availWidth', availWidth);
    }
    if (availHeight) {
        _____.__setConstValue(screen, 'availHeight', availHeight);
    }
}


                if (_____.session.privacy.vpc.maskLang) {
                    _____.session.privacy.vpc.languages = _____.session.privacy.vpc.languages || navigator.languages.toString();

                    let arr = [];
                    _____.session.privacy.vpc.languages.split(',').forEach((lang) => {
                        arr.push(lang.split(';')[0]);
                    });

                    _____.__setConstValue(_____.navigator, 'ondeviclanguagechange', _____.session.privacy.vpc.languages.split(',')[0].split(';')[0]);
                    _____.__setConstValue(_____.navigator, 'languages', arr);
                }

                if (_____.session.privacy.vpc.maskCanvas) {
    _____.canvas = {};
    _____.canvas.toBlob = HTMLCanvasElement.prototype.toBlob;
    _____.canvas.toDataURL = HTMLCanvasElement.prototype.toDataURL;
    _____.canvas.getImageData = CanvasRenderingContext2D.prototype.getImageData;
    _____.canvas.noisify = function (canvas, context) {
        if (context) {
            let shift;
            let canvas_shift = _____.getStorage('canvas_shift', undefined, { domain: _____.partition });
            if (canvas_shift) {
                shift = canvas_shift;
            } else {
                shift = {
                    r: Math.floor(Math.random() * 10) - 5,
                    g: Math.floor(Math.random() * 10) - 5,
                    b: Math.floor(Math.random() * 10) - 5,
                    a: Math.floor(Math.random() * 10) - 5,
                };
                _____.setStorage('canvas_shift', shift, { domain: _____.partition });
            }
            if (typeof canvas == undefined) {
                canvas = { width: 0, height: 0 };
            }
            const width = canvas.width;
            const height = canvas.height;
            if (width && height) {
                const imageData = _____.canvas.getImageData.apply(context, [0, 0, width, height]);
                for (let i = 0; i < height; i++) {
                    for (let j = 0; j < width; j++) {
                        const n = i * (width * 4) + j * 4;
                        imageData.data[n + 0] = imageData.data[n + 0] + shift.r;
                        imageData.data[n + 1] = imageData.data[n + 1] + shift.g;
                        imageData.data[n + 2] = imageData.data[n + 2] + shift.b;
                        imageData.data[n + 3] = imageData.data[n + 3] + shift.a;
                    }
                }

                context.putImageData(imageData, 0, 0);
            }
        }
    };

    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: new Proxy(_____.canvas.toBlob, {
            apply(target, thisArg, args) {
                _____.canvas.noisify(thisArg, thisArg.getContext('2d'));
                return Reflect.apply(target, thisArg, args);
            },
        }),
        writable: true,
        configurable: true,
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
        value: new Proxy(_____.canvas.toDataURL, {
            apply(target, thisArg, args) {
                _____.canvas.noisify(thisArg, thisArg.getContext('2d'));
                return Reflect.apply(target, thisArg, args);
            },
        }),
        writable: true,
        configurable: true,
    });

    Object.defineProperty(CanvasRenderingContext2D.prototype, 'getImageData', {
        value: new Proxy(_____.canvas.getImageData, {
            apply(target, thisArg, args) {
                if (!target.NNN) {
                    target.NNN = true;
                    _____.canvas.noisify(target.canvas, target);
                }
                return Reflect.apply(target, thisArg, args);
            },
        }),
        writable: true,
        configurable: true,
    });
}

                (() => {
    if (true) {
        if (_____.session.privacy.vpc.maskAudio) {
            _____.audioContext = {
                BUFFER: null,
                getChannelData: function (e) {
                    const getChannelData = e.prototype.getChannelData;
                    Object.defineProperty(e.prototype, 'getChannelData', {
                        value: function () {
                            const results_1 = getChannelData.apply(this, arguments);
                            if (_____.audioContext.BUFFER !== results_1) {
                                _____.audioContext.BUFFER = results_1;

                                let audio_r1_idx = _____.getStorage('audio_r1_idx', undefined, { domain: _____.partition });
                                let audio_r1_vx = _____.getStorage('audio_r1_vx', undefined, { domain: _____.partition });
                                if (audio_r1_idx && audio_r1_vx) {
                                    for (let iter = 0, i = 0; i < results_1.length; i += 100, iter += 1) {
                                        let index = audio_r1_idx[iter];
                                        let val = audio_r1_vx[iter];
                                        results_1[index] = results_1[index] + val;
                                    }
                                } else {
                                    let indxs = [];
                                    let vals = [];
                                    for (let i = 0; i < results_1.length; i += 100) {
                                        let index = Math.floor(Math.random() * i);
                                        let val = Math.random() * 0.0000001;
                                        indxs.push(index);
                                        vals.push(val);
                                        results_1[index] = results_1[index] + val;
                                    }
                                    _____.setStorage('audio_r1_idx', indxs, { domain: _____.partition });
                                    _____.setStorage('audio_r1_vx', vals, { domain: _____.partition });
                                }
                            }

                            return results_1;
                        },
                    });
                },

                createAnalyser: function (e) {
                    const createAnalyser = e.prototype.__proto__.createAnalyser;
                    Object.defineProperty(e.prototype.__proto__, 'createAnalyser', {
                        value: function () {
                            const results_2 = createAnalyser.apply(this, arguments);
                            const getFloatFrequencyData = results_2.__proto__.getFloatFrequencyData;
                            Object.defineProperty(results_2.__proto__, 'getFloatFrequencyData', {
                                value: function () {
                                    const results_3 = getFloatFrequencyData.apply(this, arguments);

                                    let audio_r3_idx = _____.getStorage('audio_r3_idx', undefined, { domain: _____.partition });
                                    let audio_r3_vx = _____.getStorage('audio_r3_vx', undefined, { domain: _____.partition });
                                    if (audio_r3_idx && audio_r3_vx) {
                                        for (let iter = 0, i = 0; i < audio_r3_idx.length; i += 100, iter += 1) {
                                            let index = audio_r3_idx[iter];
                                            let val = audio_r3_vx[iter];
                                            arguments[0][index] = arguments[0][index] + val;
                                        }
                                    } else {
                                        let indxs = [];
                                        let vals = [];
                                        for (var i = 0; i < arguments[0].length; i += 100) {
                                            let index = Math.floor(Math.random() * i);
                                            let val = Math.random() * 0.1;
                                            indxs.push(index);
                                            vals.push(val);
                                            arguments[0][index] = arguments[0][index] + val;
                                        }
                                        _____.setStorage('audio_r3_idx', indxs, { domain: _____.partition });
                                        _____.setStorage('audio_r3_vx', vals, { domain: _____.partition });
                                    }
                                    return results_3;
                                },
                            });
                            return results_2;
                        },
                    });
                },
            };
            _____.audioContext.getChannelData(AudioBuffer);
            _____.audioContext.createAnalyser(AudioContext);
            _____.audioContext.getChannelData(OfflineAudioContext);
            _____.audioContext.createAnalyser(OfflineAudioContext);

            const original = window.AudioContext;

            _____.__setConstValue(window, 'AudioContext', _____.audioContext);
            _____.__toString(window.AudioContext, original.toString());
        }
    }
})();

                (function maskWebGL() {
    if (_____.session.privacy.vpc.maskWebGL) {
        // _____.__setConstValue(WebGLRenderingContext, 'getParameter', () => '');
        // _____.__setConstValue(WebGL2RenderingContext, 'getParameter', () => '');
        _____.configWebGL = {
            random: {
                value: function (key = false) {
                    let rand;
                    if (key) {
                        let get = _____.getStorage('webgl_rv_' + key, undefined, { domain: _____.partition });
                        rand = get ? get : Math.random();
                        if (!get) _____.setStorage('webgl_rv_' + key, rand, { domain: _____.partition });
                    } else {
                        rand = Math.random();
                    }
                    return rand;
                },
                item: function (key, e) {
                    let get = _____.getStorage('webgl_' + key, undefined, { domain: _____.partition });
                    let rand = get ? get : e.length * _____.configWebGL.random.value();
                    if (!get) _____.setStorage('webgl_' + key, rand, { domain: _____.partition });
                    return e[Math.floor(rand)];
                },
                number: function (key, power) {
                    var tmp = [];
                    for (var i = 0; i < power.length; i++) {
                        tmp.push(Math.pow(2, power[i]));
                    }
                    return _____.configWebGL.random.item(key, tmp);
                },
                int: function (key, power) {
                    var tmp = [];
                    for (var i = 0; i < power.length; i++) {
                        var n = Math.pow(2, power[i]);
                        tmp.push(new Int32Array([n, n]));
                    }
                    return _____.configWebGL.random.item(key, tmp);
                },
                float: function (key, power) {
                    var tmp = [];
                    for (var i = 0; i < power.length; i++) {
                        var n = Math.pow(2, power[i]);
                        tmp.push(new Float32Array([1, n]));
                    }
                    return _____.configWebGL.random.item(key, tmp);
                },
            },
            spoof: {
                webgl: {
                    buffer: function (target) {
                        var proto = target.prototype ? target.prototype : target.__proto__;
                        const bufferData = proto.bufferData;
                        Object.defineProperty(proto, 'bufferData', {
                            value: function () {
                                var index = Math.floor(_____.configWebGL.random.value('bufferDataIndex') * arguments[1].length);
                                var noise = arguments[1][index] !== undefined ? 0.1 * _____.configWebGL.random.value('bufferDataNoise') * arguments[1][index] : 0;
                                arguments[1][index] = arguments[1][index] + noise;
                                return bufferData.apply(this, arguments);
                            },
                        });
                    },
                    parameter: function (target) {
                        if (true) {
                            const original = WebGLRenderingContext.prototype.getParameter;

                            WebGLRenderingContext.prototype.getParameter = new Proxy(original, {
                                apply(target, thisArg, args) {
                                    if (args[0] === 3415) return 0;
                                    else if (args[0] === 3414) return 24;
                                    else if (args[0] === 36348) return 30;
                                    else if (args[0] === 7936) return _____.isFirefox ? 'Mozilla' : 'WebKit';
                                    else if (args[0] === 37445) return _____.isFirefox ? 'Mozilla' : 'Google Inc. (Intel)';
                                    else if (args[0] === 7937) return _____.isFirefox ? 'Mozilla WebGL' : 'WebKit WebGL';
                                    else if (args[0] === 3379) return _____.configWebGL.random.number('3379', [14, 15]);
                                    else if (args[0] === 36347) return _____.configWebGL.random.number('36347', [12, 13]);
                                    else if (args[0] === 34076) return _____.configWebGL.random.number('34076', [14, 15]);
                                    else if (args[0] === 34024) return _____.configWebGL.random.number('34024', [14, 15]);
                                    else if (args[0] === 3386) return _____.configWebGL.random.int('3386', [13, 14, 15]);
                                    else if (args[0] === 3413) return _____.configWebGL.random.number('3413', [1, 2, 3, 4]);
                                    else if (args[0] === 3412) return _____.configWebGL.random.number('3412', [1, 2, 3, 4]);
                                    else if (args[0] === 3411) return _____.configWebGL.random.number('3411', [1, 2, 3, 4]);
                                    else if (args[0] === 3410) return _____.configWebGL.random.number('3410', [1, 2, 3, 4]);
                                    else if (args[0] === 34047) return _____.configWebGL.random.number('34047', [1, 2, 3, 4]);
                                    else if (args[0] === 34930) return _____.configWebGL.random.number('34930', [1, 2, 3, 4]);
                                    else if (args[0] === 34921) return _____.configWebGL.random.number('34921', [1, 2, 3, 4]);
                                    else if (args[0] === 35660) return _____.configWebGL.random.number('35660', [1, 2, 3, 4]);
                                    else if (args[0] === 35661) return _____.configWebGL.random.number('35661', [4, 5, 6, 7, 8]);
                                    else if (args[0] === 36349) return _____.configWebGL.random.number('36349', [10, 11, 12, 13]);
                                    else if (args[0] === 33902) return _____.configWebGL.random.float('33902', [0, 10, 11, 12, 13]);
                                    else if (args[0] === 33901) return _____.configWebGL.random.float('33901', [0, 10, 11, 12, 13]);
                                    // else if (args[0] === 37446) return _____.configWebGL.random.item('37446', ['Graphics', 'HD Graphics', 'Intel(R) HD Graphics']);
                                    // else if (args[0] === 7938) return _____.configWebGL.random.item('7938', ['WebGL 1.0', 'WebGL 1.0 (OpenGL)', 'WebGL 1.0 (OpenGL Chromium)']);
                                    // else if (args[0] === 35724) return _____.configWebGL.random.item('35724', ['WebGL', 'WebGL GLSL', 'WebGL GLSL ES', 'WebGL GLSL ES (OpenGL Chromium)']);
                                    return Reflect.apply(target, thisArg, args);
                                },
                            });
                            Object.defineProperty(WebGLRenderingContext.prototype, 'getParameter', {
                                value: WebGLRenderingContext.prototype.getParameter,
                                writable: true,
                                configurable: true,
                            });
                        }
                    },
                },
            },
        };
        _____.configWebGL.spoof.webgl.buffer(WebGLRenderingContext);
        _____.configWebGL.spoof.webgl.buffer(WebGL2RenderingContext);
        _____.configWebGL.spoof.webgl.parameter(WebGLRenderingContext);
        _____.configWebGL.spoof.webgl.parameter(WebGL2RenderingContext);
    }
})();


                if (
                    (_____.customSetting.windowType.like('*popup*') && _____.session.privacy.vpc.set_window_active) ||
                    (_____.customSetting.windowType.like('*view*') && _____.session.privacy.vpc.set_tab_active)
                ) {
                    _____.blockEvent = (e) => {
                        if (e.target === window || e.target === document) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                    };

                    _____.__setConstValue(window, 'hidden ', false);
                    // _____.__setConstValue(window, 'mozHidden ', false);
                    // _____.__setConstValue(window, 'webkitHidden ', false);
                    _____.__setConstValue(window, 'visibilityState ', 'visible');

                    window.addEventListener('visibilitychange', _____.blockEvent, true);
                    // window.addEventListener('webkitvisibilitychange', _____.blockEvent, true);
                    // window.addEventListener('mozvisibilitychange', _____.blockEvent, true);

                    // window.addEventListener('hasFocus', _____.blockEvent, true);
                    // window.addEventListener('focus', _____.blockEvent, true);
                    // window.addEventListener('focusin', _____.blockEvent, true);
                    window.addEventListener('focusout', _____.blockEvent, true);
                    window.addEventListener('blur', _____.blockEvent, true);
                    // window.addEventListener('mouseleave', _____.blockEvent, true);
                    window.addEventListener('mouseenter', _____.blockEvent, true);

                    // _____.__setConstValue(window, 'onfocus', function () {});
                    _____.__setConstValue(window, 'onblur', function () {});
                }

                if (_____.session.privacy.vpc.blockRTC) {
                    try {
                        _____.webContents.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');
                    } catch (error) {
                        _____.log(error);
                    }

                    _____.__setConstValue(window, 'MediaStreamTrack', undefined);
                    _____.__setConstValue(window, 'RTCPeerConnection', undefined);
                    _____.__setConstValue(window, 'RTCSessionDescription', undefined);

                    // _____.__setConstValue(window, 'mozMediaStreamTrack', undefined);
                    // _____.__setConstValue(window, 'mozRTCPeerConnection', undefined);
                    // _____.__setConstValue(window, 'mozRTCSessionDescription', undefined);

                    // _____.__setConstValue(window, 'webkitMediaStreamTrack', undefined);
                    // _____.__setConstValue(window, 'webkitRTCPeerConnection', undefined);
                    // _____.__setConstValue(window, 'webkitRTCSessionDescription', undefined);
                }

                if (_____.session.privacy.vpc.hide_media_devices) {
                    _____.navigator.mediaDevices = Object.create(Object.getPrototypeOf(navigator.mediaDevices || {}));
                    _____.__setConstValue(_____.navigator.mediaDevices, 'ondevicechange', null);
                    _____.__setConstValue(_____.navigator.mediaDevices, 'enumerateDevices', () => {
                        return new Promise((resolve, reject) => {
                            resolve([]);
                        });
                    });
                    _____.__setConstValue(_____.navigator.mediaDevices, 'getUserMedia', () => {
                        return new Promise((resolve, reject) => {
                            reject('access block');
                        });
                    });
                    _____.__setConstValue(_____.navigator.mediaDevices, 'getSupportedConstraints', () => {
                        return {};
                    });
                }

                if (_____.session.privacy.vpc.hide_mimetypes) {
                    _____.__setConstValue(_____.navigator, 'mimeTypes', {
                        length: 0,
                        item: () => null,
                        namedItem: () => null,
                        refresh: () => {},
                    });
                }

                if (_____.session.privacy.vpc.hide_connection || _____.session.privacy.vpc.hide_connection) {
                    _____.navigator.connection = Object.create(Object.getPrototypeOf(navigator.connection || {}));
                    _____.__setConstValue(_____.navigator.connection, 'addEventListener', function () {});
                    _____.__setConstValue(_____.navigator.connection, 'onchange', null);
                    _____.__setConstValue(_____.navigator.connection, 'effectiveType', _____.session.privacy.vpc.connection.effectiveType);
                    _____.__setConstValue(_____.navigator.connection, 'rtt', _____.session.privacy.vpc.connection.rtt);
                    _____.__setConstValue(_____.navigator.connection, 'downlink', _____.session.privacy.vpc.connection.downlink);
                    _____.__setConstValue(_____.navigator.connection, 'downlinkMax', _____.session.privacy.vpc.connection.downlinkMax);
                    _____.__setConstValue(_____.navigator.connection, 'saveData', false);
                    _____.__setConstValue(_____.navigator.connection, 'type', _____.session.privacy.vpc.connection.type);
                }

                if (false) {
    // devtools problem when mask fonts
    if (_____.session.privacy.vpc.maskFonts) {
        _____.randFonts = {
            noise: function () {
                let result;
                let font_noise = _____.getStorage('font_noise', undefined, { domain: _____.partition });
                if (font_noise) {
                    result = font_noise;
                } else {
                    let SIGN = Math.random() < Math.random() ? -1 : 1;
                    result = Math.floor(Math.random() + SIGN * Math.random());
                    _____.setStorage('font_noise', result, { domain: _____.partition });
                }
                return result;
            },
            sign: function () {
                const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
                let index;
                let font_sign = _____.getStorage('font_sign', undefined, { domain: _____.partition });
                if (font_sign) {
                    index = font_sign;
                } else {
                    index = Math.floor(Math.random() * tmp.length);
                    _____.setStorage('font_sign', index, { domain: _____.partition });
                }

                return tmp[index];
            },
        };
        _____.__define(HTMLElement.prototype, 'offsetHeight', {
            get() {
                const height = Math.floor(this.getBoundingClientRect().height);
                const valid = height && _____.randFonts.sign() === 1;
                const result = valid ? height + _____.randFonts.noise() : height;
                return result;
            },
        });
        _____.__define(HTMLElement.prototype, 'offsetWidth', {
            get() {
                const width = Math.floor(this.getBoundingClientRect().width);
                const valid = width && _____.randFonts.sign() === 1;
                const result = valid ? width + _____.randFonts.noise() : width;
                return result;
            },
        });
    }
}

(function queryLocalFonts() {
    if (window.queryLocalFonts) {
        const original = window.queryLocalFonts;

        const handler = {
            apply(target, thisArg, args) {
                let arr = [
                    {
                        family: 'Arial',
                        fullName: 'Arial Regular',
                        postscriptName: 'ArialMT',
                    },

                    {
                        family: 'Calibri',
                        fullName: 'Calibri Regular',
                        postscriptName: 'Calibri',
                    },

                    {
                        family: 'Segoe UI',
                        fullName: 'Segoe UI Regular',
                        postscriptName: 'SegoeUI',
                    },
                ];
                let fontsList = [...arr];
                for (let index = 0; index < 152; index++) {
                    arr.forEach((f) => {
                        fontsList.push({
                            family: f.family + ' ' + index + 1,
                            fullName: f.fullName + ' ' + index + 1,
                            postscriptName: f.postscriptName + ' ' + index + 1,
                        });
                    });
                }
                return new Promise((resolve, reject) => {
                    resolve(fontsList);
                });
            },
        };

        const proxied = new Proxy(original, handler);

        Object.defineProperty(window, 'queryLocalFonts', {
            value: proxied,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        _____.__toString(proxied, original.toString());
    }
})();


                if (_____.session.privacy.vpc.maskBattery) {
                    let s = navigator.getBattery?.toString();
                    _____.navigator.getBattery = function () {
                        return new Promise((ok, err) => {
                            let bm = Object.create(BatteryManager.prototype);
                            _____.__setConstValue(bm, 'charging', ['', null, true, false][_____.maxOf(_____.sessionId(), 3)]);
                            _____.__setConstValue(bm, 'chargingTime', _____.maxOf(_____.sessionId(), 100));
                            _____.__setConstValue(bm, 'dischargingTime', 0);
                            _____.__setConstValue(bm, 'level', _____.maxOf(_____.sessionId(), 100) / 100);
                            _____.__setConstValue(bm, 'onchargingchange', null);
                            _____.__setConstValue(bm, 'onchargingtimechange', null);
                            _____.__setConstValue(bm, 'ondischargingtimechange', null);
                            _____.__setConstValue(bm, 'onlevelchange', null);

                            ok(bm);
                        });
                    };
                    _____.__setConstValue(_____.navigator.getBattery, 'toString', () => s);
                }

                if (_____.session.privacy.vpc.dnt) {
                    _____.navigator.doNotTrack = '1';
                } else {
                    _____.navigator.doNotTrack = '0';
                }

                if (_____.isMemoryMode) {
                    _____.__setConstValue(window, 'RequestFileSystem', function (arg1, arg2, callback, error) {
                        callback({
                            name: document.location.origin + ':' + arg1,
                            root: {
                                fullPath: '/',
                                isDirectory: true,
                                isFile: false,
                                name: '',
                            },
                        });
                    });

                    _____.navigator.storage = Object.create(Object.getPrototypeOf(navigator.storage || {}));
                    _____.__setConstValue(_____.navigator.storage, 'estimate', function () {
                        return new Promise((resolve, reject) => {
                            resolve({
                                usage: _____.random(1 * 1024, 1 * 1024 * 1024),
                                quota: _____.navigator.deviceMemory * 1024 * 1024 * 1024,
                            });
                        });
                    });
                    _____.__setConstValue(_____.navigator.storage, 'persisted', async () => false);
                    _____.__setConstValue(_____.navigator.storage, 'persist', async () => false);
                    try {
                        _____.__setConstValue(window, 'localStorage', window.sessionStorage);
                    } catch (error) {
                        _____.log(error);
                    }

                    window.indexedDB = {
                        open: () => {
                            let db = {};
                            setTimeout(() => {
                                if (db.onsuccess) {
                                    db.onsuccess();
                                }
                            }, 1000);
                            return db;
                        },
                    };
                }

                _____.log('.... [ Finger Printing ON ] .... ' + document.location.href);
            }
        })();

        try {
            if (_____.var.blocking.javascript.custom_local_storage && localStorage) {
                _____.localStorage = window.localStorage;
                _____.__setConstValue(window, 'localStorage', {
                    setItem: function (key, value) {
                        return _____.localStorage.setItem(key, value);
                    },
                    getItem: function (key) {
                        let value = _____.localStorage.getItem(key);
                        return value;
                    },
                    get length() {
                        return _____.localStorage.length;
                    },
                    removeItem: function (key) {
                        return _____.localStorage.removeItem(key);
                    },
                    clear: function () {
                        return _____.localStorage.clear();
                    },
                    key: function (index) {
                        return _____.localStorage.key(index);
                    },
                });
            }
        } catch (error) {
            _____.log(error);
        }

        try {
            if (_____.var.blocking.javascript.custom_session_storage && sessionStorage) {
                _____.sessionStorage = window.sessionStorage;

                let hack = {
                    setItem: function (key, value) {
                        return _____.sessionStorage.setItem(key, value);
                    },
                    getItem: function (key) {
                        let value = _____.sessionStorage.getItem(key);
                        return value;
                    },
                    get length() {
                        return _____.sessionStorage.length;
                    },
                    removeItem: function (key) {
                        return _____.sessionStorage.removeItem(key);
                    },
                    clear: function () {
                        return _____.sessionStorage.clear();
                    },
                    key: function (index) {
                        return _____.sessionStorage.key(index);
                    },
                };

                _____.__setConstValue(window, 'sessionStorage', hack);
            }
        } catch (error) {
            _____.log(error);
        }

        _____.on('$download_item', (e, dl) => {
            if (dl.status === 'delete') {
                _____.showDownloads();
            } else {
                _____.showDownloads(` ${dl.status} ${((dl.received / dl.total) * 100).toFixed(2)} %  ${dl.name} ( ${(dl.received / 1000000).toFixed(2)} MB / ${(dl.total / 1000000).toFixed(2)} MB )`);
                if (typeof dl.progress != 'undefined') {
                    dl.progress = parseFloat(dl.progress || 0);
                    _____.window.setProgressBar(dl.progress || 0);
                }
            }
        });

        _____.on('[window-action]', (e, data) => {
            if (data.name == 'toggle-page-images') {
                _____.togglePageImages();
            } else if (data.name == 'toggle-page-content') {
                _____.togglePageContent();
            } else if (data.name == 'new-window') {
                let defaultUserAgent = _____.getRandomBrowser('pc');
                _____.ipc('[open new popup]', {
                    partition: _____.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: defaultUserAgent,
                    width: defaultUserAgent.screen.width,
                    height: defaultUserAgent.screen.height,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'open-in-ghost-window') {
                let browser = _____.getRandomBrowser('pc');
                let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                _____.ipc('[open new popup]', {
                    partition: ghost,
                    user_name: ghost,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    vpc: _____.generateVPC('pc'),
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    iframe: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-ghost-mobile-window') {
                let browser = _____.getRandomBrowser('mobile');
                let ghost = _____.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + _____.tempMailServer;
                _____.ipc('[open new popup]', {
                    partition: ghost,
                    user_name: ghost,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    vpc: _____.generateVPC('mobile', 'chrome'),
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    iframe: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-insecure-window') {
                _____.ipc('[open new popup]', {
                    partition: _____.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    security: false,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-sandbox-window') {
                _____.ipc('[open new popup]', {
                    partition: _____.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    sandbox: true,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-ads-window') {
                _____.ipc('[open new popup]', {
                    partition: _____.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    allowAds: true,
                    allowPopup: true,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-off-window') {
                _____.ipc('[open new popup]', {
                    partition: _____.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    off: true,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-mobile-window') {
                let browser = _____.getRandomBrowser('mobile');
                _____.ipc('[open new popup]', {
                    partition: _____.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'open-external') {
                _____.openExternal(data.url);
            } else if (data.name == 'open-in-chrome') {
                _____.openInChrome({ allowStorage: false });
            } else if (data.name == 'open-in-chrome-session') {
                _____.openInChrome({ allowStorage: true });
            } else if (data.name == 'play-video') {
                let video = document.querySelector('video');
                if (video) {
                    video.play();
                }
            } else if (data.name == 'pause-video') {
                let video = document.querySelector('video');
                if (video) {
                    video.pause();
                }
            } else if (data.name == 'skip-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        video.currentTime = parseFloat(video.duration);
                        setTimeout(() => {
                            video.dispatchEvent(new Event('ended'));
                        }, 200);
                    } catch (error) {
                        _____.log(error);
                    }
                }
            } else if (data.name == 'reset-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        video.currentTime = 0;
                    } catch (error) {
                        _____.log(error);
                    }
                }
            } else if (data.name == '+10s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime + 10;
                        if (newTime <= video.duration) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        _____.log(error);
                    }
                }
            } else if (data.name == '+60s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime + 60;
                        if (newTime <= video.duration) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        _____.log(error);
                    }
                }
            } else if (data.name == '-10s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime - 10;
                        if (newTime >= 0) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        _____.log(error);
                    }
                }
            } else if (data.name == '-60s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime - 60;
                        if (newTime >= 0) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        _____.log(error);
                    }
                }
            } else if (data.name == 'full-screen-video') {
                let video = document.querySelector('#vplayer:has(video) , .jwplayer:has(video) , .player:has(video)  , video');
                if (video) {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        if (document.fullscreenEnabled) {
                            video
                                .requestFullscreen()
                                .then(() => {
                                    if (video.tagName == 'VIDEO') {
                                        video.setAttribute('controls', 'controls');
                                    }
                                })
                                .catch((err) => _____.log(err));
                        }
                    }
                }
            } else if (data.name == 'tv-mode') {
                _____.allowTvMode();
            } else if (data.name == 'toggle-page-images') {
                _____.togglePageImages();
            } else if (data.name == 'toggle-page-images') {
                _____.togglePageImages();
            } else if (data.name == 'translate') {
                _____.allowGoogleTranslate();
            } else if (data.name == 'screen-shot') {
                _____.$screenshot();
            } else if (data.name == 'save-page') {
                _____.showUserMessage('Page Saving <br> ' + document.location.href);
                _____.webContents.downloadURL(document.location.href);
            }
        });

        _____.allowTvMode = function () {
            clearTimeout(_____.allowTvModeTimeout);

            if (document.querySelector('video[src*="//"]')) {
                document.querySelectorAll(':not(:has(video[src*="//"]))').forEach((el) => {
                    if (!el.tagName.like('*video*|*head*|*style*|*meta*|*link*|*source*')) {
                        el.remove();
                    } else if (el.tagName == 'VIDEO') {
                        el.id = 'ghost_' + Date.now();
                        el.className = '';
                        document.querySelectorAll('#vplayer,#video_player,.jwplayer').forEach((jw) => {
                            jw.className = '';
                        });

                        clearInterval(_____.setVideoStyleInterval);
                        _____.setVideoStyleInterval = setInterval(() => {
                            el.setAttribute('controls', 'controls');
                            el.removeAttribute('controlslist');
                            el.style.position = 'fixed';
                            el.style.top = 0;
                            el.style.bottom = 0;
                            el.style.right = 0;
                            el.style.left = 0;
                            el.style.width = '100vw';
                            el.style.height = '100vh';
                            el.style.zIndex = 9999999999999;
                            el.style.background = '#272727';
                        }, 50);
                    }
                });
            } else if (document.querySelector('video source[src*="//"]')) {
                document.querySelectorAll(':not(:has(video source[src*="//"]))').forEach((el) => {
                    if (!el.tagName.like('*video*|*head*|*style*|*meta*|*link*|*source*')) {
                        el.remove();
                    } else if (el.tagName == 'VIDEO') {
                        el.id = 'ghost_' + Date.now();
                        el.className = '';
                        document.querySelectorAll('#vplayer,#video_player,.jwplayer').forEach((jw) => {
                            jw.className = '';
                        });

                        clearInterval(_____.setVideoStyleInterval);
                        _____.setVideoStyleInterval = setInterval(() => {
                            el.setAttribute('controls', 'controls');
                            el.removeAttribute('controlslist');
                            el.style.position = 'fixed';
                            el.style.top = 0;
                            el.style.bottom = 0;
                            el.style.right = 0;
                            el.style.left = 0;
                            el.style.width = '100vw';
                            el.style.height = '100vh';
                            el.style.zIndex = 9999999999999;
                            el.style.background = '#272727';
                        }, 50);
                    }
                });
            }
            _____.allowTvModeTimeout = setTimeout(() => {
                _____.allowTvMode();
            }, 1000);
        };

        _____.togglePageImages = function () {
            _____.pageImagesVisable = !_____.pageImagesVisable;
            clearInterval(_____.pageImagesVisableInterval);
            _____.pageImagesVisableInterval = setInterval(() => {
                document.querySelectorAll('img,image').forEach((img) => {
                    if (_____.pageImagesVisable) {
                        img.style.visibility = 'hidden';
                    } else {
                        img.style.visibility = 'visible';
                    }
                });
            }, 500);
        };
        _____.togglePageContent = function () {
            _____.pageImagesContent = !_____.pageImagesContent;
            clearTimeout(_____.pageImagesContentTimeout);
            document.querySelectorAll('html').forEach((html) => {
                if (_____.pageImagesContent) {
                    html.style.opacity = 0;
                } else {
                    html.style.opacity = 1;
                }
            });
        };
        _____.on('[toggle-window-edit]', (e, data) => {
            _____.toggleWindowEditStatus = !_____.toggleWindowEditStatus;
            let html = document.querySelector('html');
            if (html) {
                if (_____.toggleWindowEditStatus) {
                    html.contentEditable = true;
                    html.style.border = '10px dashed green';
                    _____.alert('Edit Mode Activated');
                } else {
                    html.contentEditable = 'inherit';
                    html.style.border = '0px solid white';
                }
            }
        });

        _____.on('[send-render-message]', (event, data) => {
            if (data.name == 'update-target-url') {
                _____.showInfo(data.url);
            } else if (data.name == '[open new popup]') {
                _____.ipc('[open new popup]', data);
            } else if (data.name == '[show-user-message]') {
                _____.showUserMessage(data.message);
            } else if (data.name == 'location.replace') {
                window.location.replace(data.url);
            } else {
                console.log(data);
            }
        });

        _____.on('[alert]', (event, data) => {
            _____.alert(data.message);
        });
        _____.on('[show-user-message]', (event, data) => {
            _____.showUserMessage(data.message);
        });
        _____.on('[update-browser-var]', (e, res) => {
            if (res.options.name == 'user_data_input') {
                _____.var.user_data_input = [];
                res.options.data.forEach((d) => {
                    if (document.location.href.indexOf(d.hostname) !== -1) {
                        _____.var.user_data_input.push(d);
                    }
                });

                return;
            }

            if (res.options.name == 'user_data') {
                _____.var.user_data = [];
                res.options.data.forEach((d) => {
                    if (document.location.href.indexOf(d.hostname) !== -1) {
                        _____.var.user_data.push(d);
                    }
                });

                return;
            }

            _____.var[res.options.name] = res.options.data;
            if (_____.onVarUpdated) {
                _____.onVarUpdated(res.options.name, res.options.data);
            }

            _____.callEvent('updated', { name: res.options.name });
        });
        _____.onShare((data) => {
            if (data == '[hide-main-window]' && _____.customSetting.windowType == 'main') {
                _____.window.hide();
            }
            if (data == '[show-main-window]' && _____.customSetting.windowType == 'main') {
                _____.window.show();
            }
        });

        _____.onMessage((message) => {
            if (message.name == 'new-video-exists') {
                let index = _____.video_list.findIndex((v0) => v0.src == message.src);
                if (index === -1) {
                    _____.video_list.push({
                        src: message.src,
                    });
                }
            } else if (message.name == '[allowDefaultWorker]') {
                _____.allowDefaultWorker = true;
            } else if (message.name == '[user-message]') {
                if (!_____.isIframe()) {
                    _____.showUserMessage(message.message);
                }
            } else if (message.name == '[recaptcha-detected]') {
                _____.captchaDetected = true;
                _____.showUserMessage('recaptcha Detected');
                _____.run2Captcha();
            } else if (message.name == '[captcha-detected]') {
                _____.captchaDetected = true;
                _____.showUserMessage('captcha Detected');
            } else if (message.name == '2captcha_in') {
                if (!_____.isIframe()) {
                    _____.fetch2Captcha_in(message);
                }
            } else if (message.name == '2captcha_res') {
                if (!_____.isIframe()) {
                    _____.fetch2Captcha_res(message);
                }
            } else if (message.name == '2captcha_request') {
                _____.fetch2Captcha_request(message);
            } else if (message.name == 'captcha_solved') {
                function getRecaptchaCallback() {
                    for (let item_key in ___grecaptcha_cfg.clients[0]) {
                        if (___grecaptcha_cfg.clients[0][item_key]) {
                            if (___grecaptcha_cfg.clients[0][item_key].hasOwnProperty(item_key)) {
                                if (___grecaptcha_cfg.clients[0][item_key][item_key].hasOwnProperty('callback')) {
                                    return ___grecaptcha_cfg.clients[0][item_key][item_key];
                                }
                            }
                        }
                    }
                }

                let callback2Captcha = null;

                if (typeof ___grecaptcha_cfg !== 'undefined') {
                    callback2Captcha = getRecaptchaCallback();
                    if (callback2Captcha) {
                        if (typeof callback2Captcha.callback === 'function') {
                            callback2Captcha.callback(message.response);
                        } else if (typeof callback2Captcha.callback === 'string' && window[callback2Captcha.callback] && typeof window[callback2Captcha.callback] === 'function') {
                            window[callback2Captcha.callback](message.response);
                        }
                    }
                }
                if (!callback2Captcha) {
                    let reCaptcha = _____.$('.g-recaptcha');
                    if (reCaptcha) {
                        let reCaptchaCallback = reCaptcha.dataset.callback;
                        if (reCaptchaCallback) {
                            window[reCaptchaCallback]();
                        }
                    }
                }
            }
        });

        _____.navigator.clipboard = Object.create(Object.getPrototypeOf(navigator.clipboard || {}));
        _____.__setConstValue(_____.navigator.clipboard, 'writeText', _____.copy);

        if (_____.window.eval) {
            _____.eval(_____.window.eval);
        }

        if (_____.customSetting.eval) {
            _____.eval(_____.customSetting.eval);
        }

        if (_____.customSetting.script && _____.customSetting.script.preload) {
            _____.runUserScript(_____.customSetting.script);
        }

        if (!document.location.href.like('*127.0.0.1:60080*')) {
            _____.var.scriptList.forEach((_script) => {
                if (_script.auto && _script.preload && document.location.href.like(_script.allowURLs) && !document.location.href.like(_script.blockURLs)) {
                    if (_____.isIframe()) {
                        if (_script.iframe) {
                            _____.runUserScript(_script);
                        }
                    } else {
                        if (_script.window) {
                            _____.runUserScript(_script);
                        }
                    }
                }
            });
        }

        _____.onLoad(() => {
            _____.url = document.location.href;

            (function urlChanged() {
                setInterval(() => {
                    if (_____.url !== document.location.href) {
                        _____.url = document.location.href;
                        window.dispatchEvent(new CustomEvent('urlchange'));
                        if (window.onurlchange && typeof window.onurlchange == 'function') {
                            window.onurlchange();
                        }
                    }
                }, 1000);
            })();

            if (_____.customSetting.script && !_____.customSetting.script.preload) {
                _____.runUserScript(_____.customSetting.script);
            }

            _____.$$('script[type="social-code"]').forEach((script) => {
                let code123 = script.innerText;
                let code = _____.from123(code123);
                _____.eval(code);
            });

            if (!document.location.href.like('*127.0.0.1:60080*')) {
                _____.var.scriptList.forEach((_script) => {
                    if (_script.auto && !_script.preload && document.location.href.like(_script.allowURLs) && !document.location.href.like(_script.blockURLs)) {
                        if (_____.isIframe()) {
                            if (_script.iframe) {
                                _____.runUserScript(_script);
                            }
                        } else {
                            if (_script.window) {
                                _____.runUserScript(_script);
                            }
                        }
                    }
                });
            }

            setInterval(() => {
                document.querySelectorAll('video , video source').forEach((node) => {
                    if (node.src) {
                        _____.sendMessage({
                            name: 'new-video-exists',
                            src: node.src,
                        });
                    }
                });
            }, 1000);
        });
    })();

    (function loadOnlineUserJS() {
        _____.installUserJS = function (url) {
            let index = _____.var.scriptList.findIndex((s) => s.id == url);
            if (index == -1) {
                _____.alert('User Script installing ...');

                _____.fetch({ url: url }).then((res) => {
                    if (res.status == 200 && res.headers['content-type'] && res.headers['content-type'][0].contain('javascript') && res.body) {
                        let script = { allowURLs: '*://*', auto: true, show: true, window: true, iframe: true, blockURLs: '' };
                        script.js = res.body;
                        script.meta = _____.getUserScriptMeta(script.js);
                        if (script.meta.name) {
                            script.id = url;

                            if (script.meta.match) {
                                script.allowURLs = script.meta.match;
                            } else if (script.meta.include) {
                                script.allowURLs = script.meta.include;
                            }
                            if (script.meta.name) {
                                script.title = script.meta.name;
                            }
                            if (script.meta.exclude) {
                                script.blockURLs = script.meta.exclude;
                            }
                            if (typeof script.meta.noframes !== 'undefined') {
                                script.iframe = false;
                            }
                            _____.var.scriptList.push(script);
                            _____.updateBrowserVar('scriptList', _____.var.scriptList);
                            _____.alert('User Script installed : ' + script.meta.name);
                        } else {
                            _____.alert('User Script install failed : No name found in meta');
                        }
                    }
                });
            } else {
                _____.alert('User Script already installed ');
            }
        };

        _____.onLoad(() => {
            _____.on('[install-user.js]', (event, message) => {
                _____.installUserJS(message.url);
            });
        });
    })();

    (function handleChromeObject() {
    if (_____.chromeExtensionDetected || _____.customSetting.chrome || document.location.href.like('*chrome-extension://*')) {
        if (_____.chromeExtensionDetected && !_____.customSetting.allowCrossOrigin) {
            _____.customSetting.allowCrossOrigin = true;
            _____.window.reload();
        }
        (function loadChromExtention() {
            _____.log('chrome-extension Init ...');
            let injectExtensionAPIs = () => {
                var formatIpcName = (name) => `crx-${name}`;
                var listenerMap = new Map();

                var addExtensionListener = (extensionId, name, callback) => {
                    const listenerCount = listenerMap.get(name) || 0;
                    if (listenerCount === 0) {
                        _____.ipc('crx-add-listener', extensionId, name);
                    }
                    listenerMap.set(name, listenerCount + 1);
                    _____.ipcRenderer.addListener(formatIpcName(name), function (event, ...args) {
                        if (true) {
                            _____.log(name, '(result)', ...args);
                        }
                        callback(...args);
                    });
                };
                var removeExtensionListener = (extensionId, name, callback) => {
                    if (listenerMap.has(name)) {
                        const listenerCount = listenerMap.get(name) || 0;
                        if (listenerCount <= 1) {
                            listenerMap.delete(name);
                            _____.ipc('crx-remove-listener', extensionId, name);
                        } else {
                            listenerMap.set(name, listenerCount - 1);
                        }
                    }
                    _____.ipcRenderer.removeListener(formatIpcName(name), callback);
                };

                const invokeExtension = async function (extensionId, fnName, options = {}, ...args) {
                    const callback = typeof args[args.length - 1] === 'function' ? args.pop() : void 0;
                    if (true) {
                        _____.log(fnName, args);
                    }
                    if (options.noop) {
                        console.warn(`${fnName} is not yet implemented.`);
                        if (callback) callback(options.defaultResponse);
                        return Promise.resolve(options.defaultResponse);
                    }
                    if (options.serialize) {
                        args = options.serialize(...args);
                    }
                    let result;
                    try {
                        result = await _____.invoke('[crx]', { extensionId: extensionId, fnName: fnName, args: args });
                    } catch (e) {
                        console.error(e);
                        result = void 0;
                    }
                    if (true) {
                        _____.log(fnName, '(result)', result);
                    }
                    if (callback) {
                        callback(result);
                    } else {
                        return result;
                    }
                };
                const connectNative = (extensionId, application, receive, disconnect, callback) => {
                    const connectionId = _____.contextBridge.executeInMainWorld({
                        func: () => crypto.randomUUID(),
                    });
                    invokeExtension(extensionId, 'runtime.connectNative', {}, connectionId, application);
                    const onMessage = (_event, message) => {
                        receive(message);
                    };
                    _____.on(`crx-native-msg-${connectionId}`, onMessage);
                    _____.once(`crx-native-msg-${connectNative}-disconnect`, () => {
                        _____.off(`crx-native-msg-${connectionId}`, onMessage);
                        disconnect();
                    });
                    const send = (message) => {
                        _____.ipc(`crx-native-msg-${connectionId}`, message);
                    };
                    callback(connectionId, send);
                };
                const disconnectNative = (extensionId, connectionId) => {
                    invokeExtension(extensionId, 'runtime.disconnectNative', {}, connectionId);
                };
                const electronContext = {
                    invokeExtension,
                    addExtensionListener,
                    removeExtensionListener,
                    connectNative,
                    disconnectNative,
                };

                function mainWorldScript() {
                    const chrome = globalThis.chrome || { runtime: { id: _____.window.id, getManifest: () => {} } };
                    const extensionId = chrome.runtime?.id;
                    const manifest = (extensionId && chrome.runtime.getManifest()) || {};
                    const invokeExtensionHandle =
                        (fnName, opts = {}) =>
                        (...args) =>
                            electronContext.invokeExtension(extensionId, fnName, opts, ...args);
                    function imageData2base64(imageData) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return null;
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);
                        return canvas.toDataURL();
                    }
                    class ExtensionEvent {
                        constructor(name) {
                            this.name = name;
                        }
                        addListener(callback) {
                            electronContext.addExtensionListener(extensionId, this.name, callback);
                        }
                        removeListener(callback) {
                            electronContext.removeExtensionListener(extensionId, this.name, callback);
                        }
                        getRules(ruleIdentifiers, callback) {
                            throw new Error('Method not implemented.');
                        }
                        hasListener(callback) {
                            throw new Error('Method not implemented.');
                        }
                        removeRules(ruleIdentifiers, callback) {
                            throw new Error('Method not implemented.');
                        }
                        addRules(rules, callback) {
                            throw new Error('Method not implemented.');
                        }
                        hasListeners() {
                            throw new Error('Method not implemented.');
                        }
                    }
                    class ChromeSetting {
                        constructor() {
                            this.onChange = {
                                addListener: () => {},
                            };
                        }
                        set() {}
                        get() {}
                        clear() {}
                    }
                    class Event {
                        constructor() {
                            this.listeners = [];
                        }
                        _emit(...args) {
                            this.listeners.forEach((listener) => {
                                listener(...args);
                            });
                        }
                        addListener(callback) {
                            this.listeners.push(callback);
                        }
                        removeListener(callback) {
                            const index = this.listeners.indexOf(callback);
                            if (index > -1) {
                                this.listeners.splice(index, 1);
                            }
                        }
                    }
                    class NativePort {
                        constructor() {
                            this.connectionId = '';
                            this.connected = false;
                            this.pending = [];
                            this.name = '';
                            this._init = (connectionId, send) => {
                                this.connected = true;
                                this.connectionId = connectionId;
                                this._send = send;
                                this.pending.forEach((msg) => this.postMessage(msg));
                                this.pending = [];
                                Object.defineProperty(this, '_init', { value: void 0 });
                            };
                            this.onMessage = new Event();
                            this.onDisconnect = new Event();
                        }
                        _send(message) {
                            this.pending.push(message);
                        }
                        _receive(message) {
                            this.onMessage._emit(message);
                        }
                        _disconnect() {
                            this.disconnect();
                        }
                        postMessage(message) {
                            this._send(message);
                        }
                        disconnect() {
                            if (this.connected) {
                                electronContext.disconnectNative(extensionId, this.connectionId);
                                this.onDisconnect._emit();
                                this.connected = false;
                            }
                        }
                    }
                    const browserActionFactory = (base) => {
                        const api = {
                            ...base,
                            setTitle: invokeExtensionHandle('browserAction.setTitle'),
                            getTitle: invokeExtensionHandle('browserAction.getTitle'),
                            setIcon: invokeExtensionHandle('browserAction.setIcon', {
                                serialize: (details) => {
                                    if (details.imageData) {
                                        if (manifest.manifest_version === 3) {
                                            console.warn('action.setIcon with imageData is not yet supported by electron-chrome-extensions');
                                            details.imageData = void 0;
                                        } else if (details.imageData instanceof ImageData) {
                                            details.imageData = imageData2base64(details.imageData);
                                        } else {
                                            details.imageData = Object.entries(details.imageData).reduce((obj, pair) => {
                                                obj[pair[0]] = imageData2base64(pair[1]);
                                                return obj;
                                            }, {});
                                        }
                                    }
                                    return [details];
                                },
                            }),
                            setPopup: invokeExtensionHandle('browserAction.setPopup'),
                            getPopup: invokeExtensionHandle('browserAction.getPopup'),
                            setBadgeText: invokeExtensionHandle('browserAction.setBadgeText'),
                            getBadgeText: invokeExtensionHandle('browserAction.getBadgeText'),
                            setBadgeBackgroundColor: invokeExtensionHandle('browserAction.setBadgeBackgroundColor'),
                            getBadgeBackgroundColor: invokeExtensionHandle('browserAction.getBadgeBackgroundColor'),
                            getUserSettings: invokeExtensionHandle('browserAction.getUserSettings'),
                            enable: invokeExtensionHandle('browserAction.enable', { noop: true }),
                            disable: invokeExtensionHandle('browserAction.disable', { noop: true }),
                            openPopup: invokeExtensionHandle('browserAction.openPopup'),
                            onClicked: new ExtensionEvent('browserAction.onClicked'),
                        };
                        return api;
                    };

                    const apiDefinitions = {
                        action: {
                            shouldInject: () => manifest.manifest_version === 3 && !!manifest.action,
                            factory: browserActionFactory,
                        },
                        browserAction: {
                            shouldInject: () => manifest.manifest_version === 2 && !!manifest.browser_action,
                            factory: browserActionFactory,
                        },
                        commands: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    getAll: invokeExtensionHandle('commands.getAll'),
                                    onCommand: new ExtensionEvent('commands.onCommand'),
                                };
                            },
                        },
                        contextMenus: {
                            factory: (base) => {
                                let menuCounter = 0;
                                const menuCallbacks = {};
                                const menuCreate = invokeExtensionHandle('contextMenus.create');
                                let hasInternalListener = false;
                                const addInternalListener = () => {
                                    api.onClicked.addListener((info, tab) => {
                                        const callback = menuCallbacks[info.menuItemId];
                                        if (callback && tab) callback(info, tab);
                                    });
                                    hasInternalListener = true;
                                };
                                const api = {
                                    ...base,
                                    create: function (createProperties, callback) {
                                        if (typeof createProperties.id === 'undefined') {
                                            createProperties.id = `${++menuCounter}`;
                                        }
                                        if (createProperties.onclick) {
                                            if (!hasInternalListener) addInternalListener();
                                            menuCallbacks[createProperties.id] = createProperties.onclick;
                                            delete createProperties.onclick;
                                        }
                                        menuCreate(createProperties, callback);
                                        return createProperties.id;
                                    },
                                    update: invokeExtensionHandle('contextMenus.update', { noop: true }),
                                    remove: invokeExtensionHandle('contextMenus.remove'),
                                    removeAll: invokeExtensionHandle('contextMenus.removeAll'),
                                    onClicked: new ExtensionEvent('contextMenus.onClicked'),
                                };
                                return api;
                            },
                        },
                        cookies: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    get: invokeExtensionHandle('cookies.get'),
                                    getAll: invokeExtensionHandle('cookies.getAll'),
                                    set: invokeExtensionHandle('cookies.set'),
                                    remove: invokeExtensionHandle('cookies.remove'),
                                    getAllCookieStores: invokeExtensionHandle('cookies.getAllCookieStores'),
                                    onChanged: new ExtensionEvent('cookies.onChanged'),
                                };
                            },
                        },
                        downloads: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    acceptDanger: invokeExtensionHandle('downloads.acceptDanger', { noop: true }),
                                    cancel: invokeExtensionHandle('downloads.cancel', { noop: true }),
                                    download: invokeExtensionHandle('downloads.download', { noop: true }),
                                    erase: invokeExtensionHandle('downloads.erase', { noop: true }),
                                    getFileIcon: invokeExtensionHandle('downloads.getFileIcon', { noop: true }),
                                    open: invokeExtensionHandle('downloads.open', { noop: true }),
                                    pause: invokeExtensionHandle('downloads.pause', { noop: true }),
                                    removeFile: invokeExtensionHandle('downloads.removeFile', { noop: true }),
                                    resume: invokeExtensionHandle('downloads.resume', { noop: true }),
                                    search: invokeExtensionHandle('downloads.search', { noop: true }),
                                    setUiOptions: invokeExtensionHandle('downloads.setUiOptions', { noop: true }),
                                    show: invokeExtensionHandle('downloads.show', { noop: true }),
                                    showDefaultFolder: invokeExtensionHandle('downloads.showDefaultFolder', { noop: true }),
                                    onChanged: new ExtensionEvent('downloads.onChanged'),
                                    onCreated: new ExtensionEvent('downloads.onCreated'),
                                    onDeterminingFilename: new ExtensionEvent('downloads.onDeterminingFilename'),
                                    onErased: new ExtensionEvent('downloads.onErased'),
                                };
                            },
                        },
                        extension: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    isAllowedFileSchemeAccess: invokeExtensionHandle('extension.isAllowedFileSchemeAccess', {
                                        noop: true,
                                        defaultResponse: false,
                                    }),
                                    isAllowedIncognitoAccess: invokeExtensionHandle('extension.isAllowedIncognitoAccess', {
                                        noop: true,
                                        defaultResponse: false,
                                    }),
                                    getViews: () => [],
                                };
                            },
                        },
                        i18n: {
                            shouldInject: () => manifest.manifest_version === 3,
                            factory: (base) => {
                                if (base.getMessage) {
                                    return base;
                                }
                                return {
                                    ...base,
                                    getUILanguage: () => 'en-US',
                                    getAcceptLanguages: (callback) => {
                                        const results = ['en-US'];
                                        if (callback) {
                                            queueMicrotask(() => callback(results));
                                        }
                                        return Promise.resolve(results);
                                    },
                                    getMessage: (messageName) => messageName,
                                };
                            },
                        },
                        notifications: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    clear: invokeExtensionHandle('notifications.clear'),
                                    create: invokeExtensionHandle('notifications.create'),
                                    getAll: invokeExtensionHandle('notifications.getAll'),
                                    getPermissionLevel: invokeExtensionHandle('notifications.getPermissionLevel'),
                                    update: invokeExtensionHandle('notifications.update'),
                                    onClicked: new ExtensionEvent('notifications.onClicked'),
                                    onButtonClicked: new ExtensionEvent('notifications.onButtonClicked'),
                                    onClosed: new ExtensionEvent('notifications.onClosed'),
                                };
                            },
                        },
                        permissions: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    contains: invokeExtensionHandle('permissions.contains'),
                                    getAll: invokeExtensionHandle('permissions.getAll'),
                                    remove: invokeExtensionHandle('permissions.remove'),
                                    request: invokeExtensionHandle('permissions.request'),
                                    onAdded: new ExtensionEvent('permissions.onAdded'),
                                    onRemoved: new ExtensionEvent('permissions.onRemoved'),
                                };
                            },
                        },
                        privacy: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    network: {
                                        networkPredictionEnabled: new ChromeSetting(),
                                        webRTCIPHandlingPolicy: new ChromeSetting(),
                                    },
                                    services: {
                                        autofillAddressEnabled: new ChromeSetting(),
                                        autofillCreditCardEnabled: new ChromeSetting(),
                                        passwordSavingEnabled: new ChromeSetting(),
                                    },
                                    websites: {
                                        hyperlinkAuditingEnabled: new ChromeSetting(),
                                    },
                                };
                            },
                        },
                        runtime: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    connectNative: (application) => {
                                        const port = new NativePort();
                                        const receive = port._receive.bind(port);
                                        const disconnect = port._disconnect.bind(port);
                                        const callback = (connectionId, send) => {
                                            port._init(connectionId, send);
                                        };
                                        electronContext.connectNative(extensionId, application, receive, disconnect, callback);
                                        return port;
                                    },
                                    openOptionsPage: invokeExtensionHandle('runtime.openOptionsPage'),
                                    sendNativeMessage: invokeExtensionHandle('runtime.sendNativeMessage'),
                                    connect: null,
                                    fnEventList: [],
                                    onMessage: {
                                        addEventListener: function (...args) {
                                            _____.log('chrome addEventListener', args);
                                            this.fnEventList.push(...args);
                                        },
                                        removeEventListener: function (...args) {
                                            _____.log('chrome removeEventListener', args);
                                            this.fnEventList.push(...args);
                                        },
                                    },

                                    sendMessage: function (...args) {
                                        _____.log('chrome sendMessage', args);
                                        args.forEach((arg) => {
                                            if (typeof arg === 'function') {
                                                _____.log('chrome sendMessage function', arg);
                                                arg(...args);
                                            }
                                        });
                                        this.fnEventList.forEach((fnItem) => {
                                            for (const key in fnItem) {
                                                if (typeof fnItem[key] === 'function') {
                                                    fnItem[key](...args);
                                                }
                                            }
                                        });

                                        if (_____.backgroundWorker) {
                                            _____.backgroundWorker.postMessage2(...args);
                                        }
                                    },
                                    id: _____.window.id,
                                    getManifest: () => {},
                                };
                            },
                        },
                        storage: {
                            factory: (base) => {
                                const local = base && base.local;
                                return {
                                    ...base,
                                    managed: local,
                                    sync: local,
                                    local: { get: _____.getStorage, set: _____.setStorage },
                                };
                            },
                        },
                        tabs: {
                            factory: (base) => {
                                const api = {
                                    ...base,
                                    create: invokeExtensionHandle('tabs.create'),
                                    executeScript: async function (arg1, arg2, arg3) {
                                        if (typeof arg1 === 'object') {
                                            const [activeTab] = await api.query({
                                                active: true,
                                                windowId: chrome.windows.WINDOW_ID_CURRENT,
                                            });
                                            return api.executeScript(activeTab.id, arg1, arg2);
                                        } else {
                                            return base.executeScript(arg1, arg2, arg3);
                                        }
                                    },
                                    get: invokeExtensionHandle('tabs.get'),
                                    getCurrent: invokeExtensionHandle('tabs.getCurrent'),
                                    getAllInWindow: invokeExtensionHandle('tabs.getAllInWindow'),
                                    insertCSS: invokeExtensionHandle('tabs.insertCSS'),
                                    query: invokeExtensionHandle('tabs.query'),
                                    reload: invokeExtensionHandle('tabs.reload'),
                                    update: invokeExtensionHandle('tabs.update'),
                                    remove: invokeExtensionHandle('tabs.remove'),
                                    goBack: invokeExtensionHandle('tabs.goBack'),
                                    goForward: invokeExtensionHandle('tabs.goForward'),
                                    onCreated: new ExtensionEvent('tabs.onCreated'),
                                    onRemoved: new ExtensionEvent('tabs.onRemoved'),
                                    onUpdated: new ExtensionEvent('tabs.onUpdated'),
                                    onActivated: new ExtensionEvent('tabs.onActivated'),
                                    onReplaced: new ExtensionEvent('tabs.onReplaced'),
                                };
                                return api;
                            },
                        },
                        topSites: {
                            factory: () => {
                                return {
                                    get: invokeExtensionHandle('topSites.get', { noop: true, defaultResponse: [] }),
                                };
                            },
                        },
                        webNavigation: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    getFrame: invokeExtensionHandle('webNavigation.getFrame'),
                                    getAllFrames: invokeExtensionHandle('webNavigation.getAllFrames'),
                                    onBeforeNavigate: new ExtensionEvent('webNavigation.onBeforeNavigate'),
                                    onCommitted: new ExtensionEvent('webNavigation.onCommitted'),
                                    onCompleted: new ExtensionEvent('webNavigation.onCompleted'),
                                    onCreatedNavigationTarget: new ExtensionEvent('webNavigation.onCreatedNavigationTarget'),
                                    onDOMContentLoaded: new ExtensionEvent('webNavigation.onDOMContentLoaded'),
                                    onErrorOccurred: new ExtensionEvent('webNavigation.onErrorOccurred'),
                                    onHistoryStateUpdated: new ExtensionEvent('webNavigation.onHistoryStateUpdated'),
                                    onReferenceFragmentUpdated: new ExtensionEvent('webNavigation.onReferenceFragmentUpdated'),
                                    onTabReplaced: new ExtensionEvent('webNavigation.onTabReplaced'),
                                };
                            },
                        },
                        webRequest: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    onHeadersReceived: new ExtensionEvent('webRequest.onHeadersReceived'),
                                };
                            },
                        },
                        windows: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    WINDOW_ID_NONE: -1,
                                    WINDOW_ID_CURRENT: _____.window.id,
                                    get: invokeExtensionHandle('windows.get'),
                                    getCurrent: invokeExtensionHandle('windows.getCurrent'),
                                    getLastFocused: invokeExtensionHandle('windows.getLastFocused'),
                                    getAll: invokeExtensionHandle('windows.getAll'),
                                    create: invokeExtensionHandle('windows.create'),
                                    update: invokeExtensionHandle('windows.update'),
                                    remove: invokeExtensionHandle('windows.remove'),
                                    onCreated: new ExtensionEvent('windows.onCreated'),
                                    onRemoved: new ExtensionEvent('windows.onRemoved'),
                                    onFocusChanged: new ExtensionEvent('windows.onFocusChanged'),
                                };
                            },
                        },
                    };

                    Object.keys(apiDefinitions).forEach((key) => {
                        const apiName = key;
                        const baseApi = chrome[apiName];
                        const api = apiDefinitions[apiName];
                        if (api.shouldInject && !api.shouldInject()) return;
                        Object.defineProperty(chrome, apiName, {
                            value: api.factory(baseApi),
                            enumerable: true,
                            configurable: true,
                        });
                    });

                    chrome.csi = function () {
                        return {
                            onloadT: window.performance.timing.domContentLoadedEventEnd,
                            startE: window.performance.timing.navigationStart,
                            pageT: Date.now() - window.performance.timing.navigationStart,
                            tran: 15,
                        };
                    };
                    const ntEntryFallback = {
                        nextHopProtocol: 'h2',
                        type: 'other',
                    };
                    function toFixed(num, fixed) {
                        var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
                        return num.toString().match(re)[0];
                    }

                    chrome.loadTimes = function () {
                        return {
                            get connectionInfo() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ntEntry.nextHopProtocol;
                            },
                            get npnNegotiatedProtocol() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ['h2', 'hq'].includes(ntEntry.nextHopProtocol) ? ntEntry.nextHopProtocol : 'unknown';
                            },
                            get navigationType() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ntEntry.type;
                            },
                            get wasAlternateProtocolAvailable() {
                                return false;
                            },
                            get wasFetchedViaSpdy() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                            },
                            get wasNpnNegotiated() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                            },
                            get firstPaintAfterLoadTime() {
                                return 0;
                            },
                            get requestTime() {
                                return window.performance.timing.navigationStart / 1000;
                            },
                            get startLoadTime() {
                                return window.performance.timing.navigationStart / 1000;
                            },
                            get commitLoadTime() {
                                return window.performance.timing.responseStart / 1000;
                            },
                            get finishDocumentLoadTime() {
                                return window.performance.timing.domContentLoadedEventEnd / 1000;
                            },
                            get finishLoadTime() {
                                return window.performance.timing.loadEventEnd / 1000;
                            },
                            get firstPaintTime() {
                                const fpEntry = window.performance.getEntriesByType('paint')[0] || {
                                    startTime: window.performance.timing.loadEventEnd / 1000,
                                };
                                return toFixed((fpEntry.startTime + window.performance.timeOrigin) / 1000, 3);
                            },
                        };
                    };
                    chrome.app = {
                        isInstalled: false,
                        InstallState: {
                            DISABLED: 'disabled',
                            INSTALLED: 'installed',
                            NOT_INSTALLED: 'not_installed',
                        },
                        RunningState: {
                            CANNOT_RUN: 'cannot_run',
                            READY_TO_RUN: 'ready_to_run',
                            RUNNING: 'running',
                        },
                        isInstalled: function () {
                            return false;
                        },

                        getDetails: function () {
                            return null;
                        },
                        getIsInstalled: function () {
                            return false;
                        },
                        runningState: function () {
                            return 'cannot_run';
                        },
                    };

                    chrome.appPinningPrivate = chrome.appPinningPrivate || {
                        getPins: () => {},
                        pinPage: () => {},
                    };

                    if (!globalThis.chrome) {
                        _____.__setConstValue(window, 'chrome', chrome);
                    }
                }

                mainWorldScript();
            };

            injectExtensionAPIs();
        })();
    } else {
        if (!_____.isFirefox && !_____.isSafari) {
            const chrome = {};
            chrome.csi = function () {
                return {
                    onloadT: window.performance.timing.domContentLoadedEventEnd,
                    startE: window.performance.timing.navigationStart,
                    pageT: Date.now() - window.performance.timing.navigationStart,
                    tran: 15,
                };
            };
            const ntEntryFallback = {
                nextHopProtocol: 'h2',
                type: 'other',
            };
            function toFixed(num, fixed) {
                var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
                return num.toString().match(re)[0];
            }

            chrome.loadTimes = function () {
                return {
                    get connectionInfo() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ntEntry.nextHopProtocol;
                    },
                    get npnNegotiatedProtocol() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ['h2', 'hq'].includes(ntEntry.nextHopProtocol) ? ntEntry.nextHopProtocol : 'unknown';
                    },
                    get navigationType() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ntEntry.type;
                    },
                    get wasAlternateProtocolAvailable() {
                        return false;
                    },
                    get wasFetchedViaSpdy() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                    },
                    get wasNpnNegotiated() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                    },
                    get firstPaintAfterLoadTime() {
                        return 0;
                    },
                    get requestTime() {
                        return window.performance.timing.navigationStart / 1000;
                    },
                    get startLoadTime() {
                        return window.performance.timing.navigationStart / 1000;
                    },
                    get commitLoadTime() {
                        return window.performance.timing.responseStart / 1000;
                    },
                    get finishDocumentLoadTime() {
                        return window.performance.timing.domContentLoadedEventEnd / 1000;
                    },
                    get finishLoadTime() {
                        return window.performance.timing.loadEventEnd / 1000;
                    },
                    get firstPaintTime() {
                        const fpEntry = window.performance.getEntriesByType('paint')[0] || {
                            startTime: window.performance.timing.loadEventEnd / 1000,
                        };
                        return toFixed((fpEntry.startTime + window.performance.timeOrigin) / 1000, 3);
                    },
                };
            };
            chrome.app = {
                isInstalled: false,
                InstallState: {
                    DISABLED: 'disabled',
                    INSTALLED: 'installed',
                    NOT_INSTALLED: 'not_installed',
                },
                RunningState: {
                    CANNOT_RUN: 'cannot_run',
                    READY_TO_RUN: 'ready_to_run',
                    RUNNING: 'running',
                },
                isInstalled: function () {
                    return false;
                },

                getDetails: function () {
                    return null;
                },
                getIsInstalled: function () {
                    return false;
                },
                runningState: function () {
                    return 'cannot_run';
                },
            };

            _____.__setConstValue(window, 'chrome', chrome);
        } else {
            _____.__setConstValue(globalThis, 'chrome', undefined);
            _____.__setConstValue(window, 'chrome', undefined);
            _____.__setConstValue(window, 'test', 1000);
        }
    }
})();

     (function loadGoogleExtensions() {
        if (false) {
            _____.var.googleExtensionList.forEach((ext) => {
                if (ext.manifest.host_permissions) {
                    ext.manifest.host_permissions.forEach((host) => {
                        if (document.location.href.like(host)) {
                            ext.$approved = true;
                            _____.chromeExtensionDetected = true;
                            _____.log('Google Extension Host Permission Loaded : ' + ext.manifest.name + ' on ' + document.location.href);
                        }
                    });
                }

                ext.manifest.content_scripts.forEach((script) => {
                    script.matches.forEach((match) => {
                        if ((ext.$approved = true || document.location.href.like(match))) {
                            _____.chromeExtensionDetected = true;
                            _____.log('Google Extension Script Loaded : ' + ext.manifest.name + ' on ' + document.location.href);
                            script.js.forEach((jsfile) => {
                                let path = ext.path + '/' + jsfile;
                                let content = _____.readFile(path);

                                let bg = ext.manifest.background?.service_worker;
                                if (bg) {
                                    let path2 = ext.path + '/' + bg;
                                    let service_worker_script = _____.readFile(path2);
                                    _____.domainStorage = path2;

                                    service_worker_script = service_worker_script
                                        .replaceAll('localStorage.setItem ', '_____.setStorage')
                                        .replaceAll('localStorage.getItem', '_____.getStorage')
                                        .replaceAll('localStorage.removeItem', '_____.deleteStorage')
                                        .replaceAll('sessionStorage.setItem ', '_____.setStorage')
                                        .replaceAll('sessionStorage.getItem', '_____.getStorage')
                                        .replaceAll('sessionStorage.removeItem', '_____.deleteStorage');
                                    _____.backgroundWorker = _____.executeJavaScriptCodeInWorker(path2, service_worker_script);
                                }
                                content = content
                                    .replaceAll('localStorage.setItem ', '_____.setStorage')
                                    .replaceAll('localStorage.getItem', '_____.getStorage')
                                    .replaceAll('localStorage.removeItem', '_____.deleteStorage')
                                    .replaceAll('sessionStorage.setItem ', '_____.setStorage')
                                    .replaceAll('sessionStorage.getItem', '_____.getStorage')
                                    .replaceAll('sessionStorage.removeItem', '_____.deleteStorage');
                                _____.contentWorker = _____.executeJavaScriptCodeInWorker(path, content);
                            });
                        }
                    });
                });
            });
        }
    })();
};

_____.init = function () {
    _____.browserData = _____.ipcSync('[browser][data]', {
        partition: _____.partition,
        url: _____.href,
        domain: _____.domain,
        propertyList: _____.propertyList,
        windowID: _____._window.id,
    });

    if (_____.browserData.customSetting.isWorker && document.location.href.like('chrome-error:*')) {
        _____.ipc(
            'window.message',
            {
                windowID: _____.browserData.customSetting.parentWindowID,
                toParentFrame: _____.browserData.customSetting.parentFrame,
                data: { name: '[allowDefaultWorker]' },
                origin: '*',
            },
            true,
        );

        window.close();
        return;
    }

    _____.init2();

    if (!_____.window.newStorageSet) {
        if (_____.customSetting.localStorageList) {
            _____.customSetting.localStorageList.forEach((s) => {
                localStorage[s.key] = s.value;
            });
        }
        if (_____.customSetting.sessionStorageList) {
            _____.customSetting.sessionStorageList.forEach((s) => {
                sessionStorage[s.key] = s.value;
            });
        }
        _____.window.newStorageSet = true;
    }
    _____.onLoad(() => {
        // if(document.location.href.like('*://*/recaptcha/*')) {
        //     _____.sendMessage({ name: '[captcha-detected]' });
        // }
        if (!_____.customSetting.isWorker) {
            _____.injectDefault();
            if (_____.customSetting.allowGoogleTranslate) {
                _____.allowGoogleTranslate();
            }
            if (_____.href.like('chrome-error:*')) {
                _____.addHTML('<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" src="browser://error"></iframe>');
            }
        }
    });
};

_____._window = _____._window || _____.ipcSync('[window]');

_____._window.fnList.forEach((fn) => {
    _____._window[fn] = (...params) => _____.fn('window.' + fn, ...params);
});
_____._window.on = function () {};

_____.init();

if (!_____.javaScriptOFF) {
    if (_____.isWhiteSite) {
        for (const key in _____.navigator) {
            _____.__define(navigator, key + '0', navigator[key]);
            _____.__setConstValue(navigator, key, _____.navigator[key]);
        }
    } else {
        navigator.webdriver = false;
        _____.__define(
            globalThis,
            'navigator',
            new Proxy(navigator, {
                apply(target, thisArg, argumentsList) {
                    return Reflect.apply(target, thisArg, argumentsList);
                },
                setProperty: function (target, property, value) {
                    if (target.hasOwnProperty(property)) return target[property];
                    return (target[property] = value);
                },
                get: function (target, property, receiver) {
                    if (property === '_') {
                        return target;
                    }
                    if (property.like('*0*')) {
                        return target[property.replace('0', '')];
                    }

                    if (target[property] instanceof Function) {
                        return target[property].bind(target);
                    }

                    return Object.hasOwn(_____.navigator, property) ? _____.navigator[property] : target[property];
                },
                set: function (target, property, value) {
                    return (target[property] = value);
                },
                defineProperty(target, prop, descriptor) {
                    return Reflect.defineProperty(target, prop, descriptor);
                },
                deleteProperty: function (target, property) {
                    return false;
                },
            }),
        );
    }
}

if (!_____.javaScriptOFF) {
    (function createElement() {
    const original = document.createElement;

    const handler = {
        apply(target, thisArg, args) {
            let ele = Reflect.apply(target, thisArg, args);

            Object.defineProperty(ele, 'innerHTML2', {
                get() {
                    return this.innerHTML;
                },
                set(value) {
                    this.innerHTML = _____.policy.createHTML(value);
                },
                enumerable: true,
                configurable: true,
            });

            Object.defineProperty(ele, 'textContent2', {
                get() {
                    return this.textContent;
                },
                set(value) {
                    if (ele.tagName.like('script')) {
                        this.textContent = _____.policy.createScript(value);
                    } else {
                        this.textContent = _____.policy.createHTML(value);
                    }
                },
                enumerable: true,
                configurable: true,
            });

            Object.defineProperty(ele, 'src2', {
                get() {
                    return this.src;
                },
                set(value) {
                    if (ele.tagName.like('script')) {
                        this.src = _____.policy.createScriptURL(value);
                    } else {
                        this.src = _____.policy.createHTML(value);
                    }
                },
                enumerable: true,
                configurable: true,
            });

            if (ele.tagName.like('iframe') && !_____.isWhiteSite && !_____.javaScriptOFF) {
                Object.defineProperty(ele, 'srcdoc', {
                    get() {
                        return ele.srcdoc0;
                    },
                    set(value) {
                        ele = Reflect.apply(target, thisArg, args);
                        ele.srcdoc = value;
                        ele.srcdoc0 = value;
                        if (ele.contentWindow) {
                            attachFrameWindow(ele, ele.contentWindow);
                        }

                        return ele;
                    },
                    enumerable: true,
                    configurable: true,
                });
            }

            ele.nonce = 'social';

            return ele;
        },
    };

    const original2 = Document.prototype.createElement;
    const proxied2 = new Proxy(original2, handler);
    Document.prototype.createElement = proxied2;
    _____.__toString(proxied2, original2.toString());
})();

(function querySelector() {
    const original = document.querySelector;

    const handler = {
        apply(target, thisArg, args) {
            let ele = Reflect.apply(target, thisArg, args);

            if (ele && ele.tagName.like('iframe')) {
                if (ele.contentWindow) {
                    attachFrameWindow(ele, ele.contentWindow);
                }
            }
            return ele;
        },
    };

    const proxied = new Proxy(original, handler);

    Object.defineProperty(document, 'querySelector', {
        value: proxied,
        configurable: true,
        writable: true,
    });
    _____.__toString(proxied, original.toString());
})();

function hookFrames() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'IFRAME') {
                    attachFrame(node);
                }
            }
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });
}

function attachFrame(frame) {
    frame.addEventListener('load', () => {
        attachFrameWindow(frame, frame.contentWindow);
    });
}

function attachFrameWindow(frame, contentWindow) {
    try {
        let href = frame.src || contentWindow.location.href || document.location.href;
        let isCrossOrigin = _____.var.blocking.white_list.some((site) => site.url.length > 2 && href.like(site.url));
        if (!isCrossOrigin && !_____.isWhiteSite && !_____.javaScriptOFF && contentWindow.navigator) {
            _____.__define(
                contentWindow,
                'navigator',
                new Proxy(contentWindow.navigator, {
                    setProperty: function (target, key, value) {
                        if (target.hasOwnProperty(key)) return target[key];
                        return (target[key] = value);
                    },
                    get: function (target, key, receiver) {
                        if (key === '_') {
                            return target;
                        }

                        if (typeof target[key] === 'function') {
                            return function (...args) {
                                return target[key].apply(this === receiver ? target : this, args);
                            };
                        }
                        return Object.hasOwn(_____.navigator, key) ? _____.navigator[key] : target[key];
                    },
                    set: function (target, key, value) {
                        return this.setProperty(target, key, value);
                    },
                    defineProperty: function (target, key, desc) {
                        return this.setProperty(target, key, desc.value);
                    },
                    deleteProperty: function (target, key) {
                        return false;
                    },
                }),
            );
        }

        _____.__define(contentWindow, 'chrome', window.chrome);
        _____.__define(contentWindow, 'Date', Date);
        _____.__define(contentWindow, 'screen', screen);
        _____.__define(contentWindow, 'Intl', Intl);
        _____.__define(contentWindow, 'Worker', Worker);
        _____.__define(contentWindow.Document.prototype, 'createElement', Document.prototype.createElement);
    } catch (e) {
        // _____.log(e);
    }
}

hookFrames();

    (function maskWebSocket() {
    if (_____.customSetting.maskWebSocket) {
        const OriginalWS = window.WebSocket;

        _____.editWsMessage =
            _____.editWsMessage ||
            function (data) {
                try {
                    _____.log(data);
                    if (false && data instanceof ArrayBuffer) {
                        const view = new Uint8Array(data);
                        view[0] = 255;
                        return view.buffer;
                    }

                    return data;
                } catch {
                    return data;
                }
            };

        window.WebSocket = new Proxy(OriginalWS, {
            construct(target, args) {
                const ws = new target(...args);

                const originalAddEventListener = ws.addEventListener;

                ws.addEventListener = function (type, listener, options) {
                    if (type === 'message') {
                        const wrapped = function (event) {
                            let newData = _____.editWsMessage(event.data);

                            const fakeEvent = new MessageEvent('message', {
                                ...event,
                                data: newData,
                            });

                            return listener.call(this, fakeEvent);
                        };

                        return originalAddEventListener.call(this, type, wrapped, options);
                    }

                    return originalAddEventListener.call(this, type, listener, options);
                };

                Object.defineProperty(ws, 'onmessage', {
                    set(callback) {
                        const wrapped = function (event) {
                            let newData = _____.editWsMessage(event.data);

                            const fakeEvent = new MessageEvent('message', {
                                ...event,
                                data: newData,
                            });

                            return callback.call(this, fakeEvent);
                        };

                        this.addEventListener('message', wrapped);
                    },
                });

                const originalSend = ws.send;

                ws.send = function (data) {
                    const modified = _____.editWsMessage(data);

                    return originalSend.call(this, modified);
                };

                Object.defineProperty(ws.send, 'toString', {
                    value: () => 'function send() { [native code] }',
                });

                return ws;
            },
        });
    }
})();


    if ((_____.definePropertyTRUE = true)) {
        const nativeDefineProperty = Object.defineProperty;

        Object.defineProperty = new Proxy(nativeDefineProperty, {
            apply(target, thisArg, args) {
                const [obj, prop, descriptor] = args;

                try {
                    if (obj === navigator) {
                        if (prop === 'webdriver') {
                            Reflect.defineProperty(_____.navigator, prop, {
                                ...descriptor,
                                configurable: true,
                            });

                            return obj;
                        }

                        if (prop === 'platform') {
                            return obj;
                        }

                        if (navigator._) {
                            Reflect.defineProperty(navigator._, prop, descriptor);
                            return obj;
                        }
                    }

                    Reflect.defineProperty(obj, prop, descriptor);
                    return obj;
                } catch (e) {
                    return obj;
                }
            },
        });
    }

    if (!_____.isWhiteSite) {
        if (true) {
            function advancedCloneObject(obj, options = {}) {
                const { maxDepth = 5, includeNonEnumerable = true, includeSymbols = true, stringifyFunctions = false } = options;

                const seen = new WeakMap();

                function safeGet(obj, key) {
                    try {
                        return obj[key];
                    } catch {
                        return undefined;
                    }
                }

                function getAllKeys(obj) {
                    const keys = new Set();

                    // enumerable
                    try {
                        for (const k in obj) {
                            keys.add(k);
                        }
                    } catch {}

                    // non-enumerable
                    if (includeNonEnumerable) {
                        try {
                            Object.getOwnPropertyNames(obj).forEach((k) => keys.add(k));
                        } catch {}
                    }

                    // symbols
                    if (includeSymbols) {
                        try {
                            Object.getOwnPropertySymbols(obj).forEach((k) => keys.add(k));
                        } catch {}
                    }

                    return [...keys];
                }

                function shouldSkip(value) {
                    try {
                        if (!value || typeof value !== 'object') {
                            return false;
                        }

                        const name = value?.constructor?.name || '';

                        // dangerous/native objects
                        const blocked = new Set([
                            'Window',
                            'HTMLDocument',
                            'Document',
                            'Node',
                            'Element',
                            'HTMLElement',
                            'Event',
                            'Location',
                            'Navigator',
                            'Screen',
                            'ScreenOrientation',
                            'Plugin',
                            'PluginArray',
                            'MimeTypeArray',
                            'CSSStyleSheet',
                            'MessagePort',
                            'WebSocket',
                            'RTCPeerConnection',
                            'AudioContext',
                            'MediaStream',
                            'Electron',
                            'BrowserWindow',
                        ]);

                        return blocked.has(name);
                    } catch {
                        return true;
                    }
                }

                function clone(value, depth = 0) {
                    try {
                        // primitive
                        if (value === null || typeof value !== 'object') {
                            return value;
                        }

                        // blocked native objects
                        if (shouldSkip(value)) {
                            return `[${value?.constructor?.name || 'NativeObject'}]`;
                        }

                        // max depth
                        if (depth >= maxDepth) {
                            return '[MaxDepth]';
                        }

                        // circular
                        if (seen.has(value)) {
                            return seen.get(value);
                        }

                        // Date
                        if (value instanceof Date) {
                            return new Date(value);
                        }

                        // RegExp
                        if (value instanceof RegExp) {
                            return new RegExp(value);
                        }

                        // Array
                        if (Array.isArray(value)) {
                            const arr = [];

                            seen.set(value, arr);

                            for (let i = 0; i < value.length; i++) {
                                try {
                                    arr[i] = clone(value[i], depth + 1);
                                } catch {}
                            }

                            return arr;
                        }

                        // Object
                        const result = {};

                        seen.set(value, result);

                        const keys = getAllKeys(value);

                        for (const key of keys) {
                            try {
                                const descriptor = Object.getOwnPropertyDescriptor(value, key);

                                if (!descriptor) {
                                    continue;
                                }

                                // skip setter-only
                                if (descriptor.get === undefined && descriptor.value === undefined) {
                                    continue;
                                }

                                let propValue;

                                try {
                                    propValue = safeGet(value, key);
                                } catch {
                                    continue;
                                }

                                // skip undefined inaccessible props
                                if (propValue === undefined && !('value' in descriptor)) {
                                    continue;
                                }

                                // function handling
                                if (typeof propValue === 'function') {
                                    if (stringifyFunctions) {
                                        try {
                                            result[key] = propValue.toString();
                                        } catch {
                                            result[key] = '[Function]';
                                        }
                                    }

                                    continue;
                                }

                                result[key] = clone(propValue, depth + 1);
                            } catch {
                                // ignore property
                            }
                        }

                        return result;
                    } catch {
                        return undefined;
                    }
                }

                return clone(obj);
            }
            const original = JSON.stringify;
            let j = JSON.stringify.toString();
            JSON.stringify = function (...args) {
                try {
                    args[0] = advancedCloneObject(args[0], {
                        maxDepth: 8,
                        includeNonEnumerable: true,
                        includeSymbols: true,
                        stringifyFunctions: false,
                    });
                    return original(...args);
                } catch (error) {
                    console.log(error);
                    return original(...args);
                }
            };
            _____.__setConstValue(JSON.stringify, 'toString', original.toString());
        }
    }
}

