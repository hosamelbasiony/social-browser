(() => {
    const _____ = globalThis.this;

    if (_____) {
        _____.__setConstValue(window, 'adsbygoogle', {
            loaded: true,
            pageState: {
                stavq: 2021,
                jTCuI: 'r20251105',
                OmOVT: false,
                xujKL: false,
                AyxaY: 1770789904,
                SLqBY: '.google.com.eg',
                xVQAt: 'r20190131',
                OSCLM: {
                    UWEfJ: false,
                    YguOd: false,
                    SVQEK: false,
                },
                jzoix: {
                    PygXN: [],
                },
                gjPrg: '',
                ANqoe: '',
                FJPve: false,
                GLnKw: false,
                tYcft: {},
                EGzMj: {},
                uNjDc: false,
            },
            push: () => {},
        });
        _____.__setConstValue(window, 'adblockDetector', {
            init(o) {
                o?.complete?.(false);
                setInterval(() => {
                    o?.notfound?.();
                }, 1000);
            },
        });
        _____.__setConstValue(window, 'googleAd', true);
        _____.__setConstValue(window, 'canRunAds', true);
        _____.__setConstValue(window, 'adsNotBlocked', true);
        _____.__setConstValue(window, '$tieE3', true);
        _____.__setConstValue(window, '$zfgformats', []);
        _____.__setConstValue(window, 'adbDetectorLoaded', 'loaded');
        _____.__setConstValue(window, 'adblock', false);
        _____.__setConstValue(window, '_AdBlock_init', {});
        _____.__setConstValue(window, '_AdBlock', () => {});
        _____.__setConstValue(window, 'NativeAd', () => {});
        _____.__setConstValue(window, 'TsInPagePush', () => {});
        _____.__setConstValue(window, 'ExoLoader', {
            addZone: () => {},
            serve: () => {},
        });
        _____.__setConstValue(window, 'ExoVideoSlider', {
            init: () => {},
        });
    }

    let query = JSON.parse('##query.*##');
    for (const key in query) {
        if (typeof window[key] == 'function') {
            window[key]();
        }
    }
})();
