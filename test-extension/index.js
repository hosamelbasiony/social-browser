module.exports = function (browser) {
    let extension = {};
    extension.id = '__TikTok';
    extension.name = 'tiktok';
    extension.description = 'Tiktok Tool Managemet';
    extension.paid = false;
    extension.version = '1.0.0';
    extension.canDelete = false;
    extension.init = () => {
        console.log('Tiktok Tool init');
    };
    extension.enable = () => {
        browser.addPreload({
            id: extension.id,
            path: browser.path.join(__dirname, 'preload.js'),
        });

        browser.api.onGET({ name: '/extentions/tiktok', overwrite: true }, (req, res) => {
            res.render(__dirname + '/index.html', {}, { parser: 'html css js', parserDir: __dirname });
        });

        console.log('[TikTok Tool] Route registered: /extentions/tiktok');
    };

    extension.disable = () => {
        browser.removePreload(extension.id);
        browser.api.fsm.off('*tiktok*');
    };

    extension.remove = () => {
        extension.disable();
    };

    return extension;
};
