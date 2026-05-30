if (document.location.hostname.contains('addmefast.com')) {
    var _____ = globalThis.this;

    if (_____.browserData.customSetting.$cloudFlare) {
        return;
    }
    _____.onLoad(() => {
        _____.log(' :: Addmefast Activated :: ' + document.location.href);

        _____.var.blocking.core.block_empty_iframe = false;

        _____.__showBotImage();
        window.clicked = window.clicked || 0;

        document.querySelectorAll('a[href]').forEach((a) => {
            if (!a.getAttribute('xff')) {
                a.setAttribute('xff', 'xff');

                if (a.href.like('*facebook*|*youtube*|*instagram*|*telegram*|*tiktok*|*twitter*|*websites*|*twitch*|*pinterest*|*like*|*soundcloud*|*vkontakte*|*ok_group*|*reverbnation*')) {
                    // a.href += '#___new_popup___';
                    // a.setAttribute('target', '_blank');
                    a.style.cursor = 'pointer';
                    let url = a.href;
                    a.removeAttribute('href');
                    a.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();

                        _____.ipc('[open new popup]', {
                            show: true,
                            partition: _____.partition,
                            url: url,
                            referrer: document.location.href,
                            iframe: true,
                            center: true,
                            allowAduio: false,
                        });
                    });
                }
            }
        });

        if (document.location.href.contains('reverbnation_fan|ok_group_join|askfm|pinterest|telegram|instagram|twitter|tiktok|soundcloud|youtube|facebook')) {
            _____.customSetting.allowURLs = '*addmefast*';
            _____.customSetting.timeout = 1000 * 20;

            let waitingNumber = _____.customSetting.timeout / 1000;

            clearInterval(_____.addmefastInterval);
            _____.addmefastInterval = setInterval(() => {
                if (waitingNumber > 0) {
                    alert('Waiting ' + waitingNumber + ' sec');
                }
                waitingNumber--;

                if ((single_like_button = document.querySelector('a.single_like_button'))) {
                    if (!single_like_button.id.like('*confirm*') && single_like_button.style.display != 'none') {
                        single_like_button.click();
                        single_like_button.style.display = 'none';
                        waitingNumber = _____.customSetting.timeout / 1000;
                    }
                }

                if ((content = document.querySelector('#content'))) {
                    if (content.innerText.contains('Please try later')) {
                        clearInterval(_____.addmefastInterval);
                        alert('Reload Page After : 10 sec', 1000 * 10);
                        setTimeout(() => {
                            document.location.reload();
                        }, 1000 * 10);
                        return;
                    }
                }
            }, 1000);

            window.open = function (url, _name, _specs, _replace_in_history) {
                let child_window = {
                    closed: false,
                    opener: window,
                    innerHeight: 1028,
                    innerWidth: 720,

                    postMessage: function (...args) {
                        //  _____.log('postMessage child_window', args);
                    },
                    eval: function () {
                        // _____.log('eval child_window');
                    },
                    close: function () {
                        //  _____.log('close child_window');
                        this.closed = true;
                    },
                    focus: function () {
                        // _____.log('focus child_window');
                    },
                    blur: function () {
                        //  _____.log('focus child_window');
                    },
                    print: function () {
                        // _____.log('print child_window');
                    },
                    document: {
                        write: function () {
                            // _____.log('document write child_window');
                        },
                        open: function () {
                            // _____.log('document write child_window');
                        },
                        close: function () {
                            // _____.log('document write child_window');
                        },
                    },
                    self: this,
                };

                url = _____.handleURL(url);
                if (url.contains('youtube.com')) {
                    _____.customSetting.timeout = 1000 * 30;
                }

                let win = _____.openWindow({
                    width: _specs.width,
                    height: _specs.height,
                    url: url,
                    referrer: document.location.href,
                    show: false,
                    windowType: 'client-popup',
                    frame: true,
                    resizable: true,
                    skipTaskbar: false,
                    allowAduio: false,
                    vip: true,
                });

                child_window.postMessage = function (data, origin, transfer) {
                    win.postMessage(data, origin, transfer);
                };
                child_window.addEventListener = win.on;

                win.on('closed', (e) => {
                    child_window.postMessage = () => {};
                    child_window.eval = () => {};
                    child_window.closed = true;
                    let single_like_button = document.querySelector('a.single_like_button');
                    if (single_like_button && single_like_button.id.like('*confirm*') && single_like_button.style.display != 'none') {
                        single_like_button.click();
                        waitingNumber = 0;
                        alert('Collect POints');
                    }
                });

                child_window.eval = win.eval;

                child_window.close = win.close;

                child_window.win = win;

                return child_window;
            };

            if ((timeout = document.querySelector('#timeoutxxx'))) {
                if (timeout.style.display != 'none') {
                    alert('Reload Page After : 10 sec');
                    setTimeout(() => {
                        document.location.reload();
                    }, 1000 * 10);
                    return;
                }
            }
            if (document.querySelector('#content #content')) {
                alert('Reload Page After : 10 sec');
                setTimeout(() => {
                    document.location.reload();
                }, 1000 * 10);
                return;
            }

            if (document.location.href.contains('youtube_views|soundcloud_views')) {
                let captca_count = 0;
                let img_handle = false;
                setInterval(() => {
                    let btn = document.querySelector('#human_check');
                    if (btn) {
                        document.querySelector('title').innerText = '^_^';
                        setTimeout(() => {
                            document.querySelector('title').innerText = '): ^';
                        }, 500);

                        captca_count++;
                        if (captca_count > 5) {
                            let btn_submit = document.querySelector('#submit_button');
                            if (btn_submit) {
                                btn_submit.click();
                                captca_count = 0;
                            }
                        }
                    } else {
                        if (document.querySelector('title') && document.location.href.contains('youtube_views')) {
                            document.querySelector('title').innerText = 'AddMeFast.com - YouTube Views';
                        } else if (document.querySelector('title') && document.location.href.contains('soundcloud_views')) {
                            document.querySelector('title').innerText = 'AddMeFast.com - SoundCloud Views';
                        }

                        captca_count = 0;
                        img_handle = false;
                    }
                }, 3000);
            }
        }

        if (document.location.href.contains('websites')) {
            if (!document.f) {
                document.f = { m_text: { value: 0 } };
            }

            function rrr() {
                document.querySelectorAll('iframe').forEach((f) => {
                    if (f.id == 'preview-frame') {
                        f.remove();
                    }
                });
                setTimeout(() => {
                    rrr();
                }, 500);
            }
            rrr();
        }
    });
}
