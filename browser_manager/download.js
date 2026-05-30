module.exports = function (browserManager) {
    browserManager.downloadList = [];
    browserManager.download = function (options, callback) {
        console.log(options);
        if (!options.url || !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(options.url)) {
            options.error = 'URL Not Url formated';
            callback(options);
            return false;
        }
        if (browserManager.downloadList.some((x) => x == options.url)) {
            options.error = 'URL Downloaded Exits';
            callback(options);
            return false;
        }
        browserManager.downloadList.push(options.url);
        browserManager.api
            .fetch(options.url, {
                headers: {
                    'User-Agent': browserManager.var.core.defaultUserAgent.url,
                },
            })
            .then((res) => {
                const dest = browserManager.fs.createWriteStream(options.path);
                res.body.pipe(dest);
                callback(options);
            })
            .catch((err) => {
                options.error = err.message;
                callback(options);
                browserManager.fs.unlink(options.path , () => {});
            });
    };
};
