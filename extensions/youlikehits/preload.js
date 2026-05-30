if (!document.location.hostname.contains('youlikehits.com')) {
    return;
}
var _____ = globalThis.this;

_____.onLoad(() => {
    _____.customSetting.allowURLs = '*youlikehits.com*|*jquery*|*static.cloudflareinsights.com*';
    _____.customSetting.alwaysOnTop = false;
    _____.customSetting.allowAudio = false;
    _____.customSetting.allowDownload = false;
    _____.customSetting.allowSaveUrls = false;
    _____.customSetting.allowSaveUserData = false;
    _____.customSetting.iframe = true;
    _____.customSetting.timeout = 1000 * 30;

    _____.var.blocking.core.block_empty_iframe = false;

    if (document.location.href.like('*youtubenew2*')) {
        _____.customSetting.timeout = 1000 * 60 * 5;
        _____.customSetting.hide = true;

        _____.onEvent('window-loaded', () => {
            alert('New Youtube Video Viewing Now ......', 1000 * 20);
        });

        let clickReady = false;

        function clickViewButton() {
            if (typeof cnum == 'number' && cnum == 0) {
                if (true || parseInt(document.querySelector('#listall').innerText.split(': ')[1]?.split('\n')[0] || '1') > 3) {
                    if (!clickReady) {
                        clickReady = true;
                    } else {
                        if ((a = document.querySelector('#listall a.followbutton'))) {
                            if (a.innerText.like('view')) {
                                a.click();
                                clickReady = false;
                            }
                        }
                    }
                } else {
                    if ((a = document.querySelector('#listall a:last-child'))) {
                        a.click();
                    }
                }
            }

            setTimeout(() => {
                clickViewButton();
            }, 1000 * 5);
        }
        clickViewButton();
    }
    if (document.location.href.like('*youtube2*')) {
        _____.customSetting.timeout = 1000 * 40;
        _____.customSetting.hide = true;

        _____.onEvent('window-loaded', () => {
            alert('New Youtube Video subscribing Now ......', 1000 * 30);
        });

        _____.onEvent('window-closed', () => {
            confirmSubscribe();
        });

        function confirmSubscribe() {
            if ((a = document.querySelector('#DoesLike button'))) {
                if (a.innerText.like('*confirm*')) {
                    a.click();
                    setTimeout(() => {
                        clickLikeButton();
                    }, 1000 * 20);
                    return;
                }
            }
            confirmSubscribe();
        }

        function clickLikeButton() {
            if ((a = document.querySelector('a.followbutton'))) {
                if (a.innerText.like('*subscribe*')) {
                    a.click();
                }
            }
            if ((a = document.querySelector('a.likebutton'))) {
                if (a.innerText.like('*subscribe*')) {
                    a.click();
                    return;
                }
            }
            setTimeout(() => {
                clickLikeButton();
            }, 1000 * 5);
        }
        clickLikeButton();
    }
    if (document.location.href.like('*youtubelikes*')) {
        _____.customSetting.timeout = 1000 * 40;
        _____.customSetting.hide = false;
        _____.allowPopup = true;
        _____.customSetting.allowURLs = '*youlikehits.com*|http://linkto.social*';

        _____.onEvent('window-loaded', () => {
            alert('New Youtube Video Like Now ......', 1000 * 30);
        });

        _____.onEvent('window-closed', () => {
            confirmLike();
        });

        function confirmLike() {
            if ((a = document.querySelector('#DoesLike button'))) {
                if (a.innerText.like('*confirm*')) {
                    a.click();
                    setTimeout(() => {
                        clickLikeButton();
                    }, 1000 * 20);
                    return;
                }
            }
            confirmLike();
        }

        function clickLikeButton() {
            if ((a = document.querySelector('a.followbutton'))) {
                if (a.innerText.like('*like*')) {
                    a.click();
                }
            }
            if ((a = document.querySelector('a.likebutton'))) {
                if (a.innerText.like('*like*')) {
                    a.click();
                    return;
                }
            }
            setTimeout(() => {
                clickLikeButton();
            }, 1000 * 5);
        }
        clickLikeButton();
    }
    if (document.location.href.like('*viewwebsite*')) {
        setInterval(() => {
            if (document.getElementsByName('frame1')[0]?.contentDocument.body.innerText.like('*We could*locate the website*')) {
                _____.window.close();
            }
        }, 1000 * 3);
    }
    if (document.location.href.like('*websites*')) {
        _____.customSetting.hide = true;

        _____.onEvent('window-loaded', () => {
            alert('New Website Visiting Now ......', 1000 * 20);
        });
        _____.onEvent('window-closed', () => {
            setTimeout(() => {
                clickVisitButton();
            }, 1000 * 3);
        });

        _____.customSetting.timeout = 1000 * 40;

        function clickVisitButton() {
            let card = null;
            document.querySelectorAll('.cards').forEach((_card) => {
                if (!card && _card.style.display !== 'none') {
                    card = _card;
                }
            });

            if (card) {
                if ((a = card.querySelector('a.followbutton'))) {
                    if (a.innerText.like('Visit')) {
                        a.click();
                    }
                }
            } else {
                document.location.reload();
            }
        }

        clickVisitButton();
    }

    if (document.location.href.like('*soundcloudplays*')) {
        _____.onEvent('window-loaded', () => {
            alert('New Sound Playing Now ......', 1000 * 20);
        });

        _____.customSetting.timeout = 1000 * 60 * 5;
        _____.customSetting.hide = true;

        function clickListenButton() {
            if (typeof cnum == 'number' && cnum == 0) {
                if (parseInt(document.querySelector('#listall').innerText.split(': ')[1]?.split('\n')[0] || '1') > 0) {
                    setTimeout(() => {
                        if ((a = document.querySelector('a.followbutton'))) {
                            if (a.innerText.like('Listen')) {
                                a.click();
                            }
                        }
                    }, 1000 * 3);
                } else {
                    if ((a = document.querySelector('#listall a:last-child'))) {
                        a.click();
                    }
                }
            }
            setTimeout(() => {
                clickListenButton();
            }, 1000 * 10);
        }
        clickListenButton();
    }

    window.addEventListener('load', () => {
        _____.__showBotImage();
    });

    updatepoints = function () {
        window.close();
    };
});
