if (!document.location.hostname.like('*wintub.com*')) {
    return;
}
var _____ = globalThis.this;

_____.log(' >>> wintub script activated ...');

_____.var.blocking.core.block_empty_iframe = true;
_____.onLoad(() => {
    _____.__showBotImage();

    if (document.getElementById('skipdiv')) {
        window['counter'] = 35;
        window['playit'] = true;
        if (window['ytCounter']) {
            window['ytCounter']();
        }
    }
});
