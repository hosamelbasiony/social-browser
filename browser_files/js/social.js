var _____ = globalThis.this;

var browserTabsDom = document.querySelector('.browser-tabs');
var browserTabs = new BrowserTabs();
var opendTabList = [];
let $addressbar = $('.address-input .url');

const updateOnlineStatus = () => {
    ipc('online-status', navigator.onLine ? { status: true } : { status: false });
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function ipc(name, message) {
    _____.currentTabInfo = _____.getCurrentTabInfo();
    message = message || {};
    message.tabInfo = { ..._____.currentTabInfo };
    message.tabID = message.tabID || _____.currentTabInfo.tabID;
    message.url = message.url || _____.currentTabInfo.url;
    message.title = message.title || '';
    message.iconURL = message.iconURL || _____.currentTabInfo.iconURL;
    message.windowID = message.windowID || _____.currentTabInfo.windowID;
    message.browserAppID = message.browserAppID || _____.currentTabInfo.browserAppProcessID;
    message.mainWindowID = message.mainWindowID || _____.currentTabInfo.mainWindowID;

    _____.ipc(name, message);

    if (name == '[window-action]' && !message.name.like('*screen*|*external*')) {
        _____.clickCurrentTab();
    }
}

function sendToMain(message) {
    ipc('[send-render-message]', message);
}

document.querySelectorAll('#body').forEach((el) => {
    el.addEventListener('mousemove', () => {
        _____.clickCurrentTab();
    });
});

function showAddressbar() {
    let url = _____.getCurrentTabInfo().url || '';
    if (url.like('browser*|*127.0.0.1:60080*')) {
        return;
    }
    ipc('[show-addressbar]', { url: _____.getCurrentTabInfo().url });
}

function goURL(e) {
    if (e.keyCode == 13) {
        url = $addressbar.text();
        if (url.indexOf('://') === -1) {
            if (url.indexOf('.') !== -1) {
                url = 'http://' + url;
            } else {
                url = 'https://google.com/search?q=' + url;
            }
        }

        ipc('[update-view-url]', {
            url: url,
        });
    }
}

function add_input_menu(node) {
    if (!node) return;

    if (node.nodeName === 'INPUT' || node.contentEditable == true) {
        let text = getSelection().toString();

        _____.menuList.push({
            label: 'Undo',
            role: 'undo',
        });
        _____.menuList.push({
            label: 'Redo',
            role: 'redo',
        });
        _____.menuList.push({
            type: 'separator',
        });
        _____.menuList.push({
            label: 'Cut',
            role: 'cut',
            enabled: text.length > 0,
        });

        _____.menuList.push({
            label: 'Copy',
            role: 'copy',
            enabled: text.length > 0,
        });

        _____.menuList.push({
            label: 'Paste',
            role: 'paste',
        });
        _____.menuList.push({
            label: 'Paste and Go',
            click() {
                document.execCommand('paste');
                goURL();
            },
        });
        _____.menuList.push({
            label: 'Delete',
            role: 'delete',
        });
        _____.menuList.push({
            type: 'separator',
        });
        _____.menuList.push({
            label: 'Select All',
            role: 'selectall',
        });

        _____.menuList.push({
            type: 'separator',
        });

        return;
    } else {
        add_input_menu(node.parentNode);
    }
}

document.addEventListener(
    'keydown',
    (e) => {
        //e.preventDefault();
        //e.stopPropagation();

        if (e.keyCode == 123 /*f12*/) {
            sendToMain({
                name: 'DeveloperTools',
                action: true,
            });
        } else if (e.keyCode == 122 /*f11*/) {
            if (!full_screen) {
                sendToMain({
                    name: 'full_screen',
                    action: true,
                });
                full_screen = true;
            } else {
                sendToMain({
                    name: '!full_screen',
                    action: true,
                });
                full_screen = false;
            }
        } else if (e.keyCode == 121 /*f10*/) {
            sendToMain({
                name: 'service worker',
            });
        } else if (e.keyCode == 117 /*f6*/) {
            ipc('[show-addressbar]');
        } else if (e.keyCode == 70 /*f*/) {
            if (e.ctrlKey == true) {
                sendToMain({
                    name: 'show in-page-find',
                    action: true,
                });
            }
        } else if (e.keyCode == 115 /*f4*/) {
            if (e.ctrlKey == true) {
                sendToMain({
                    name: 'close tab',
                });
            }
        } else if (e.keyCode == 107 /*+*/) {
            if (e.ctrlKey == true) {
                ipc('[window-action]', { name: 'window-zoom+' });
            }
        } else if (e.keyCode == 109 /*-*/) {
            if (e.ctrlKey == true) {
                ipc('[window-action]', { name: 'window-zoom-' });
            }
        } else if (e.keyCode == 48 /*0*/) {
            if (e.ctrlKey == true) {
                ipc('[window-action]', { name: 'window-zoom' });
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
        } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/) {
            ipc('[edit-window]');
        } else if (e.keyCode == 27 /*escape*/) {
            sendToMain({
                name: 'escape',
            });
        } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*t*/) {
            if (e.ctrlKey == true) {
                ipc('[open new tab]', {
                    mainWindowID: _____.window.id,
                });
            }
        } else if (e.keyCode == 116 /*f5*/) {
            if (e.ctrlKey === true) {
                ipc('[window-reload-hard]', {
                    origin: new URL(_____.getCurrentTabInfo().url).origin,
                });
            } else {
                ipc('[window-reload]', {
                    action: true,
                });
            }
        }

        return false;
    },
    true,
);

function showSettingMenu() {
    _____.window.show();
    _____.menuList = [];

    _____.menuList.push({
        label: 'Show Setting',
        click: () =>
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
                active: true,
            }),
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
    });

    _____.menuList.push({
        type: 'separator',
    });
    let freeTools = {
        label: 'Free Social Tools',
        click: () => {
            ipc('[open new popup]', {
                show: true,
                url: 'https://tools.social-browser.com/tools',
                title: 'Free Social Tools',
                partition: 'persist:social',
                center: true,
                vip: true,
                alwaysOnTop: true,
                maximize: true,
            });
        },
        iconURL: 'http://127.0.0.1:60080/images/free-tools.png',
    };

    _____.menuList.push(freeTools);
    let vipTools = {
        label: 'VIP Social Tools',
        click: () => {
            ipc('[open new popup]', {
                show: true,
                url: 'https://vip.social-browser.com',
                title: 'VIP Social Tools',
                partition: 'persist:social',
                center: true,
                vip: true,
                alwaysOnTop: true,
                maximize: true,
            });
        },
        iconURL: 'http://127.0.0.1:60080/images/vip-tools.png',
    };

    _____.menuList.push(vipTools);
    _____.menuList.push({
        type: 'separator',
    });

    if (_____.var.core.id.like('*developer*')) {
        _____.menuList.push({
            label: 'Check Update',
            iconURL: 'http://127.0.0.1:60080/images/chromium.png',
            click: () =>
                sendToMain({
                    name: '[run-window-update]',
                }),
        });
        _____.menuList.push({
            type: 'separator',
        });
    }
    if (_____.var.core.brand.like(_____.from123('2458765245381663'))) {
        _____.menuList.push({
            label: 'Open Browser Site',
            iconURL: 'http://127.0.0.1:60080/images/blue.png',
            click: () =>
                ipc('[open new tab]', {
                    url: _____.from123('431932754619268325738667413876522539275746594262417837742558825747148591'),
                    title: 'Browser',
                    mainWindowID: _____.window.id,
                }),
        });
    } else {
        _____.menuList.push({
            label: 'Open Browser Site',
            iconURL: 'http://127.0.0.1:60080/images/logo.png',
            click: () =>
                ipc('[open new tab]', {
                    url: 'https://social-browser.com/',
                    title: 'Browser',
                    mainWindowID: _____.window.id,
                    active: true,
                }),
        });
    }

    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Downloads',
        iconURL: 'http://127.0.0.1:60080/images/downloads.png',
        click: () =>
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/downloads',
                title: 'Dwonloads',
                mainWindowID: _____.window.id,
                vip: true,
                active: true,
            }),
    });

    _____.menuList.push({
        type: 'separator',
    });

    let arr2 = [];

    _____.var.bookmarks.forEach((b) => {
        arr2.push({
            label: b.url,
            sublabel: b.title,
            iconURL: b.favicon,
            click: () =>
                ipc('[open new tab]', {
                    url: b.url,
                    title: b.title,
                    active: true,
                }),
        });
    });

    let bookmark = {
        label: 'Bookmarks',
        iconURL: 'http://127.0.0.1:60080/images/bookmark.png',
        type: 'submenu',
        submenu: arr2,
    };

    _____.menuList.push(bookmark);
    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Reload Page',
        iconURL: 'http://127.0.0.1:60080/images/reload.png',
        accelerator: 'F5',
        click: () =>
            ipc('[window-reload]', {
                action: true,
            }),
    });
    _____.menuList.push({
        label: 'Hard Reload Page',
        iconURL: 'http://127.0.0.1:60080/images/reload.png',
        accelerator: 'CommandOrControl+F5',
        click: () =>
            ipc('[window-reload-hard]', {
                origin: new URL(_____.getCurrentTabInfo().url).origin,
            }),
    });

    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Zoom +',
        iconURL: 'http://127.0.0.1:60080/images/zoom-in.png',
        accelerator: 'CommandOrControl+numadd',
        click: () => {
            ipc('[window-zoom+]');
        },
    });
    _____.menuList.push({
        label: 'Zoom OFF',
        iconURL: 'http://127.0.0.1:60080/images/zoom.png',
        accelerator: 'CommandOrControl+0',
        click: () => ipc('[window-zoom]'),
    });
    _____.menuList.push({
        label: 'Zoom -',
        iconURL: 'http://127.0.0.1:60080/images/zoom-out.png',
        accelerator: 'CommandOrControl+numsub',
        click: () => ipc('[window-zoom-]'),
    });

    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Edit Page Content',
        iconURL: 'http://127.0.0.1:60080/images/edit.png',
        accelerator: 'CommandOrControl+E',
        click: () => ipc('[edit-window]'),
    });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Audio ON / OFF',
        iconURL: 'http://127.0.0.1:60080/images/audio.png',
        accelerator: 'CommandOrControl+1',
        click: () => ipc('[window-action]', { name: 'toggle-window-audio' }),
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Close All Browser Services',
        iconURL: 'http://127.0.0.1:60080/images/close.png',
        click: () => _____.ws({ type: '[close]' }),
    });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, icoiconURLn: m3.iconURL })),
            })),
        })),
    });
}

function copyCurrentURL() {
    _____.copy(_____.getCurrentTabInfo().url);
}

function showBookmarksMenu() {
    _____.window.show();
    _____.menuList = [];
    _____.menuList.push({
        label: 'Bookmark current tab',
        iconURL: 'http://127.0.0.1:60080/images/star.png',
        click: () => ipc('[add-to-bookmark]'),
    });
    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Bookmark Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#bookmark',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
                active: true,
            });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.var.bookmarks.forEach((b) => {
        _____.menuList.push({
            label: b.url,
            sublabel: b.title,
            iconURL: b.favicon,
            click: () =>
                ipc('[open new tab]', {
                    url: b.url,
                    title: b.title,
                    active: true,
                }),
        });
    });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
            })),
        })),
    });
}

_____.showTempMails = function () {
    ipc('[open new popup]', {
        show: true,
        url: 'https://emails.social-browser.com/vip',
        partition: 'persist:social',
        trusted: true,
        vip: true,
        center: true,
        alwaysOnTop: true,
    });
};

_____.showSocialTools = function () {
    ipc('[open new popup]', {
        show: true,
        url: 'https://tools.social-browser.com/tools',
        partition: 'persist:social',
        trusted: true,
        vip: true,
        center: true,
        alwaysOnTop: true,
    });
};

_____.showScriptListMenu = function () {
    _____.window.show();
    _____.menuList = [];

    _____.menuList.push({
        label: 'User Scripts Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#scripts',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'open Open User Store',
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            ipc('[open new popup]', {
                url: 'https://openuserjs.org/',
                session: { name: 'setting', display: 'setting' },
                vip: true,
                show: true,
                alwaysOnTop: true,
                center: true,
            });
        },
    });

    _____.menuList.push({
        label: 'open User Script Store',
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            ipc('[open new popup]', {
                url: 'https://www.userscript.zone/',
                session: { name: 'setting', display: 'setting' },
                vip: true,
                show: true,
                alwaysOnTop: true,
                center: true,
            });
        },
    });

    _____.menuList.push({
        label: 'open Greasy Fork Store',
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            ipc('[open new popup]', {
                url: 'https://greasyfork.org/en/scripts',
                session: { name: 'setting', display: 'setting' },
                vip: true,
                show: true,
                alwaysOnTop: true,
                center: true,
            });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.var.scriptList
        .filter((s) => s.show && !_____.getCurrentTabInfo().url.like('*127.0.0.1:60080*') && _____.getCurrentTabInfo().url.like(s.allowURLs) && !_____.getCurrentTabInfo().url.like(s.blockURLs))
        .forEach((script) => {
            _____.menuList.push({
                label: script.title,
                iconURL: 'http://127.0.0.1:60080/images/code.png',
                click: () => {
                    _____.ws({ type: '[run-user-script]', tabInfo: _____.getCurrentTabInfo(), script: script });
                },
            });
        });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
            })),
        })),
    });
};

_____.showHelpMenu = function () {
    _____.window.show();
    _____.menuList = [];

    _____.menuList.push({
        label: 'Click Here if you want to run Page Ads',
        sublabel: 'toggle [ on / off ]',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.allowAds', value: !currentTab.allowAds });
        },
    });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Click Here to run Page Content Any Way',
        sublabel: 'toggle [ on / off ]',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.off', value: !currentTab.off });
        },
    });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
            })),
        })),
    });
};

_____.showWindowCustomSetting = function () {
    _____.window.show();
    _____.menuList = [];
    let currentTab = _____.getCurrentTabInfo();

    _____.menuList.push({
        label: 'Allow Default Web Worker ( Solve Captcha Problems )',
        type: 'checkbox',
        checked: currentTab.allowDefaultWorker || false,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.allowDefaultWorker', value: !currentTab.allowDefaultWorker });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Allow Ads',
        type: 'checkbox',
        checked: currentTab.allowAds,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.allowAds', value: !currentTab.allowAds });
        },
    });

    _____.menuList.push({
        label: 'Allow Popups',
        type: 'checkbox',
        checked: currentTab.allowPopup,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.allowPopup', value: !currentTab.allowPopup });
        },
    });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Mark Current Window as ( White Site )',
        type: 'checkbox',
        checked: currentTab.isWhiteSite || false,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.isWhiteSite', value: !currentTab.isWhiteSite });
        },
    });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Block Load Images',
        type: 'checkbox',
        checked: currentTab.blockImages || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockImages', value: !currentTab.blockImages });
        },
    });
    _____.menuList.push({
        label: 'Block Load JavaScript Files',
        type: 'checkbox',
        checked: currentTab.blockJS || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockJS', value: !currentTab.blockJS });
        },
    });
    _____.menuList.push({
        label: 'Block Load CSS Files',
        type: 'checkbox',
        checked: currentTab.blockCSS || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockCSS', value: !currentTab.blockCSS });
        },
    });

    _____.menuList.push({
        label: 'Block Load Media / Videos',
        type: 'checkbox',
        checked: currentTab.blockMedia || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockMedia', value: !currentTab.blockMedia });
        },
    });

    _____.menuList.push({
        label: 'Block XMLHttpRequest / fetch ',
        type: 'checkbox',
        checked: currentTab.blockXHR || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockXHR', value: !currentTab.blockXHR });
        },
    });
    _____.menuList.push({
        label: 'Block Load Sub Frames',
        type: 'checkbox',
        checked: currentTab.blockSubFrame || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockSubFrame', value: !currentTab.blockSubFrame });
        },
    });

    _____.menuList.push({
        label: 'Block Load Fonts',
        type: 'checkbox',
        checked: currentTab.blockFonts || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockFonts', value: !currentTab.blockFonts });
        },
    });
    _____.menuList.push({
        label: 'Block WebSocket connection',
        type: 'checkbox',
        checked: currentTab.blockWebSocket || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockWebSocket', value: !currentTab.blockWebSocket });
        },
    });
    _____.menuList.push({
        label: 'Block Ping Requests',
        type: 'checkbox',
        checked: currentTab.blockPing || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockPing', value: !currentTab.blockPing });
        },
    });
    _____.menuList.push({
        label: 'Block CSP Reports',
        type: 'checkbox',
        checked: currentTab.blockCspReport || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockCspReport', value: !currentTab.blockCspReport });
        },
    });

    _____.menuList.push({
        label: 'Block Object Resources',
        type: 'checkbox',
        checked: currentTab.blockObject || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockObject', value: !currentTab.blockObject });
        },
    });

    _____.menuList.push({
        label: 'Block Other Resources',
        type: 'checkbox',
        checked: currentTab.blockOther || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockOther', value: !currentTab.blockOther });
        },
    });
    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Block Javascript Engine ',
        type: 'checkbox',
        checked: currentTab.javaScriptOFF || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.javaScriptOFF', value: !currentTab.javaScriptOFF });
        },
    });
    _____.menuList.push({
        label: 'Block Browser Engine ',
        type: 'checkbox',
        checked: currentTab.enginOFF || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.enginOFF', value: !currentTab.enginOFF });
        },
    });
    _____.menuList.push({
        label: 'Block ALL Engine ',
        type: 'checkbox',
        checked: currentTab.off || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.off', value: !currentTab.off });
        },
    });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
            })),
        })),
    });
};

_____.showAIMenu = function () {
    _____.window.show();
    _____.menuList = [];

    let currentTab = _____.getCurrentTabInfo();

    _____.var.blocking.ai_site_list
        .filter((ai) => ai.enabled)
        .forEach((ai) => {
            if (ai.multi) {
                let arr = [];
                _____.var.session_list.forEach((s, i) => {
                    arr.push({
                        label: `As ( ${i + 1} ) [ ${s.display} ]`,
                        iconURL: 'http://127.0.0.1:60080/images/person.png',
                        click: () => {
                            ai.view_type = ai.view_type || { id: 'New Window' };

                            if (ai.view_type.id == 'New Window') {
                                _____.openNewPopup({
                                    url: ai.url,
                                    partition: s.name,
                                    show: true,
                                    isWhiteSite: true,
                                });
                            } else {
                                _____.openNewTab({
                                    url: ai.url,
                                    partition: s.name,
                                    isWhiteSite: true,
                                });
                            }
                        },
                    });
                });
                _____.menuList.push({
                    label: 'Open ' + ai.name,
                    iconURL: 'http://127.0.0.1:60080/images/bot.png',
                    type: 'submenu',
                    submenu: arr,
                });
            } else {
                _____.menuList.push({
                    label: ai.name,
                    iconURL: 'http://127.0.0.1:60080/images/bot.png',
                    click: () => {
                        ai.view_type = ai.view_type || { id: 'New Window' };

                        if (ai.view_type.id == 'New Window') {
                            _____.openNewPopup({
                                url: ai.url,
                                partition: currentTab.partition,
                                show: true,
                                isWhiteSite: true,
                            });
                        } else if (ai.view_type.id == 'New Tab') {
                            _____.openNewTab({
                                url: ai.url,
                                partition: currentTab.partition,
                                isWhiteSite: true,
                            });
                        } else if (ai.view_type.id == 'Current Tab') {
                            ipc('[update-view]', {
                                url: ai.url,
                                customSetting: {
                                    isWhiteSite: true,
                                },
                            });
                        }
                    },
                });
            }
        });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'AI Tools Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#contextMenu',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });
    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
            })),
        })),
    });
};

_____.showSocialSiteMenu = function () {
    _____.window.show();
    _____.menuList = [];

    let currentTab = _____.getCurrentTabInfo();

    _____.var.blocking.social_site_list
        .filter((ss) => ss.enabled)
        .forEach((ss) => {
            if (ss.multi) {
                let arr = [];
                _____.var.session_list.forEach((s, i) => {
                    arr.push({
                        label: `As ( ${i + 1} ) [ ${s.display} ]`,
                        iconURL: 'http://127.0.0.1:60080/images/person.png',
                        click: () => {
                            ss.view_type = ss.view_type || { id: 'New Window' };

                            if (ss.view_type.id == 'New Window') {
                                _____.openNewPopup({
                                    url: ss.url,
                                    partition: s.name,
                                    show: true,
                                    isWhiteSite: true,
                                });
                            } else {
                                _____.openNewTab({
                                    url: ss.url,
                                    partition: s.name,
                                    isWhiteSite: true,
                                });
                            }
                        },
                    });
                });
                _____.menuList.push({
                    label: 'Open ' + ss.name,
                    iconURL: 'http://127.0.0.1:60080/images/multi_user.png',
                    type: 'submenu',
                    submenu: arr,
                });
            } else {
                _____.menuList.push({
                    label: ss.name,
                    iconURL: 'http://127.0.0.1:60080/images/multi_user.png',
                    click: () => {
                        ss.view_type = ss.view_type || { id: 'New Window' };

                        if (ss.view_type.id == 'New Window') {
                            _____.openNewPopup({
                                url: ss.url,
                                partition: currentTab.partition,
                                show: true,
                                isWhiteSite: true,
                            });
                        } else if (ss.view_type.id == 'New Tab') {
                            _____.openNewTab({
                                url: ss.url,
                                partition: currentTab.partition,
                                isWhiteSite: true,
                            });
                        } else if (ss.view_type.id == 'Current Tab') {
                            ipc('[update-view]', {
                                url: ss.url,
                                customSetting: {
                                    isWhiteSite: true,
                                },
                            });
                        }
                    },
                });
            }
        });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Social Site Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#contextMenu',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });
    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
            })),
        })),
    });
};

_____.showIntegratedSiteMenu = function () {
    _____.window.show();
    _____.menuList = [];

    let currentTab = _____.getCurrentTabInfo();
    let doman = new URL(currentTab.url).hostname;
    doman = encodeURIComponent(doman);

    let url = encodeURIComponent(currentTab.url);

    _____.var.blocking.integrated_site_list
        .filter((_integrated) => _integrated.enabled)
        .forEach((_integrated) => {
            let targetURL = _integrated.url.replaceAll('{domain}', doman).replaceAll('{url}', url);
            if (_integrated.multi) {
                let arr = [];
                _____.var.session_list.forEach((s, i) => {
                    arr.push({
                        label: `As ( ${i + 1} ) [ ${s.display} ]`,
                        iconURL: 'http://127.0.0.1:60080/images/person.png',
                        click: () => {
                            _integrated.view_type = _integrated.view_type || { id: 'New Window' };

                            if (_integrated.view_type.id == 'New Window') {
                                _____.openNewPopup({
                                    url: targetURL,
                                    partition: s.name,
                                    show: true,
                                    isWhiteSite: true,
                                });
                            } else {
                                _____.openNewTab({
                                    url: targetURL,
                                    partition: s.name,
                                    isWhiteSite: true,
                                });
                            }
                        },
                    });
                });
                _____.menuList.push({
                    label: 'Open ' + _integrated.name,
                    sublabel: doman,
                    iconURL: 'http://127.0.0.1:60080/images/link.png',
                    type: 'submenu',
                    submenu: arr,
                });
            } else {
                _____.menuList.push({
                    label: _integrated.name,
                    sublabel: doman,
                    iconURL: 'http://127.0.0.1:60080/images/link.png',
                    click: () => {
                        _integrated.view_type = _integrated.view_type || { id: 'New Window' };

                        if (_integrated.view_type.id == 'New Window') {
                            _____.openNewPopup({
                                url: targetURL,
                                partition: currentTab.partition,
                                show: true,
                                isWhiteSite: true,
                            });
                        } else if (_integrated.view_type.id == 'New Tab') {
                            _____.openNewTab({
                                url: targetURL,
                                partition: currentTab.partition,
                                isWhiteSite: true,
                            });
                        } else if (_integrated.view_type.id == 'Current Tab') {
                            ipc('[update-view]', {
                                url: targetURL,
                                customSetting: {
                                    isWhiteSite: true,
                                },
                            });
                        }
                    },
                });
            }
        });
    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Integrated Site Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#contextMenu',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });
    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
            })),
        })),
    });
};

_____.showUserProxyMenu = function () {
    _____.window.show();
    _____.menuList = [];

    _____.menuList.push({
        label: 'Proxy List Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#proxyList',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Stop Proxy',
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click: () => {
            let currentTab = _____.getCurrentTabInfo();
            _____.ws({ type: '[change-user-proxy]', partition: _____.getCurrentTabInfo().partition, proxy: null });
            setTimeout(() => {
                ipc('[window-reload]', currentTab);
            }, 1000 * 1);
        },
    });
    _____.menuList.push({
        type: 'separator',
    });

    if (_____.var.proxy_list.length > 0) {
        _____.menuList.push({
            label: 'Random Proxy',
            iconURL: 'http://127.0.0.1:60080/images/proxy.png',
            click: () => {
                let currentTab = _____.getCurrentTabInfo();
                let proxy = _____.var.proxy_list[Math.floor(Math.random() * _____.var.proxy_list.length)] || _____.var.proxy_list[0];

                _____.ws({ type: '[change-user-proxy]', partition: currentTab.partition, proxy: proxy });
                setTimeout(() => {
                    ipc('[window-reload]', currentTab);
                }, 1000 * 2);
            },
        });
        _____.menuList.push({
            type: 'separator',
        });
        _____.var.proxy_list.forEach((proxy) => {
            _____.menuList.push({
                label: proxy.url || proxy.ip + ':' + proxy.port,
                iconURL: 'http://127.0.0.1:60080/images/proxy.png',
                click: () => {
                    let currentTab = _____.getCurrentTabInfo();
                    _____.ws({ type: '[change-user-proxy]', partition: _____.getCurrentTabInfo().partition, proxy: proxy });
                    setTimeout(() => {
                        ipc('[window-reload]', currentTab);
                    }, 1000 * 2);
                },
            });
        });
    }

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
            })),
        })),
    });
};
_____.showUserAgentMenu = function () {
    _____.window.show();
    _____.menuList = [];

    _____.menuList.push({
        label: 'UserAgent List Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#userAgntList',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Remove User Agent',
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click: () => {
            _____.ws({ type: '[change-user-agent]', partition: _____.getCurrentTabInfo().partition, defaultUserAgent: null });
            setTimeout(() => {
                ipc('[window-reload]');
            }, 1000 * 0);
        },
    });
    _____.menuList.push({
        type: 'separator',
    });
    _____.var.userAgentList.sort((a, b) => (a.name > b.name ? -1 : 1));
    _____.var.userAgentList.forEach((userAgent) => {
        _____.menuList.push({
            label: userAgent.name,
            iconURL: 'http://127.0.0.1:60080/images/user-agent.png',
            click: () => {
                _____.ws({ type: '[change-user-agent]', partition: _____.getCurrentTabInfo().partition, defaultUserAgent: userAgent });
                setTimeout(() => {
                    ipc('[window-reload]');
                }, 1000 * 0);
            },
        });
    });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
            })),
        })),
    });
};

_____.showWindowsMenu = function () {
    _____.window.show();

    _____.menuList = [];

    _____.menuList.push({
        label: 'Open URL in  [ New Window ( Random - PC ) ]',
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        sublabel: _____.getCurrentTabInfo().url,
        click: () => {
            ipc('[window-action]', { name: 'new-window' });
        },
    });
    _____.menuList.push({
        label: 'Open URL in  [ New Window ( Random - Mobile ) ]',
        sublabel: _____.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-mobile-window' });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Open URL in  [ New Window ( Allow Ads ) ]',
        sublabel: _____.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-ads-window' });
        },
    });
    _____.menuList.push({
        type: 'separator',
    });

    _____.menuList.push({
        label: 'Open URL in  [ Chrome Browser Simulator ] ',
        sublabel: _____.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
        click: () => {
            ipc('[window-action]', { name: 'open-in-chrome' });
        },
    });

    _____.menuList.push({
        label: 'Open URL in  [ Chrome Browser Simulator ] ( Shared Cookies , User Data , Extentions ) ',
        sublabel: _____.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
        click: () => {
            ipc('[window-action]', { name: 'open-in-chrome-session' });
        },
    });

    _____.menuList.push({
        type: 'separator',
    });
    _____.menuList.push({
        label: 'Open URL in  [ External Browser ] ',
        sublabel: _____.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/browser.png',
        click: () => {
            ipc('[window-action]', { name: 'open-external', url: _____.getCurrentTabInfo().url });
        },
    });

    ipc('[show-menu]', {
        windowID: _____.window.id,
        list: _____.menuList.map((m) => ({
            label: m.label,
            sublabel: m.sublabel,
            visible: m.visible,
            type: m.type,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
            })),
        })),
    });
};

browserTabs.init(browserTabsDom, {
    tabOverlapDistance: 10,
    minWidth: 35,
    maxWidth: 270,
});

function setURL(url, url2) {
    $addressbar.text('');
    if (url) {
        url = url.replace('127.0.0.1:60080/', '');
        try {
            url = decodeURI(url);
        } catch (error) {
            console.log(error, url);
        }
        $addressbar.text(url.replace('http://', '').replace('https://', ''));
    }
}

function showAddressBar() {
    $('.social-address-bar').show();
}

function hideAddressBar() {
    $('.social-address-bar').hide();
}

function showSocialTabs() {
    $('.browser-tabs').show();
    $('.social-address-bar').show();
    browserTabs.layoutTabs();
    browserTabs.fixZIndexes();
    browserTabs.setupDraggabilly();
}

function hideSocialTabs() {
    $('.browser-tabs').hide();
    $('.social-address-bar').hide();
    browserTabs.layoutTabs();
    browserTabs.fixZIndexes();
    browserTabs.setupDraggabilly();
}

function handleURL(u) {
    if (u.indexOf('://') !== -1) {
        return u;
    }

    if (u.indexOf('.') !== -1) {
        u = 'http://' + u;
    } else {
        u = 'https://google.com/search?q=' + u;
    }

    return u;
}

function showURL(u) {
    u = u || _____.getCurrentTabInfo().url;
    ipc('[show-addressbar]', {
        url: u,
    });
}

$('.social-close').click(() => {
    ExitSocialWindow();
});
$('.social-maxmize').click(() => {
    ipc('[browser-message]', { name: 'maxmize', windowID: _____.window.id });
});
$('.social-minmize').click(() => {
    ipc('[browser-message]', { name: 'minmize', windowID: _____.window.id });
});

browserTabsDom.addEventListener('activeTabChange', ({ detail }) => {
    let id = detail.tabEl.id;
    _____.currentTabInfo = _____.getCurrentTabInfo(id);

    ipc('[show-view]', {
        x: 0,
        y: 0,
        width: document.width,
        height: document.height,
        tabID: id,
        mainWindowID: _____.window.id,
    });

    $('#user_name').html(_____.currentTabInfo.user_name);

    if (!_____.currentTabInfo.forward) {
        $('.go-forward i').css('color', '#9E9E9E');
    } else {
        $('.go-forward i').css('color', '#4caf50');
    }
    if (!_____.currentTabInfo.back) {
        $('.go-back i').css('color', '#9E9E9E');
    } else {
        $('.go-back i').css('color', '#4caf50');
    }

    if (_____.currentTabInfo.webaudio) {
        $('.Page-audio i').css('color', '#4caf50');
    } else {
        $('.Page-audio i').css('color', '#f44336');
    }

    if (_____.currentTabInfo.url) {
        $('.address-input .http').css('display', 'none');
        $('.address-input .https').css('display', 'none');
        $('.address-input .file').css('display', 'none');
        $('.address-input .ftp').css('display', 'none');
        $('.address-input .browser').css('display', 'none');
        $('.address-input .proxy').css('display', 'none');

        $('.address-input .https').html('');
        $('.address-input .http').html('');
        $('.address-input .file').html('');
        $('.address-input .ftp').html('');
        $('.address-input .browser').html('');
        $('.address-input .proxy').html('');

        if (_____.currentTabInfo.url.like('http://127.0.0.1:60080*|browser*')) {
            $('.address-input .browser').html('browser');
            $('.address-input .browser').css('display', 'inline-block');
            url = _____.currentTabInfo.url;
            let arr = url.split('//');
            setURL(arr[arr.length - 1], url);
        } else {
            let protocol = '';
            let url = '';
            if (_____.currentTabInfo.url.like('https*')) {
                protocol = 'HTTPS';
                $('.address-input .https').html(protocol);
                $('.address-input .https').css('display', 'inline-block');
            } else if (_____.currentTabInfo.url.like('http*')) {
                protocol = 'http';
                $('.address-input .http').html(protocol);
                $('.address-input .http').css('display', 'inline-block');
            } else if (_____.currentTabInfo.url.like('ftp*')) {
                protocol = 'ftp';
                $('.address-input .ftp').html(protocol);
                $('.address-input .ftp').css('display', 'inline-block');
            } else if (_____.currentTabInfo.url.like('file*')) {
                protocol = 'file';
                $('.address-input .file').html(protocol);
                $('.address-input .file').css('display', 'inline-block');
            } else if (_____.currentTabInfo.url.like('browser*')) {
                protocol = 'browser';
                $('.address-input .browser').html(protocol);
                $('.address-input .browser').css('display', 'inline-block');
            }

            if (protocol) {
                url = _____.currentTabInfo.url.replace(protocol + '://', '');
            } else {
                url = _____.currentTabInfo.url;
            }

            $('.address-input .protocol').html(protocol);
        }
    }

    handleUrlText();

    if (_____.currentTabInfo.proxy) {
        $('.address-input .proxy').html(_____.currentTabInfo.proxy);
        $('.address-input .proxy').css('display', 'inline-block');
    }
});

browserTabsDom.addEventListener('tabAdd', ({ detail }) => {
    let id = detail.tabEl.id;
    if (id && id != null && id.length > 0) {
        opendTabList.push({
            id: id,
        });
        ipc('[create-new-view]', {
            ...detail.tabProperties,
            x: window.screenLeft,
            y: window.screenTop + 70,
            width: document.width,
            height: document.height,
            tabID: id,
            mainWindowID: _____.window.id,
        });
    }
});

browserTabsDom.addEventListener('tabRemove', ({ detail }) => {
    let id = detail.id;

    ipc('[close-view]', {
        tabID: id,
    });
});

function renderNewTabData(op) {
    if (!op) {
        return;
    }

    if (typeof op === 'string') {
        op = op.split('...').join('\\');
        op = {
            url: op,
        };
    }

    if (op.url && !op.url.like('*://*')) {
        op.url = 'http://' + op.url;
    }

    op = {
        url: '',
        title: null,
        ...op,
    };

    let tab = {
        ...op,
        id: 'tab_' + new Date().getTime(),
        title: op.title || op.url,
        user_name: op.user_name || op.partition,
        iconURL: 'browser://images/loading.gif',
        mainWindowID: _____.window.id,
    };
    browserTabs.addTab(tab);
    // console.log(tab);
}

_____.on('[show-tab]', (event, data) => {
    $('#' + data.tabID).click();
});
_____.on('[close-tab]', (event, data) => {
    closeTab(data.tabID);
});
_____.on('[open new tab]', (event, data) => {
    renderNewTabData(data);
});
_____.on('[send-render-message]', (event, data) => {
    renderMessage(data);
});
_____.tabPropertyList = [];

_____.on('[update-tab-properties]', (event, data) => {
    if (data.tabID) {
        _____.tabPropertyList[data.tabID] = data;

        let tab1 = document.querySelector('#' + data.tabID);
        if (tab1) {
            $('#' + data.tabID + ' .social-tab-favicon').css('background-image', 'url(' + data.iconURL + ')');
        }

        if (data.title) {
            $('#' + data.tabID + ' .social-tab-title p').text(data.title);
            let p = document.querySelector('#' + data.tabID + ' .social-tab-title p');
            if (p) {
                if (data.title.test(/^[a-zA-Z\-\u0590-\u05FF\0-9\^@_:\?\[\]~<>\{\}\|\\ ]+$/)) {
                    p.style.direction = 'ltr';
                } else {
                    p.style.direction = 'rtl';
                }
            }
        } else {
            $('#' + data.tabID + ' .social-tab-title p').text(data.url);
        }
    }

    if (browserTabs.tabEls.length === 2 && !_____.showViewDone && !_____.window.isMinimized() && _____.window.isVisible()) {
        ipc('[show-view]', {
            x: 0,
            y: 0,
            width: document.width,
            height: document.height,
            tabID: data.tabID,
            mainWindowID: _____.window.id,
        });
        _____.showViewDone = true;
        _____.window.show();
        _____.window.setAlwaysOnTop(true);
        _____.window.setAlwaysOnTop(false);
    }

    if (data.tabID && data.tabID == _____.getCurrentTabInfo().tabID && data.url) {
        if (!data.forward) {
            $('.go-forward i').css('color', '#9E9E9E');
        } else {
            $('.go-forward i').css('color', '#4caf50');
        }
        if (!data.back) {
            $('.go-back i').css('color', '#9E9E9E');
        } else {
            $('.go-back i').css('color', '#4caf50');
        }

        if (data.webaudio) {
            $('.Page-audio i').css('color', '#4caf50');
        } else {
            $('.Page-audio i').css('color', '#f44336');
        }

        $('.address-input .proxy').css('display', 'none');
        $('.address-input .http').css('display', 'none');
        $('.address-input .https').css('display', 'none');
        $('.address-input .file').css('display', 'none');
        $('.address-input .ftp').css('display', 'none');
        $('.address-input .browser').css('display', 'none');

        $('.address-input .proxy').html('');
        $('.address-input .https').html('');
        $('.address-input .http').html('');
        $('.address-input .file').html('');
        $('.address-input .ftp').html('');
        $('.address-input .browser').html('');

        if (data.proxy) {
            $('.address-input .proxy').html(data.proxy);
            $('.address-input .proxy').css('display', 'inline-block');
        }

        if (data.url.like('http://127.0.0.1:60080*|browser*')) {
            $('.address-input .browser').html('browser');
            $('.address-input .browser').css('display', 'inline-block');
            url = data.url;
            let arr = url.split('//');
            setURL(arr[arr.length - 1], url);
        } else {
            let protocol = '';
            let url = '';
            try {
                data.url = decodeURI(data.url);
            } catch (error) {
                console.log(error, data.url);
            }
            if (data.url.like('https*')) {
                protocol = 'HTTPS';
                $('.address-input .https').html(protocol);
                $('.address-input .https').css('display', 'inline-block');
            } else if (data.url.like('http*')) {
                protocol = 'http';
                $('.address-input .http').html(protocol);
                $('.address-input .http').css('display', 'inline-block');
            } else if (data.url.like('ftp*')) {
                protocol = 'ftp';
                $('.address-input .ftp').html(protocol);
                $('.address-input .ftp').css('display', 'inline-block');
            } else if (data.url.like('file*')) {
                protocol = 'file';
                $('.address-input .file').html(protocol);
                $('.address-input .file').css('display', 'inline-block');
            } else if (data.url.like('browser*')) {
                protocol = 'browser';
                $('.address-input .browser').html(protocol);
                $('.address-input .browser').css('display', 'inline-block');
            }

            if (protocol) {
                url = data.url.replace(protocol + '://', '');
            } else {
                url = data.url;
            }

            $('.address-input .protocol').html(protocol);
        }
        handleUrlText();
    }
});

function renderMessage(cm) {
    if (!cm) {
        return;
    } else if (cm.name == '[remove-tab]') {
        browserTabs.removeTab(browserTabs.removeTab(browserTabsDom.querySelector('#' + cm.tabID)));
    } else if (cm.name == 'set-setting') {
        for (let k of Object.keys(cm.var)) {
            _____.var[k] = cm.var[k];
        }
    } else if (cm.name == '[show-browser-setting]') {
        renderNewTabData({
            url: 'http://127.0.0.1:60080/setting',
            session: { name: 'setting', display: 'setting' },
            windowType: 'view',
            vip: true,
        });
    } else if (cm.name == '[download-link]') {
        ipc('[download-link]', cm.url);
    } else if (cm.name == 'downloads') {
        showDownloads();
    } else if (cm.name == 'escape') {
        is_addressbar_busy = false;
    } else if (cm.name == 'close tab') {
        closeCurrentTab();
    } else if (cm.name == 'mini_iframe') {
        playMiniIframe(cm);
    } else if (cm.name == 'alert') {
        showMessage(cm.message, cm.time);
    } else if (cm.name == 'mini_youtube') {
        playMiniYoutube(cm);
    } else if (cm.name == 'new_trusted_window') {
        playTrustedWindow(cm);
    } else if (cm.name == 'new_popup') {
        playWindow(cm);
    } else if (cm.name == 'mini_video') {
        playMiniVideo(cm);
    }
}

_____.getCurrentTabInfo = function (id) {
    if (id) {
        let info = _____.tabPropertyList[id];
        return info || {};
    }
    let tab = document.querySelector('.social-tab-current');
    let info = tab ? _____.tabPropertyList[tab.getAttribute('id')] : {};
    return info || {};
};

function playMiniVideo(cm) {
    return ipc('new-video-window', cm);
}

function playMiniYoutube(cm) {
    return ipc('new-youtube-window', cm);
}

function playTrustedWindow(cm) {
    return ipc('new-trusted-window', cm);
}

function playWindow(cm) {
    return ipc('new-window', cm);
}

function playMiniIframe(cm) {
    return ipc('new-iframe-window', cm);
}

function closeCurrentTab() {
    browserTabs.removeTab(browserTabsDom.querySelector('.social-tab-current'));
}

function closeTab(id) {
    browserTabs.removeTab(browserTabsDom.querySelector('#' + id));
}

function ExitSocialWindow(noTabs = false) {
    if (noTabs) {
        ipc('[browser-message]', { name: 'close', windowID: _____.window.id });
        return;
    }
    $('.address-input .http').css('display', 'none');
    $('.address-input .https').css('display', 'none');
    $('.address-input .file').css('display', 'none');
    $('.address-input .ftp').css('display', 'none');
    $('.address-input .browser').css('display', 'none');

    $('.address-input .https').html('');
    $('.address-input .http').html('');
    $('.address-input .file').html('');
    $('.address-input .ftp').html('');
    $('.address-input .browser').html('');
    setURL('');

    opendTabList.forEach((t, i) => {
        closeTab(t.id);
    });

    setTimeout(() => {
        ipc('[browser-message]', { name: 'close', windowID: _____.window.id });
    }, 250);
}

function showDownloads() {
    renderNewTabData({
        url: 'http://127.0.0.1:60080/downloads',
        vip: true,
    });
}

function init_tab() {
    renderNewTabData(_____.newTabData);
}

function handleUrlText() {
    let url = _____.getCurrentTabInfo().url || '';
    try {
        url = decodeURI(url);
    } catch (error) {
        console.log(error, url);
    }
    let w = document.querySelectorAll('.address-input')[0].clientWidth / 11;
    if (url.length > w) {
        setURL(url, url);
    } else {
        setURL(url, url);
    }
}

window.addEventListener('resize', () => {
    handleUrlText();
});

_____.on('show-tab-view', (data) => {
    if (data.windowID == _____.window.id) {
        $('#' + data.tabID).click();
    }
});

_____.window.maximize();
_____.window.show();

_____.tabBusy = false;
_____.clickCurrentTab = function () {
    if (!_____.tabBusy) {
        _____.tabBusy = true;
        $('#' + _____.getCurrentTabInfo().tabID).click();
        setTimeout(() => {
            _____.tabBusy = false;
        }, 500);
    }
};

if (_____.var.core.id.like('*developer*')) {
    _____.menu_list.push({
        label: 'inspect Element',
        click() {
            _____.webContents.openDevTools({
                mode: 'detach',
            });
            _____.webContents.inspectElement(_____.rightClickPosition.x, _____.rightClickPosition.y);
            if (_____.webContents.isDevToolsOpened()) {
                _____.webContents.devToolsWebContents.focus();
            }
        },
    });

    _____.menu_list.push({
        label: 'Developer Tools',
        click() {
            _____.webContents.openDevTools({
                mode: 'detach',
            });
        },
    });
}
$('#user_name').html(_____.var.core.session.display);
init_tab();
