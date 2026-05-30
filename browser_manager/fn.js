module.exports = function init(browserManager) {
    browserManager.makeID = function (length = 12) {
        let result = '';

        let characters = 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
        let charactersLength = characters.length;

        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        return result;
    };

    browserManager.get_dynamic_var = function (info) {
        info.name = info.name || '*';
        if (info.name == '*') {
            return browserManager.var;
        } else {
            let arr = info.name.split(',');
            let obj = {};
            arr.forEach((k) => {
                if ((k == 'user_data' || k == 'user_data_input') && info.hostname) {
                    obj[k] = [];
                    browserManager.var[k].forEach((dd) => {
                        dd.hostname = dd.hostname || dd.host || '';
                        dd.url = dd.url || '';
                        if (dd.hostname.contains(info.hostname) || info.hostname.contains(dd.hostname)) {
                            obj[k].push(dd);
                        }
                    });
                } else {
                    obj[k] = browserManager.var[k];
                }
            });
            return arr.length == 1 ? obj[info.name] : obj;
        }
    };

    browserManager.updateTab = function (setting) {
        console.log(setting);
    };

    browserManager.run = function (argv = []) {
        // Must use spawn instead of fork to allow running electron functions (e.g., ipcMain) in the child process
        return browserManager.child_process.spawn(process.argv[0], argv, {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        });
    };

    browserManager.exe = function (app_path, args) {
        try {
            browserManager.log('browserManager.exe()', app_path, args);
            browserManager.child_process.execFile(app_path, args, function (err, stdout, stderr) {
                if (err) {
                    browserManager.log(err);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    browserManager.exec = function (cmd, callback, options = {}) {
        try {
            browserManager.log('browserManager.exec()', cmd);
            callback = callback || {};
            let exec = browserManager.child_process.exec;
            return exec(cmd, options, function (error, stdout, stderr) {
                callback(error, stdout, stderr, cmd);
            });
        } catch (error) {
            console.log(error);
            callback(error, null, null, cmd);
        }
    };

    browserManager.powerShell = function (cmd, callback) {
        browserManager.exec(cmd, callback, { shell: 'powershell.exe' });
    };

    browserManager.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    browserManager.handleObject = function (doc) {
        if (!doc) {
            return null;
        }
        if (Array.isArray(doc)) {
            doc.forEach((v, i) => {
                doc[i] = browserManager.handleObject(v);
            });
        } else if (typeof doc === 'object') {
            for (let key in doc) {
                let val = doc[key];

                if (typeof key === 'string') {
                    if (key.startsWith('$')) {
                        delete doc[key];
                        continue;
                    }
                }
                if (Array.isArray(val)) {
                    val.forEach((v) => {
                        v = browserManager.handleObject(v);
                    });
                } else if (typeof val === 'object') {
                    val = browserManager.handleObject(val);
                }
            }
        }

        return doc;
    };

    browserManager.to_dateX = function (d) {
        d = d || new Date();
        return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };

    browserManager.cookieParse = (cookie) => {
        if (typeof cookie === 'undefined') return [];
        return cookie.split(';').reduce(function (prev, curr) {
            let m = / *([^=]+)=(.*)/.exec(curr);
            if (m) {
                let key = browserManager.decodeURIComponent(m[1]);
                let value = browserManager.decodeURIComponent(m[2]);
                prev[key] = value;
            }
            return prev;
        }, {});
    };

    browserManager.cookieStringify = (cookie) => {
        let out = '';
        for (let co in cookie) {
            out += browserManager.encodeURIComponent(co) + '=' + browserManager.encodeURIComponent(cookie[co]) + ';';
        }
        return out;
    };

    browserManager.get_network = function () {
        let addresses = {};
        try {
            let ifaces = browserManager.os.networkInterfaces();
            let hasAddresses = false;
            Object.keys(ifaces).forEach(function (iface) {
                ifaces[iface].forEach(function (address) {
                    if (!hasAddresses && !address.internal) {
                        addresses[(address.family || '').toLowerCase()] = address.address;
                        if (address.mac && address.mac !== '00:00:00:00:00:00') {
                            addresses = address;
                            hasAddresses = true;
                        }
                    }
                });
            });
        } catch (e) {
            browserManager.log(e);
        }
        return addresses;
    };

    browserManager.json_to_html = function (data) {
        let content = '';

        data.forEach((el) => {
            if (el.type == 'text') {
                content += `<p> ${el.value} </p>`;
            } else if (el.type == 'text2') {
                content += `<div class="text2" > 
                <div class="value"> ${el.value} </div>
                <div class="value2"> ${el.value2} </div>
            </div>`;
            } else if (el.type == 'text2b') {
                content += `<div class="text2b" > 
                <div class="value"> ${el.value} </div>
                <div class="value2"> ${el.value2} </div>
            </div>`;
            } else if (el.type == 'line') {
                content += `<div class="line" > </div>`;
            } else if (el.type == 'line2') {
                content += `<div class="line2" > </div>`;
            } else if (el.type == 'line3') {
                content += `<div class="line3" > </div>`;
            } else if (el.type == 'invoice-top-title') {
                content += `<p class="invoice-top-title" > ${el.name} </p>`;
            } else if (el.type == 'invoice-header') {
                content += `<h2 class="invoice-header" > ${el.name} </h2>`;
            } else if (el.type == 'invoice-footer') {
                content += `<h2 class="invoice-footer" > ${el.name} </h2>`;
            } else if (el.type == 'invoice-logo') {
                content += `<div class="invoice-logo" > <img src="${el.url}" /> </div>`;
            } else if (el.type == 'title') {
                content += `<h1 class="title" > ${el.value} </h1>`;
            } else if (el.type == 'space') {
                content += `<br>`;
            } else if (el.type == 'invoice-code') {
                content += `<div class="invoice-code" > 
                                <div class="name"> ${el.name} </div>
                                <div class="value"> ${el.value} </div>
                            </div>`;
            } else if (el.type == 'invoice-date') {
                content += `<div class="invoice-date" > 
                                <div class="name"> ${el.name} </div>
                                <div class="value"> ${el.value} </div>
                            </div>`;
            } else if (el.type == 'invoice-total') {
                content += `<div class="invoice-total" > 
                                <div class="name"> ${el.name} </div>
                                <div class="value"> ${el.value} </div>
                            </div>`;
            } else if (el.type == 'invoice-item-title') {
                content += `
                            <div class="invoice-item-title">
                                <div class="count"> ${el.count} </div>
                                <div class="name"> ${el.name} </div>
                                <div class="price"> ${el.price} </div>
                            </div>
                `;
            } else if (el.type == 'invoice-item') {
                content += `
                <div class="invoice-item">
                    <div class="count"> ${el.count} </div>
                    <div class="name"> ${el.name} </div>
                    <div class="price"> ${el.price} </div>
                </div>
    `;
            } else if (el.type == 'invoice-barcode') {
                content += `<div class="invoice-barcode" > 
                                <svg class="barcode"
                                    jsbarcode-format="auto"
                                    jsbarcode-value="${el.value}"
                                    jsbarcode-textmargin="0"
                                    jsbarcode-fontoptions="bold">
                                </svg>
                            </div>`;
            }
        });

        let html = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Printing Viewer</title>
                <script src="http://127.0.0.1:60080/js/JsBarcode.all.min.js"></script>
                <link rel="stylesheet" href="http://127.0.0.1:60080/css/printing.css">
            </head>
            <body>
                ${content}
                <script>
                    JsBarcode(".barcode").init();
                </script>
            </body>
            </html>
        `;

        return html;
    };
};
