module.exports = function init(browserManager) {
    browserManager.api = require('isite')({
        port: [60080, 60000],
        name: 'Social API',
        dir: browserManager.files_dir + '',
        stdin: false,
        apps: false,
        help: false,
        _0x14xo: !0,
        public: true,
        lang: 'en',
        log: true,
        help: true,
        https: {
            enabled: true,
            port: 60043,
        },
        cache: {
            enabled: false,
        },
        mongodb: {
            enabled: false,
            db: 'social-browser-db',
            limit: 100000,
            identity: {
                enabled: true,
            },
        },
        session: {
            enabled: false,
            save: false,
        },
        security: {
            enabled: true,
        },
        proto: {
            object: false,
        },
    });

    browserManager.api.getBrowser = function () {
        return browserManager;
    };
    browserManager.api.loadLocalApp('client-side');
    browserManager.api.loadLocalApp('security');
    browserManager.api.loadLocalApp('charts');

    browserManager.api.onGET('/empty', (req, res) => {
        res.end();
    });

    browserManager.api.onGET('/newTab', (req, res) => {
        res.end();
    });

    browserManager.api.onALL({
        name: '/favicon.ico',
        path: browserManager.files_dir + '/images/logo.ico',
        parser: 'js',
    });

    browserManager.api.onALL({
        name: '/js',
        path: browserManager.files_dir + '/js2',
        parser: 'js',
    });

    browserManager.api.onALL({
        name: '/js',
        path: browserManager.files_dir + '/js',
        parser: 'js',
    });
    // browserManager.api.onALL({
    //     name: '/css',
    //     path: browserManager.files_dir + '/css',
    //     parser: 'css',
    // });
    browserManager.api.onALL({
        name: '/images',
        path: browserManager.files_dir + '/images',
        overwrite: true,
    });
    // browserManager.api.onALL({
    //     name: '/txt',
    //     path: browserManager.files_dir + '/txt',
    // });
    // browserManager.api.onALL({
    //     name: '/html',
    //     path: browserManager.files_dir + '/html',
    // });

    browserManager.api.onALL({
        name: '/',
        path: browserManager.files_dir,
    });

    browserManager.api.onGET({
        name: '/chat',
        path: browserManager.files_dir + '/html/chat.html',
        parser: 'html css js',
    });
    browserManager.api.onGET({
        name: '/setting',
        path: browserManager.files_dir + '/html/setting.html',
        parser: 'html css js',
    });
    browserManager.api.onGET({
        name: '/block-site',
        path: browserManager.files_dir + '/html/block-site.html',
        parser: 'html css js',
    });

    browserManager.api.onGET({
        name: ['/iframe', '/youtube-view'],
        path: browserManager.files_dir + '/html/iframe-view.html',
        parser: 'html css js',
    });
    browserManager.api.onGET({
        name: ['/video'],
        path: browserManager.files_dir + '/html/video-view.html',
        parser: 'html css js',
    });
    browserManager.api.onGET({
        name: '/error*',
        path: browserManager.files_dir + '/html/error.html',
        parser: 'html css js',
    });

    browserManager.api.onGET({
        name: '/home',
        path: browserManager.files_dir + '/html/main-window.html',
        parser: 'html css js',
    });

    browserManager.api.onGET({
        name: '/home2',
        path: browserManager.files_dir + '/html/browserWindow.html',
        parser: 'html css js',
    });

    browserManager.api.onGET({
        name: '/downloads*',
        path: browserManager.files_dir + '/html/downloads.html',
        parser: 'html',
    });

    browserManager.api.onGET({
        name: '/prompt*',
        path: browserManager.files_dir + '/html/prompt.html',
        parser: 'html',
    });
  browserManager.api.onGET({
        name: '/confirm*',
        path: browserManager.files_dir + '/html/confirm.html',
        parser: 'html',
    });
      browserManager.api.onGET({
        name: '/login*',
        path: browserManager.files_dir + '/html/login.html',
        parser: 'html',
    });
    browserManager.api.onALL('/printers/all', (req, res) => {
        browserManager.webContent.getPrintersAsync().then((arr) => {
            res.json({
                done: true,
                list: arr,
            });
        });
    });

    browserManager.api.onPOST('/api/activated-by-online-key', (req, res) => {
        browserManager.onLineActivated({ key: req.data.key }, (err, data) => {
            res.json({
                done: true,
                browser: browserManager.var.core.browser,
                data: data,
                error: err?.message,
            });
        });
    });

    browserManager.api.onGET('/api/cookies', (req, res) => {
        browserManager.getCookiesByPartition(req.query.partition).then((cookies) => {
            res.json({
                done: true,
                cookies: cookies,
            });
        });
    });

    browserManager.api.jsList = [];
    browserManager.api.onGET('/get-js', async (req, res) => {
        let jsObject = browserManager.api.jsList.find((j) => j.url == req.query.url);
        if (jsObject) {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
            res.end(jsObject.code, 'utf8');
            return;
        } else if (req.query.url) {
            let response = await browserManager.api.fetch(req.query.url, {
                mode: 'cors',
                method: 'get',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.4638.54 Safari/537.36',
                },
                redirect: 'follow',
            });

            if (response && response.status == 200) {
                res.set('Content-Type', 'application/javascript; charset=utf-8');
                let code = await response.text();
                jsObject = { url: req.query.url, code: code };
                browserManager.api.jsList.push(jsObject);
                res.end(code, 'utf8');
            } else {
                res.set('Content-Type', 'application/javascript; charset=utf-8');
                res.end('/* error load url */', 'utf8');
            }
        } else {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
            res.end('/* no url */', 'utf8');
        }
    });
    browserManager.api.onPOST({ name: '/__social_browser/api/import-cookie-list', overwrite: true }, (req, res) => {
        let response = {
            done: true,
            file: req.form.files.fileToUpload,
            list: [],
        };

        if (browserManager.api.isFileExistsSync(response.file.filepath)) {
            let socialFile = { fileType: 'cookieList' };
            if (response.file.originalFilename.like('*.xls*')) {
                let workbook = browserManager.XLSX.readFile(response.file.filepath);
                socialFile.list = browserManager.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else if (response.file.originalFilename.like('*.social*')) {
                socialFile = browserManager.api.readFileSync(response.file.filepath).toString();
                socialFile = JSON.parse(browserManager.api.from123(socialFile));
            } else if (response.file.originalFilename.like('*.json*')) {
                socialFile.list = browserManager.api.fromJson(browserManager.api.readFileSync(response.file.filepath).toString());
            } else {
                let list = browserManager.api.readFileSync(response.file.filepath).toString();
                list = list.split('\r\n');
                list.forEach((data, i) => {
                    list[i] = list[i].trim();
                    if (list[i] && list[i].length > 0) {
                        let cookieLine = list[i].split(':');
                        socialFile.list.push({
                            domain: cookieLine[0],
                            cookie: cookieLine[1],
                            partition: cookieLine[2] || browserManager.var.core.session.name,
                        });
                    }
                });
            }

            if (socialFile.fileType == 'cookieList') {
                socialFile.list.forEach((c0, i) => {
                    let cookieIndex = browserManager.var.cookieList.findIndex((c) => c.domain == c0.domain && c.partition == c0.partition);
                    if (cookieIndex === -1) {
                        browserManager.var.cookieList.push(c0);
                    } else {
                        browserManager.var.cookieList[cookieIndex].cookie = c0.cookie;
                        if (typeof c0.lock !== 'undefined') {
                            browserManager.var.cookieList[cookieIndex].lock = c0.lock;
                        }
                        if (typeof c0.off !== 'undefined') {
                            browserManager.var.cookieList[cookieIndex].off = c0.off;
                        }
                    }
                });
                browserManager.applay('cookieList');
            }
            response.list = socialFile.list;
            res.json(response);
        }
    });

    browserManager.api.onGET({ name: '/__social_browser/api/export-cookie-list', overwrite: true }, (req, res) => {
        let socialFile = browserManager.api.to123({ fileType: 'cookieList', list: browserManager.var.cookieList });
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': socialFile.length,
            'Content-Disposition': 'attachment; filename=' + 'cookieList.social',
        });
        res.end(socialFile);
    });

    browserManager.api.onPOST('/api/proxy/import', (req, res) => {
        let response = {
            done: false,
            file: req.form.files.proxyFile,
        };

        if (!response.file) {
            response.error = 'No File Uploaded';
            res.json(response);
            return;
        }

        if (browserManager.api.isFileExistsSync(response.file.filepath)) {
            let docs = [];
            if (response.file.originalFilename.like('*.xlsx') || response.file.originalFilename.like('*.xls')) {
                let workbook = browserManager.XLSX.readFile(response.file.filepath);
                docs = browserManager.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else if (response.file.originalFilename.like('*.csv')) {
                let file = browserManager.api.readFileSync(response.file.filepath);
                file = file.split('\n');
                if (file.length === 1) {
                    file = file[0].split(' ');
                }

                file.forEach(function (d, i) {
                    tmp = {};
                    let row = d.split(',');
                    if (row.length == 2) {
                        tmp.ip = row[0].replaceAll('"', '');
                        tmp.port = row[1].replaceAll('"', '');
                    } else if (row.length == 4) {
                        tmp.ip = row[0].replaceAll('"', '');
                        tmp.port = row[1].replaceAll('"', '');
                        tmp.username = row[0].replaceAll('"', '');
                        tmp.password = row[1].replaceAll('"', '');
                    } else {
                    }
                    docs.push(tmp);
                });
            } else if (response.file.originalFilename.like('*.txt')) {
                let docs2 = browserManager.api.readFileSync(response.file.filepath).toString().split('\n');
                docs2.forEach((line) => {
                    docs.push({
                        ip: line.split(':')[0],
                        port: line.split(':')[1],
                        username: line.split(':')[2],
                        password: line.split(':')[3],
                    });
                });
            } else {
                docs = browserManager.api.fromJson(browserManager.api.readFileSync(response.file.filepath).toString());
            }

            if (Array.isArray(docs)) {
                response.done = true;
                console.log('Importing Proxy Array Count : ' + docs.length);
                browserManager.var.proxy_list = [];
                docs.forEach((doc) => {
                    console.log('Importing Proxy : ', doc);
                    if (typeof doc === 'string') {
                        doc = { url: doc };
                    }

                    doc.ip = doc.ip || doc.IP || doc['IP Address'];
                    doc.port = doc.port || doc.Port || doc.PORT;
                    doc.username = doc.username || doc.Username || doc.USERNAME;
                    doc.password = doc.password || doc.Password || doc.PASSWORD;

                    if (!doc.url && doc.ip && doc.port) {
                        doc.url = doc.ip + ':' + doc.port;
                    } else if (doc.url && (!doc.ip || !doc.port)) {
                        let arr = doc.url.split(':');
                        if (arr.length == 2) {
                            doc.ip = arr[0];
                            doc.port = arr[1];
                        } else if (arr.length == 4) {
                            doc.ip = arr[0];
                            doc.port = arr[1];
                            doc.username = arr[2];
                            doc.password = arr[3];
                        }
                    }

                    if (doc.ip && doc.port) {
                        browserManager.var.proxy_list.push({
                            mode: 'fixed_servers',
                            url: doc.url,
                            ip: doc.ip,
                            port: doc.port,
                            username: doc.username,
                            password: doc.password,
                            socks5: false,
                            socks4: false,
                            http: false,
                            https: false,
                            direct: false,
                            ftp: false,
                        });
                    }
                });
                browserManager.set_var('proxy_list', browserManager.var.proxy_list);
            }
        } else {
            response.error = 'file not exists : ' + response.file.filepath;
        }

        res.json(response);
    });

    browserManager.api.onPOST({ name: ['/printing', '/print'], public: true }, (req, res) => {
        let id = new Date().getTime();

        let print_options = {
            silent: true,
            printBackground: true,
            printSelectionOnly: false,
            deviceName: null,
            color: true,
            landscape: false,
            scaleFactor: null,
            pagesPerSheet: 1,
            collate: false,
            copies: 1,
            pageRanges: {
                from: 0,
                to: 0,
            },
            duplexMode: null,
            dpi: req.data.dpi || {},
            header: null,
            footer: null,
            pageSize: req.data.pageSize || 'A4',
            width: null,
            margins: req.data.margins,
        };

        if (req.data.data) {
            req.data.type = req.data.type || 'html';
            req.data.html = browserManager.json_to_html(req.data.data);
        }

        if (print_options.pageSize == 'Letter') {
            print_options.width = 320;
            print_options.margins = {
                marginType: 'none',
            };
        }

        if (req.data.view) {
            print_options.silent = false;
        } else {
            print_options.silent = true;
            print_options.deviceName = req.data.printer || 'Microsoft Print to PDF';
        }

        let content = {
            id: id,
            data: req.data.html,
            type: req.data.type,
            origin: req.data.origin,
            url: req.data.href,
            windowID: req.data.windowID,
            options: { ...print_options, ...req.data },
            index: browserManager.content_list.length,
        };

        browserManager.content_list.push(content);

        browserManager.createChildProcess({
            url: 'http://127.0.0.1:60080/print-content/' + content.id,
            windowType: 'popup',
            show: false,
            partition: 'print',
            sandbox: false,
            eval: browserManager.api.readFileSync(browserManager.dir + '/printing/preload.js'),
            allowAudio: false,
            showDevTools: false,
        });

        res.json({
            done: true,
        });
    });

    browserManager.api.onGET('/print-content/:id', (req, res) => {
        if ((pdf = browserManager.content_list.find((p) => p.id == req.params.id))) {
            if (pdf.type == 'html') {
                res.set('Content-Type', 'text/html; charset=utf-8');
                res.end(pdf.data, 'utf8');
            } else {
                res.set('Content-Type', 'application/pdf');
                res.end(pdf.data);
            }
        } else {
            res.json({
                error: 'pdf id not exists : ' + req.params.id,
                length: browserManager.content_list.length,
            });
        }
    });

    browserManager.api.onPOST('/data-content/:id', (req, res) => {
        let content = browserManager.content_list.find((p) => p.id == req.params.id) || {};
        res.json({
            options: content.options,
        });
    });

    browserManager.api.onGET('/api/var', (req, res) => {
        res.json({
            done: true,
            var: browserManager.var,
        });
    });

    browserManager.api.onGET('/api/var/setting', (req, res) => {
        res.json({
            done: true,
            var: {
                core: browserManager.var.core,
                login: browserManager.var.login,
                bookmarks: browserManager.var.bookmarks,
                black_list: browserManager.var.blocking.black_list,
                white_list: browserManager.var.blocking.white_list,
                vip_site_list: browserManager.var.blocking.vip_site_list,
                session_list: browserManager.var.session_list,
                userAgentList: browserManager.var.userAgentList,
                user_data_input: browserManager.var.user_data_input,
                blocking: browserManager.var.blocking,
                popup: browserManager.var.popup,
                proxy: browserManager.var.proxy,
                proxy_list: browserManager.var.proxy_list,
                open_list: browserManager.var.blocking.open_list,
                context_menu: browserManager.var.context_menu,
                downloader: browserManager.var.downloader,
                javascript: browserManager.var.javascript,
                facebook: browserManager.var.blocking.facebook,
                twitter: browserManager.var.twitter,
                youtube: browserManager.var.youtube,
                internet_speed: browserManager.var.blocking.internet_speed,
            },
        });
    });

    browserManager.api.onGET('/api/var/setting/:key', (req, res) => {
        let key = req.paramsRaw.key;
        let obj = {};

        obj[key] = browserManager.var[key];

        res.json({
            done: true,
            key: key,
            var: obj,
        });
    });

    browserManager.api.onPOST('/api/var', (req, res) => {
        res.json({
            done: true,
        });

        let v = req.data.var;
        for (let k of Object.keys(v)) {
            browserManager.set_var(k, v[k]);
        }
    });

    browserManager.api.onGET('/api/download_list', (req, res) => {
        res.json({
            done: true,
            list: browserManager.var.download_list,
        });
    });
    browserManager.api.onPOST('/api/download_list/pause-item', (req, res) => {
        let index = browserManager.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            browserManager.var.download_list[index].status = 'pause';
            browserManager.sendToAll({ type: '$download_item', data: browserManager.var.download_list[index] });
            browserManager.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 'pause';
            browserManager.var.download_list.push(req.data);
            browserManager.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        browserManager.set_var('download_list', browserManager.var.download_list);
    });

    browserManager.api.onPOST('/api/download_list/remove-item', (req, res) => {
        let index = browserManager.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            browserManager.var.download_list[index].status = 'delete';
            browserManager.sendToAll({ type: '$download_item', data: browserManager.var.download_list[index] });
            browserManager.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 'delete';
            browserManager.var.download_list.push(req.data);
            browserManager.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        browserManager.set_var('download_list', browserManager.var.download_list);
    });
    browserManager.api.onPOST('/api/download_list/redownload-item', (req, res) => {
        let index = browserManager.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            browserManager.var.download_list[index].status = 're-download';
            browserManager.sendToAll({ type: '$download_item', data: browserManager.var.download_list[index] });
            browserManager.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 're-download';
            browserManager.var.download_list.push(req.data);
            browserManager.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        browserManager.set_var('download_list', browserManager.var.download_list);
    });

    browserManager.api.onPOST('/api/download_list/resume-item', (req, res) => {
        let index = browserManager.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            browserManager.var.download_list[index].status = 'resume';
            browserManager.sendToAll({ type: '$download_item', data: browserManager.var.download_list[index] });
            browserManager.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 'resume';
            browserManager.var.download_list.push(req.data);
            browserManager.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        browserManager.set_var('download_list', browserManager.var.download_list);
    });

    browserManager.api.onGET('/api/var/export', (req, res) => {
        let file = browserManager.api.to123({ fileType: 'var', var: browserManager.var });
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': file.length,
            'Content-Disposition': 'attachment; filename=' + 'setting.social',
        });
        res.end(file);
    });

    browserManager.api.onPOST('/api/var/import', (req, res) => {
        let response = {
            done: true,
            file: req.form.files.fileToUpload,
        };

        if (browserManager.api.isFileExistsSync(response.file.filepath)) {
            let socialFile = { fileType: 'cookieList' };
            if (response.file.originalFilename.like('*.social*')) {
                socialFile = browserManager.api.readFileSync(response.file.filepath).toString();
                socialFile = JSON.parse(browserManager.api.from123(socialFile));
            }

            if (socialFile.fileType == 'var') {
                for (const key in socialFile.var) {
                    browserManager.var[key] = socialFile.var[key];
                    browserManager.applay(key);
                }
            }

            res.json(response);
        }
    });

    browserManager.api.run();
};
