module.exports = function (browserManager) {
    // Wire index.js into the browser manager extension system
    const ext = require('./index.js')(browserManager);

    // Auto-enable on load so the route is immediately available
    if (ext.init)   ext.init();
    if (ext.enable) ext.enable();

    return ext;
};