if (document.location.hostname.like('*amazon.eg*')) {
    var _____ = globalThis.this;
    
    _____.log(' >>> marketing Extension activated : ' + document.location.href);
    _____.onLoad(() => {
        _____.__showBotImage();
        _____.menu_list.push({
            label: ' ( Price Comparison ) ',
            click: () => {
                _____.ipc('[open new popup]', {
                    url: 'https://www.kanbkam.com/eg/ar/search/l?q=' + document.location.href,
                    referrer: document.location.href,
                    partition: _____.partition,
                    user_name: _____.session.display,
                    show: true,
                });
            },
        });
    });
}
