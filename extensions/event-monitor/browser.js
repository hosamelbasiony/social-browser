module.exports = function (browserManager) {
    const ext = require('./index.js')(browserManager);
    if (ext.init)   ext.init();
    if (ext.enable) ext.enable();
    return ext;
};
