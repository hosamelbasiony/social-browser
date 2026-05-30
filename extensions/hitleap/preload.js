if (!document.location.hostname.like('*hitleap.com*')) {
    return;
}

var _____ = globalThis.this;

_____.log(' >>> hitleap script activated ...');

// https://exchange.hitleap.com/chunks/both?starting
// https://exchange.hitleap.com/user-agents
// https://exchange.hitleap.com/chunks/both  // load sites to hits
// https://exchange.hitleap.com/chunks/next

_____.startURL = 'https://hitleap.com/traffic-exchange/start';

if (document.location.href.like('https://hitleap.com/traffic-exchange')) {
    alert('Waiting 10s ... For Redirect - Check IP Status ');
    setTimeout(() => {
        document.location.href = _____.startURL;
    }, 1000 * 10);
    return;
}

window.cefQuery = function (obj) {
    _____.hitleap_username = JSON.parse(obj.request).username;
    _____.log(_____.hitleap_username);
    _____.getSites();
    return 100;
};

_____.getSites = function () {
    alert(`Waiting ...`);

    let myHeaders = {
        'User-Agent': '',
        'Viewer-Username': _____.hitleap_username,
        'Viewer-Version': '5.1.5.0',
    };

    let requestOptions = {
        url: 'https://exchange.hitleap.com/chunks/both',
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    _____.fetchJson(requestOptions, (data) => {
        _____.log('getSites', data);
        if (data.code == 'try-again-soon') {
            setTimeout(() => {
                _____.getSites();
            }, 1000 * 10);
            return;
        } else if (data.code == 'both-chunks-attached') {
            let body = {
                current_chunk: data.current_chunk.identifier,
                identifier: data.current_chunk.identifier,
                next_chunk: data.next_chunk.identifier,
                next_chunk_identifier: data.next_chunk.identifier,
            };
            let time = 20;
            data.current_chunk.websites.forEach((s) => {
                time += s.timer + s.refresh_before;
            });
            let tt = setInterval(() => {
                alert(`Point Collect After ${time}s`);
                time--;
                if (time == 0) {
                    clearInterval(tt);
                }
            }, 1000);

            setTimeout(() => {
                _____.NextSites(body);
            }, 1000 * time);
        } else if (data.code == 'restart-session') {
            _____.getSites();
        }
    });
};

_____.NextSites = function (body) {
    alert(`Waiting ...`);
    let myHeaders = {
        'User-Agent': '',
        'Viewer-Username': _____.hitleap_username,
        'Viewer-Version': '5.1.5.0',
    };

    let requestOptions = {
        url: 'https://exchange.hitleap.com/chunks/next',
        method: 'POST',
        body: JSON.stringify(body),
        headers: myHeaders,
        redirect: 'follow',
    };

    _____.fetchJson(requestOptions, (data) => {
        _____.log('NextSites', data);
        if (data.code == 'try-again-soon') {
            setTimeout(() => {
                _____.NextSites(body);
            }, 1000 * 10);
        } else if (data.code == 'next-chunk-attached') {
            let body = {
                // current_chunk: data.current_chunk.identifier,
                // identifier: data.current_chunk.identifier,
                next_chunk: data.next_chunk.identifier,
                next_chunk_identifier: data.next_chunk.identifier,
            };

            let time = 20;
            data.next_chunk.websites.forEach((s) => {
                time += s.timer + s.refresh_before;
            });
            let tt = setInterval(() => {
                alert(`Point Collect After ${time}s`);
                time--;
                if (time == 0) {
                    clearInterval(tt);
                }
            }, 1000);

            setTimeout(() => {
                _____.NextSites(body);
            }, 1000 * time);
        } else if (data.code == 'restart-session') {
            _____.getSites();
        }
    });
};

window.addEventListener('load', () => {
    _____.__showBotImage();

    if (document.location.href.like(_____.startURL)) {
        document.querySelectorAll('.start-viewer-automatically').forEach((a) => {
            a.remove();
        });
        document.querySelectorAll('.start-session').forEach((a) => {
            a.click();
            a.remove();
        });
    }
});
