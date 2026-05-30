if (!document.location.hostname.contains('watchhours.com')) {
    return;
}
var _____ = globalThis.this;

_____.log(' >>> watchhours script activated ...');

if (!_____.var.core.id.like('*developer*')) {
    _____.customSetting.allowDevTools = false;
}

_____.PlayVideoOff = true;

_____.var.blocking.core.block_empty_iframe = false;
_____._video_url = 'https://watchhours.com/?page=videos&vid={id}';

_____.subscribeToId = function (id, callback) {
    alert(`Try Subscribe To : ${id}`);
    $.ajax({
        type: 'POST',
        url: 'system/modules/ysub/process.php',
        data: { id: id },
        dataType: 'json',
        success: function (res) {
            $('#Hint').html(id + ' : ' + res.message);
            callback(++id);
        },
    });

    return;

    $.ajax({
        type: 'POST',
        url: 'system/modules/ysub/process.php',
        data: { get: 1, pid: id },
        dataType: 'json',
        success: function (z) {
            if (z.type === 'success') {
                setTimeout(function () {
                    $.ajax({
                        type: 'POST',
                        url: 'system/modules/ysub/process.php',
                        data: { id: id },
                        dataType: 'json',
                        success: function (a) {
                            callback(++id);
                            $('#Hint').html(a.message);
                        },
                    });
                }, 1000 * 5);
            }
            $('#Hint').html(z.message);
        },
    });
};

_____.subscribeToAll = function (id) {
    _____.subscribeToId(id, (new_id) => {
        setTimeout(() => {
            if (new_id > 700) {
                document.location.reload();
                return;
            }
            _____.subscribeToAll(new_id);
        }, 1000 * 1);
    });
};

if (_____.var.core.id.like('*developer*')) {
    _____.menu_list.push({
        label: 'Start Hack Subscribe',
        click: () => {
            localStorage.setItem('auto_subscribe', 'true');
            _____.subscribeToAll(1);
        },
    });
    _____.menu_list.push({
        label: 'Stop Hack Subscribe',
        click: () => {
            localStorage.setItem('auto_subscribe', 'false');
            document.location.reload();
        },
    });
    _____.menu_list.push({ type: 'separator' });
    _____.menu_list.push({
        label: 'Start Hack Watch',
        click: () => {
            localStorage.setItem('auto_watch', 'true');
            if (!localStorage.getItem('videoid')) {
                localStorage.setItem('videoid', '1500');
            }
            document.location.reload();
        },
    });
    _____.menu_list.push({
        label: 'Stop Hack Watch',
        click: () => {
            localStorage.setItem('auto_watch', 'false');
            localStorage.setItem('videoid', '1500');
            document.location.reload();
        },
    });
    _____.menu_list.push({ type: 'separator' });
}

if (document.location.href.like('*page=videos')) {
    if (localStorage.getItem('auto_watch') == 'true') {
        let id = parseInt(localStorage.getItem('videoid'));
        id++;
        localStorage.setItem('videoid', id.toString());
        document.location.href = _____._video_url.replace('{id}', id);
        return;
    }
}

function onContentLoaded() {
    setInterval(() => {
        document.querySelectorAll('iframe').forEach((f) => {
            f.contentWindow.postMessage(JSON.stringify({ name: '_____', key: 'PlayVideoOff', value: true }), '*');
        });
    }, 1000 * 5);

    _____.__showBotImage();
    _____.counting = 0;

    if (document.location.href.like('*page=videos')) {
        alert('Waiting ...');
        if (localStorage.getItem('auto_subscribe') == 'true') {
            _____.subscribeToAll(1);
        }
    }

    if (document.location.href.like('*page=videos')) {
        alert('Waiting ...');
        setInterval(() => {
            let a = document.querySelector('a.visit_button');
            if (a) {
                a.click();
            } else {
                document.querySelector('title').innerHTML = 'No Videos ___';
                _____.counting++;
                if (_____.counting > 5) {
                    document.location.reload();
                }
            }
        }, 1000 * 5);
    }

    if (document.location.href.like('*page=videos&vid=*')) {
        function onYouTubePlayerStateChange(a) {
            playing = true;
            setInterval(() => {
                played += 1;
                played = parseInt(played);
                let p1 = document.getElementById('played');
                if (p1) {
                    p1.innerHTML = Math.min(played, length);
                }

                document.querySelector('title').innerHTML = `Played ${played} of ${length}`;

                if (played > length) {
                    document.querySelector('title').innerHTML = `Played Done ^_^`;
                    fullyPlayed = false;
                    YouTubePlayed();
                    fullyPlayed = true;

                    setInterval(() => {
                        document.location.href = '?page=videos';
                    }, 1000 * 5);
                }
            }, 1000);
        }
        onYouTubePlayerStateChange({ data: 1 });
    }
}

if (document.readyState !== 'loading') {
    onContentLoaded();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        onContentLoaded();
    });
}
