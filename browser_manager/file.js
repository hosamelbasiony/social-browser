module.exports = function (browserManager) {
    const fs = browserManager.fs;

    browserManager.mkdirSync = function (dirname) {
        try {
            if (fs.existsSync(dirname)) {
                return true;
            }
            if (browserManager.mkdirSync(browserManager.path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        } catch (error) {
            browserManager.log(error.message);
            return false;
        }
    };
    browserManager.removeDirSync = function (dirname) {
        browserManager.fs.rmSync(dirname, { recursive: true, force: true });
    };

    browserManager.readFileSync = function (path, encode) {
        let path2 = path + '_tmp';
        if (fs.existsSync(path)) {
            return fs.readFileSync(path).toString(encode || 'utf8');
        } else if (fs.existsSync(path2)) {
            return fs.readFileSync(path2).toString(encode || 'utf8');
        }
        return '';
    };

    browserManager.writeFile = function (path, data, encode) {
        let path2 = path + '_tmp';
        browserManager.deleteFile(path2, () => {
            fs.writeFile(
                path2,
                data,
                {
                    encoding: encode || 'utf8',
                },
                (err) => {
                    if (!err) {
                        browserManager.deleteFile(path, () => {
                            fs.rename(path2, path, (err) => {
                                if (!err) {
                                    browserManager.log('writeFile : ', path);
                                } else {
                                    browserManager.log(err);
                                }

                                // browserManager.deleteFile(path2, () => {
                                //   browserManager.log('writeFile : ', path);
                                // });
                            });
                        });
                    } else {
                        browserManager.log(err);
                    }
                },
            );
        });
    };

    browserManager.deleteFileSync = function (path) {
        try {
            if (fs.existsSync(path)) {
                return fs.unlinkSync(path);
            }
        } catch (error) {
            return null;
        }

        return null;
    };

    browserManager.deleteFile = function (path, callback) {
        try {
            let stats = fs.statSync(path);
            if (stats.isFile()) {
                fs.unlink(path, (err) => {
                    if (!err) {
                        callback(path);
                    } else {
                        browserManager.log(err);
                    }
                });
            } else {
                callback(path);
            }
        } catch (error) {
           // browserManager.log(error);
             callback(path);
        }
    };

    browserManager.parseJson = function (content) {
        try {
            if (content && typeof content === 'string') {
                return JSON.parse(content);
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    browserManager.js = function (name) {
        return browserManager.readFileSync(browserManager.files_dir + '/js/' + name + '.js');
    };
    browserManager.css = function (name) {
        return browserManager.readFileSync(browserManager.files_dir + '/css/' + name + '.css');
    };
    browserManager.html = function (name) {
        return browserManager.readFileSync(browserManager.files_dir + '/html/' + name + '.html');
    };
    browserManager.json = function (name) {
        return browserManager.readFileSync(browserManager.files_dir + '/json/' + name + '.json');
    };
    browserManager.xml = function (name) {
        return browserManager.readFileSync(browserManager.files_dir + '/xml/' + name + '.xml');
    };
};
