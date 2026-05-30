window.BotDetector = (function () {
    'use strict';

    function np(prop) {
        try {
            return navigator[prop];
        } catch (e) {
            return undefined;
        }
    }
    function s(v) {
        return v !== undefined && v !== null && v !== '' ? String(v) : '';
    }

    function detectKernel() {
        var ua = navigator.userAgent || '';
        var res = { engine: 'Unknown', engineVersion: '', browser: 'Unknown', confidence: 'Low', mismatch: false, chromium: false };
        var featureEngine = null;
        try {
            if (window.chrome && typeof CSS !== 'undefined' && CSS.supports && CSS.supports('(-webkit-appearance: none)')) featureEngine = 'Blink';
            else if (typeof InstallTrigger !== 'undefined') featureEngine = 'Gecko';
            else if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('(-moz-appearance: none)')) featureEngine = 'Gecko';
            else if ('webkitConvertPointFromNodeToPage' in window) featureEngine = 'WebKit';
            else if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('(-webkit-touch-callout: none)')) featureEngine = 'WebKit';
            else if (window.opera && typeof window.opera.version === 'function') featureEngine = 'Presto';
        } catch (e) {}

        var uaEngine = null;
        if (/Trident|MSIE/.test(ua)) uaEngine = 'Trident';
        else if (/Edg\//.test(ua)) uaEngine = 'Blink';
        else if (/OPR\/|Opera/.test(ua) && /Chrome\//.test(ua)) uaEngine = 'Blink';
        else if (/Firefox\//.test(ua)) uaEngine = 'Gecko';
        else if (/Chrome\/|Chromium\//.test(ua)) uaEngine = 'Blink';
        else if ((/Safari\//.test(ua) || /(iPhone|iPad|iPod).*AppleWebKit/.test(ua)) && !/Chrome/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)) uaEngine = 'WebKit';
        else if (/Presto/.test(ua)) uaEngine = 'Presto';

        function getVer() {
            var m;
            if ((m = ua.match(/Chrome\/(\d+[\d.]*)/))) return m[1];
            if ((m = ua.match(/Firefox\/(\d+[\d.]*)/))) return m[1];
            if ((m = ua.match(/AppleWebKit\/(\d+[\d.]*)/))) return m[1];
            if ((m = ua.match(/Trident\/(\d+[\d.]*)/))) return m[1];
            return '';
        }

        if (featureEngine && uaEngine) {
            res.engine = featureEngine;
            res.engineVersion = getVer();
            res.confidence = featureEngine === uaEngine ? 'High' : 'Mismatch';
            res.mismatch = featureEngine !== uaEngine;
        } else if (featureEngine) {
            res.engine = featureEngine;
            res.engineVersion = getVer();
            res.confidence = 'Medium';
        } else if (uaEngine) {
            res.engine = uaEngine;
            res.engineVersion = getVer();
            res.confidence = 'Low';
        }

        res.chromium = res.engine === 'Blink';

        if (/Edg\//.test(ua)) res.browser = 'Microsoft Edge';
        else if (/OPR\//.test(ua)) res.browser = 'Opera';
        else if (/Brave/.test(ua) || (navigator.brave && typeof navigator.brave.isBrave === 'function')) res.browser = 'Brave';
        else if (/Vivaldi/.test(ua)) res.browser = 'Vivaldi';
        else if (/YaBrowser/.test(ua)) res.browser = 'Yandex Browser';
        else if (/SamsungBrowser/.test(ua)) res.browser = 'Samsung Internet';
        else if (/UCBrowser/.test(ua)) res.browser = 'UC Browser';
        else if (/Firefox\//.test(ua)) res.browser = 'Firefox';
        else if (/Chrome\//.test(ua) && res.engine === 'Blink') res.browser = 'Chrome';
        else if (/Safari\//.test(ua) && res.engine === 'WebKit') res.browser = 'Safari';
        else if (/(iPhone|iPad|iPod).*AppleWebKit/.test(ua) && res.engine === 'WebKit') {
            if (/\[LinkedInApp\]/.test(ua)) res.browser = 'Safari (LinkedIn in-app)';
            else if (/FBAN|FBAV|FB_IAB/.test(ua)) res.browser = 'Safari (Facebook in-app)';
            else if (/Instagram/.test(ua)) res.browser = 'Safari (Instagram in-app)';
            else if (/GSA\//.test(ua)) res.browser = 'Safari (Google App in-app)';
            else if (/Twitter|TwitterAndroid/i.test(ua)) res.browser = 'Safari (Twitter in-app)';
            else if (/Snapchat/i.test(ua)) res.browser = 'Safari (Snapchat in-app)';
            else if (/TikTok|musical_ly/i.test(ua)) res.browser = 'Safari (TikTok in-app)';
            else if (/Pinterest/i.test(ua)) res.browser = 'Safari (Pinterest in-app)';
            else res.browser = 'Safari (WebView/in-app)';
        }

        return res;
    }

    function getRemoteIP() {
        return fetch('https://api.ipify.org?format=json')
            .then(function (r) {
                return r.json();
            })
            .then(function (d) {
                return d.ip || '';
            })
            .catch(function () {
                return fetch('https://icanhazip.com')
                    .then(function (r) {
                        return r.text();
                    })
                    .then(function (t) {
                        return t.trim() || '';
                    })
                    .catch(function () {
                        return '';
                    });
            });
    }

    function getWebRTCIPs() {
        return new Promise(function (resolve) {
            var publicIPs = [];
            if (!window.RTCPeerConnection) {
                resolve(publicIPs);
                return;
            }
            try {
                var pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
                pc.createDataChannel('');
                pc.createOffer()
                    .then(function (offer) {
                        return pc.setLocalDescription(offer);
                    })
                    .then(function () {
                        var timeout = setTimeout(function () {
                            pc.close();
                            resolve(publicIPs);
                        }, 4000);
                        var seen = {};
                        pc.onicecandidate = function (e) {
                            if (!e.candidate) {
                                clearTimeout(timeout);
                                pc.close();
                                resolve(publicIPs);
                                return;
                            }
                            var parts = e.candidate.candidate.split(' ');
                            var ip = parts[4];
                            if (!ip || seen[ip]) return;
                            seen[ip] = true;
                            if (
                                ip.indexOf('.local') !== -1 ||
                                ip.indexOf(':') !== -1 ||
                                ip.indexOf('0.') === 0 ||
                                ip.indexOf('10.') === 0 ||
                                ip.indexOf('192.168.') === 0 ||
                                ip.indexOf('169.254.') === 0 ||
                                /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
                            )
                                return;
                            publicIPs.push(ip);
                        };
                    })
                    .catch(function () {
                        resolve(publicIPs);
                    });
            } catch (e) {
                resolve(publicIPs);
            }
        });
    }

    function getWebGL(ver) {
        try {
            var c = document.createElement('canvas');
            var ctx = c.getContext(ver === 2 ? 'webgl2' : 'webgl');
            if (!ctx) return null;
            var dbg = ctx.getExtension('WEBGL_debug_renderer_info');
            var attrs = ctx.getContextAttributes();
            var debugRendererVal = dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '' : '';

            var angle = false;
            var angleType = '';
            if (debugRendererVal && /ANGLE/i.test(debugRendererVal)) {
                angle = true;
                if (/Direct3D\s*11|D3D11/i.test(debugRendererVal)) angleType = 'D3D11';
                else if (/Direct3D\s*9|D3D9/i.test(debugRendererVal)) angleType = 'D3D9';
                else if (/Metal/i.test(debugRendererVal)) angleType = 'Metal';
                else if (/OpenGL/i.test(debugRendererVal)) angleType = 'OpenGL';
                else if (/Vulkan/i.test(debugRendererVal)) angleType = 'Vulkan';
                else if (/SwiftShader/i.test(debugRendererVal)) angleType = 'SwiftShader';
                else angleType = 'Unknown';
            }

            return {
                vendor: ctx.getParameter(ctx.VENDOR) || '',
                renderer: ctx.getParameter(ctx.RENDERER) || '',
                debugVendor: dbg ? ctx.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '' : '',
                debugRenderer: debugRendererVal,
                shadingLanguageVersion: ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION) || '',
                antialiasing: attrs ? !!attrs.antialias : false,
                angle: angle,
                angleType: angleType,
                supportedExtensions: ctx.getSupportedExtensions() || [],
            };
        } catch (e) {
            return null;
        }
    }

    function testCanvas() {
        try {
            var c = document.createElement('canvas');
            c.width = 200;
            c.height = 50;
            var ctx = c.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(50, 0, 100, 50);
            ctx.fillStyle = '#069';
            ctx.fillText('Bot detect test', 2, 15);
            return c.toDataURL() !== 'data:,';
        } catch (e) {
            return false;
        }
    }

    // Based on Joseph Myer's md5() algo
    // http://www.myersdaily.org/joseph/javascript/md5-text.html
    function md5(string) {
        function md5cycle(x, k) {
            var a = x[0],
                b = x[1],
                c = x[2],
                d = x[3];
            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);
            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);
            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);
            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);
            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }
        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }
        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | (~b & d), a, b, x, s, t);
        }
        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & ~d), a, b, x, s, t);
        }
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        function add32(a, b) {
            return (a + b) & 0xffffffff;
        }
        function md5blk(s) {
            var md5blks = [],
                i;
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }
        var hex_chr = '0123456789abcdef'.split('');
        function rhex(n) {
            var s = '',
                j = 0;
            for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
            return s;
        }
        function hex(x) {
            for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
            return x.join('');
        }
        function md5str(s) {
            var n = s.length,
                state = [1732584193, -271733879, -1732584194, 271733878],
                i;
            for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
            s = s.substring(i - 64);
            var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }
        return hex(md5str(string));
    }

    function detectFonts() {
        var fontList = [
            'Arial',
            'Arial Black',
            'Arial Narrow',
            'Book Antiqua',
            'Bookman Old Style',
            'Calibri',
            'Cambria',
            'Cambria Math',
            'Century',
            'Century Gothic',
            'Comic Sans MS',
            'Consolas',
            'Courier',
            'Courier New',
            'Garamond',
            'Geneva',
            'Georgia',
            'Helvetica',
            'Helvetica Neue',
            'Impact',
            'Lucida Bright',
            'Lucida Console',
            'Lucida Grande',
            'Lucida Sans',
            'Lucida Sans Unicode',
            'Microsoft Sans Serif',
            'Monaco',
            'Monotype Corsiva',
            'MS Gothic',
            'MS PGothic',
            'MS Reference Sans Serif',
            'MS Serif',
            'MYRIAD',
            'Palatino',
            'Palatino Linotype',
            'Segoe Print',
            'Segoe Script',
            'Segoe UI',
            'Segoe UI Symbol',
            'Tahoma',
            'Times',
            'Times New Roman',
            'Trebuchet MS',
            'Verdana',
            'Wingdings',
            'Wingdings 2',
            'Wingdings 3',
            'Roboto',
            'Open Sans',
            'Lato',
            'Montserrat',
            'Source Sans Pro',
            'Noto Sans',
            'Ubuntu',
            'Droid Sans',
            'Droid Serif',
            'PT Sans',
            'Franklin Gothic Medium',
            'Futura',
            'Gill Sans',
            'Optima',
            'Rockwell',
            'Copperplate',
            'Didot',
            'American Typewriter',
            'Baskerville',
            'Brush Script MT',
            'Candara',
            'Constantia',
            'Corbel',
            'Ebrima',
            'Gabriola',
            'Leelawadee UI',
            'Malgun Gothic',
            'Meiryo',
            'MS UI Gothic',
            'MV Boli',
            'Nirmala UI',
            'SimSun',
            'Yu Gothic',
            'Microsoft YaHei',
            'Microsoft JhengHei',
            'PMingLiU',
            'MingLiU',
            'DFKai-SB',
            'Apple Braille',
            'Apple Chancery',
            'Apple SD Gothic Neo',
            'Avenir',
            'Avenir Next',
            'Menlo',
            'San Francisco',
            'Andale Mono',
            'Bitstream Vera Sans',
            'DejaVu Sans',
            'FreeSans',
        ];

        try {
            var testString = 'mmmmmmmmmmlliWWWW';
            var testSize = '72px';
            var baseFonts = ['monospace', 'sans-serif', 'serif'];
            var body = document.body;
            var container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.visibility = 'hidden';

            var baseSpans = {};
            var defaultSize = {};
            for (var bi = 0; bi < baseFonts.length; bi++) {
                var span = document.createElement('span');
                span.style.fontFamily = baseFonts[bi];
                span.style.fontSize = testSize;
                span.textContent = testString;
                container.appendChild(span);
                baseSpans[baseFonts[bi]] = span;
            }
            body.appendChild(container);

            for (var bi = 0; bi < baseFonts.length; bi++) {
                defaultSize[baseFonts[bi]] = {
                    w: baseSpans[baseFonts[bi]].offsetWidth,
                    h: baseSpans[baseFonts[bi]].offsetHeight,
                };
            }

            var testSpans = [];
            for (var fi = 0; fi < fontList.length; fi++) {
                for (var bi = 0; bi < baseFonts.length; bi++) {
                    var span = document.createElement('span');
                    span.style.fontFamily = fontList[fi] + ',' + baseFonts[bi];
                    span.style.fontSize = testSize;
                    span.textContent = testString;
                    container.appendChild(span);
                    testSpans.push({ font: fontList[fi], base: baseFonts[bi], el: span });
                }
            }

            var detected = {};
            for (var ti = 0; ti < testSpans.length; ti++) {
                var t = testSpans[ti];
                var w = t.el.offsetWidth;
                var h = t.el.offsetHeight;
                if (w !== defaultSize[t.base].w || h !== defaultSize[t.base].h) {
                    detected[t.font] = true;
                }
            }

            body.removeChild(container);

            var found = [];
            for (var key in detected) {
                if (detected.hasOwnProperty(key)) found.push(key);
            }
            found.sort();
            return found;
        } catch (e) {
            return [];
        }
    }

    function getAudioFingerprint() {
        var AudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!AudioCtx) return Promise.resolve(null);

        try {
            var context = new AudioCtx(1, 44100, 44100);
            var oscillator = context.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.value = 10000;

            var compressor = context.createDynamicsCompressor();
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;

            oscillator.connect(compressor);
            compressor.connect(context.destination);
            oscillator.start(0);

            return context
                .startRendering()
                .then(function (buffer) {
                    var sum = 0;
                    var channelData = buffer.getChannelData(0);
                    for (var i = 4500; i < 5000; i++) {
                        sum += Math.abs(channelData[i]);
                    }
                    return sum.toString();
                })
                .catch(function () {
                    return null;
                });
        } catch (e) {
            return Promise.resolve(null);
        }
    }

    function getCanvasFingerprint() {
        var result = { supported: false, canvas2DApi: false, textApi: false, toDataUrl: false, signature: '' };
        try {
            var c = document.createElement('canvas');
            c.width = 300;
            c.height = 70;
            result.supported = true;

            var ctx = c.getContext('2d');
            if (!ctx) return result;
            result.canvas2DApi = true;

            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(100, 1, 80, 24);

            ctx.fillStyle = '#069';
            ctx.font = '11pt no-real-font-123, sans-serif';
            ctx.fillText('Cwm fjordbank glyphs vext quiz, \u03a9\u6f22\u5b57 \ud83d\ude03', 2, 15);
            result.textApi = true;

            ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
            ctx.font = '18pt Arial';
            ctx.fillText('Cwm fjordbank glyphs vext quiz, \u03a9\u6f22\u5b57 \ud83d\ude03', 4, 42);

            ctx.fillStyle = 'rgba(50, 50, 200, 0.3)';
            ctx.font = '10pt monospace';
            ctx.fillText('aAbBcCdDeEfF 0123456789 \u03a9\u6f22\u5b57 \ud83d\ude03', 2, 60);

            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgb(255,0,255)';
            ctx.beginPath();
            ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgb(0,255,255)';
            ctx.beginPath();
            ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();

            var dataUrl = c.toDataURL();
            if (dataUrl && dataUrl !== 'data:,') {
                result.toDataUrl = true;
                result.signature = md5(dataUrl);
            }
        } catch (e) {}
        return result;
    }

    function generateBrowserId(sections, kernel) {
        var parts = [];

        parts.push(sections.screen.resolutionWidth + 'x' + sections.screen.resolutionHeight);
        parts.push(String(sections.screen.colorDepth));
        parts.push(String(sections.screen.pixelRatio));

        parts.push(sections.timeLocale.timezone);
        parts.push(sections.timeLocale.locale);

        var nav = sections.navigator;
        parts.push(nav.userAgent);
        parts.push(nav.platform);
        parts.push(nav.language);
        parts.push(nav.vendor);
        parts.push(String(nav.hardwareConcurrency || ''));
        parts.push(String(nav.deviceMemory || ''));
        parts.push(String(nav.maxTouchPoints || ''));

        parts.push(kernel.engine);
        parts.push(kernel.engineVersion);
        parts.push(kernel.browser);

        if (sections.webgl) {
            parts.push(sections.webgl.debugVendor);
            parts.push(sections.webgl.debugRenderer);
        }

        if (sections.clientHints) {
            parts.push(sections.clientHints.architecture);
            parts.push(sections.clientHints.bitness);
            parts.push(sections.clientHints.platform);
        }

        if (sections.extraSignals) {
            parts.push(String(sections.extraSignals.webAudioAPI));
            parts.push(String(sections.extraSignals.canvasRendering));
        }

        if (sections.fonts && sections.fonts.signature) {
            parts.push(sections.fonts.signature);
        }
        if (sections.audio && sections.audio.signature) {
            parts.push(sections.audio.signature);
        }
        if (sections.canvas && sections.canvas.signature) {
            parts.push(sections.canvas.signature);
        }
        if (sections.extraSignals && sections.extraSignals.speechVoices && sections.extraSignals.speechVoices.length) {
            parts.push(md5(sections.extraSignals.speechVoices.join(',')));
        }

        var str = parts.join('|');

        var h1 = 0x811c9dc5,
            h2 = 0x01000193;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            h1 = h1 ^ c;
            h1 = (h1 * 0x01000193) >>> 0;
            h2 = h2 ^ (c + i);
            h2 = (h2 * 0x01000193) >>> 0;
        }

        var h3 = (h1 ^ (h2 >> 16)) >>> 0;
        var h4 = (h2 ^ (h1 >> 8)) >>> 0;

        function pad(n, len) {
            var s = n.toString(16);
            while (s.length < len) s = '0' + s;
            return s;
        }
        return (
            pad(h1, 8) +
            '-' +
            pad(h2 & 0xffff, 4) +
            '-4' +
            pad((h3 >>> 4) & 0xfff, 3) +
            '-' +
            pad(0x8000 | (h4 & 0x3fff), 4) +
            '-' +
            pad(h3 & 0xffff, 4) +
            pad(h4 & 0xffff, 4) +
            pad((h1 ^ h2) & 0xffff, 4)
        );
    }

    function scan() {
        var riskReasons = [];
        var riskScore = 0;

        function addRisk(id, name, points, severity) {
            riskScore += points;
            riskReasons.push({ id: id, name: name, points: points, severity: severity });
        }

        var kernel = detectKernel();
        var now = new Date();
        var ua = (navigator.userAgent || '').toLowerCase();
        var vendorLc = (navigator.vendor || '').toLowerCase();
        var uaData = navigator.userAgentData || null;
        var gl1 = getWebGL(1);
        var gl2 = getWebGL(2);
        var canvasOk = testCanvas();
        var hasAudio = !!(window.AudioContext || window.webkitAudioContext);
        var hasSpeech = 'speechSynthesis' in window;
        var hasRTC = !!window.RTCPeerConnection;
        var hasDataChannel = !!(window.RTCPeerConnection && RTCPeerConnection.prototype.createDataChannel);

        var sections = {};

        sections.screen = {
            resolutionWidth: screen.width,
            resolutionHeight: screen.height,
            availableWidth: screen.availWidth,
            availableHeight: screen.availHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio || 1,
        };
        if (screen.width === 0 || screen.height === 0) {
            addRisk('ZERO_SCREEN', 'Zero screen dimensions', 15, 'high');
        }
        if (sections.screen.outerWidth === 0 && sections.screen.outerHeight === 0) {
            addRisk('ZERO_OUTER_WINDOW', 'Zero outer window size', 10, 'high');
        }
        if (screen.width === 800 && screen.height === 600 && screen.availWidth === 800 && screen.availHeight === 600) {
            addRisk('UNUSUAL_SCREEN_RESOLUTION', 'Unusual 800x600 resolution', 15, 'high');
        }

        var suspiciousUA = ['curl', 'wget', 'playwright', 'puppeteer', 'headless', 'selenium', 'scan', 'research', 'lynx', 'crawl', 'python'];
        var foundSuspiciousUA = false;
        for (var sui = 0; sui < suspiciousUA.length; sui++) {
            if (ua.indexOf(suspiciousUA[sui]) !== -1) {
                foundSuspiciousUA = true;
                break;
            }
        }
        if (foundSuspiciousUA) {
            addRisk('SUSPICIOUS_UA', 'Suspicious user agent string', 50, 'high');
        }

        if (/MSIE\s|Trident\//.test(navigator.userAgent || '')) {
            addRisk('INTERNET_EXPLORER_IS_DISCONTINUED', 'Internet Explorer is discontinued', 15, 'high');
        }

        var rawUA = navigator.userAgent || '';
        var chromeVerMatch = rawUA.match(/Chrome\/(\d+)/);
        var firefoxVerMatch = rawUA.match(/Firefox\/(\d+)/);
        if (chromeVerMatch && parseInt(chromeVerMatch[1], 10) < 120) {
            addRisk('OLD_BROWSER_VERSION', 'Outdated Chrome browser version', 5, 'medium');
        }
        if (firefoxVerMatch && parseInt(firefoxVerMatch[1], 10) < 120) {
            addRisk('OLD_BROWSER_VERSION', 'Outdated Firefox browser version', 5, 'medium');
        }

        var tz = '';
        try {
            tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        } catch (e) {}
        var locale = '';
        try {
            locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || '';
        } catch (e) {
            locale = navigator.language || '';
        }

        sections.timeLocale = {
            systemTime: now.toLocaleString(),
            timezone: tz,
            timezoneOffset: 'UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') + Math.abs(now.getTimezoneOffset() / 60),
            locale: locale,
        };

        var rh = window.__requestHeaders || {};
        sections.headers = {
            userAgent: rh.userAgent || '',
            acceptLanguage: rh.acceptLanguage || '',
            secChUa: rh.secChUa || '',
            secChUaPlatform: rh.secChUaPlatform || '',
            secChUaMobile: rh.secChUaMobile || '',
            secChUaFullVersionList: rh.secChUaFullVersionList || '',
            secChUaArch: rh.secChUaArch || '',
            secChUaBitness: rh.secChUaBitness || '',
        };

        sections.clientHints = {
            brands: '',
            mobile: '',
            platform: '',
            fullVersionList: '',
            architecture: '',
            bitness: '',
            platformVersion: '',
            model: '',
            wow64: '',
        };

        var headerPromise;
        if (uaData) {
            var brands = uaData.brands || [];
            var brandDisplay = '';
            for (var bd = 0; bd < brands.length; bd++) {
                if (bd > 0) brandDisplay += ', ';
                brandDisplay += brands[bd].brand + ' ' + brands[bd].version;
            }
            sections.clientHints.brands = brandDisplay;
            sections.clientHints.mobile = uaData.mobile ? 'True' : 'False';
            sections.clientHints.platform = uaData.platform || '';

            headerPromise = uaData.getHighEntropyValues
                ? uaData
                      .getHighEntropyValues(['fullVersionList', 'architecture', 'bitness', 'platformVersion', 'model', 'wow64'])
                      .then(function (he) {
                          var fvlD = '';
                          var fvl = he.fullVersionList || [];
                          for (var fi = 0; fi < fvl.length; fi++) {
                              if (fi > 0) fvlD += ', ';
                              fvlD += fvl[fi].brand + ' ' + fvl[fi].version;
                          }
                          sections.clientHints.fullVersionList = fvlD;
                          sections.clientHints.architecture = he.architecture || '';
                          sections.clientHints.bitness = he.bitness || '';
                          sections.clientHints.platformVersion = he.platformVersion || '';
                          sections.clientHints.model = he.model || '';
                          sections.clientHints.wow64 = he.wow64 !== undefined ? (he.wow64 ? 'True' : 'False') : '';
                      })
                      .catch(function () {})
                : Promise.resolve();
        } else {
            headerPromise = Promise.resolve();
        }

        return headerPromise.then(function () {
            var pluginList = [];
            try {
                if (navigator.plugins) {
                    for (var pi = 0; pi < navigator.plugins.length; pi++) {
                        var plug = navigator.plugins[pi];
                        if (!plug.name) continue;
                        var mimes = [];
                        for (var mi = 0; mi < plug.length; mi++) {
                            if (plug[mi] && plug[mi].type) {
                                mimes.push({
                                    type: plug[mi].type,
                                    description: plug[mi].description || '',
                                    suffixes: plug[mi].suffixes || '',
                                });
                            }
                        }
                        pluginList.push({
                            name: plug.name,
                            description: plug.description || '',
                            filename: plug.filename || '',
                            mimeTypes: mimes,
                        });
                    }
                }
            } catch (e) {}

            sections.navigator = {
                userAgent: s(navigator.userAgent),
                appVersion: s(np('appVersion')),
                appName: s(np('appName')),
                appCodeName: s(np('appCodeName')),
                product: s(np('product')),
                productSub: s(np('productSub')),
                vendor: s(np('vendor')),
                vendorSub: s(np('vendorSub')),
                buildID: s(np('buildID')),
                platform: s(np('platform')),
                oscpu: s(np('oscpu')),
                language: s(np('language')),
                languages: (navigator.languages || []).slice(),
                hardwareConcurrency: navigator.hardwareConcurrency !== undefined ? navigator.hardwareConcurrency : null,
                maxTouchPoints: navigator.maxTouchPoints !== undefined ? navigator.maxTouchPoints : null,
                deviceMemory: navigator.deviceMemory !== undefined ? navigator.deviceMemory : null,
                mobile: navigator.maxTouchPoints > 1 && window.matchMedia('(max-width: 768px)').matches,
                doNotTrack: navigator.doNotTrack === '1' ? 'Enabled' : navigator.doNotTrack === '0' ? 'Disabled' : 'Unspecified',
                cookieEnabled: navigator.cookieEnabled,
                pdfViewerEnabled: navigator.pdfViewerEnabled !== undefined ? navigator.pdfViewerEnabled : null,
                online: navigator.onLine,
                webdriver: !!navigator.webdriver,
                plugins: pluginList,
                pluginsCount: pluginList.length,
            };

            var isWindows10Plus = /windows nt (10|1[1-9]|[2-9]\d)/i.test(navigator.userAgent || '');
            var devMem = navigator.deviceMemory !== undefined ? navigator.deviceMemory : null;
            var hwConc = navigator.hardwareConcurrency !== undefined ? navigator.hardwareConcurrency : null;
            var debugRend = gl1 && gl1.debugRenderer ? gl1.debugRenderer : '';

            var virtualMachine = false;
            if (isWindows10Plus && devMem !== null && devMem <= 3) virtualMachine = true;
            if (isWindows10Plus && hwConc !== null && hwConc > 0 && hwConc <= 2) virtualMachine = true;
            if (/VirtualBox|VMware|Parallels|QEMU|Hyper-V/i.test(debugRend)) virtualMachine = true;
            var isMobileForVM = navigator.maxTouchPoints > 1 && window.matchMedia('(max-width: 768px)').matches;
            if (!isMobileForVM && sections.screen.resolutionWidth > 0) {
                var commonWidths = [800, 1024, 1152, 1280, 1360, 1366, 1440, 1536, 1600, 1680, 1920, 2048, 2160, 2256, 2304, 2560, 2880, 3000, 3440, 3840, 4096, 5120, 7680];
                var resW = sections.screen.resolutionWidth;
                var isCommonWidth = false;
                for (var cwi = 0; cwi < commonWidths.length; cwi++) {
                    if (resW === commonWidths[cwi]) {
                        isCommonWidth = true;
                        break;
                    }
                }
                if (!isCommonWidth) virtualMachine = true;
            }

            sections.navigator.virtualMachine = virtualMachine;

            var isMobileUA = /android|iphone|ipad|ipod|mobile|phone/i.test(navigator.userAgent || '');
            var touchPoints = navigator.maxTouchPoints !== undefined ? navigator.maxTouchPoints : 0;
            if (isMobileUA && touchPoints === 0) {
                addRisk('MOBILE_WITHOUT_TOUCH', 'Mobile device with no touch enabled', 10, 'high');
            }

            var isGecko = ua.indexOf('firefox') !== -1;
            if (isGecko && !s(np('oscpu'))) {
                addRisk('OSCPU_MISSING_FIREFOX', 'Oscpu missing on Firefox', 5, 'medium');
            }
            if (!navigator.cookieEnabled) {
                addRisk('COOKIES_DISABLED', 'Cookies disabled', 5, 'medium');
            }
            if ((navigator.languages || []).length === 0) {
                addRisk('EMPTY_LANGUAGES', 'Empty languages array', 10, 'high');
            }
            if (navigator.hardwareConcurrency === undefined) {
                addRisk('HW_CONCURRENCY_UNDEF', 'Hardware concurrency undefined', 3, 'medium');
            }
            if (navigator.webdriver) {
                addRisk('WEBDRIVER_TRUE', 'navigator.webdriver is true', 25, 'high');
            }
            if (hwConc !== null && hwConc > 32 && devMem !== null && devMem <= 8) {
                addRisk('HIGH_CPU_THREADS_COUNT', 'High CPU threads count (likely server)', 25, 'high');
            }
            if (devMem !== null && devMem > 32) {
                addRisk('HIGH_RAM_MEMORY', 'High RAM memory (likely server)', 25, 'high');
            }

            sections.browserKernel = {
                engine: kernel.engine,
                engineVersion: kernel.engineVersion,
                chromium: kernel.chromium,
                detectedBrowser: kernel.browser,
                confidence: kernel.confidence,
                engineMismatch: kernel.mismatch,
            };
            if (kernel.mismatch) {
                addRisk('KERNEL_MISMATCH', 'Kernel engine mismatch', 15, 'high');
            }

            var tampered = false;
            var tamperedReasons = [];
            var claimsChrome = ua.indexOf('chrome') !== -1 && ua.indexOf('edg') === -1 && ua.indexOf('opr') === -1;

            var navPlatformLc = (navigator.platform || '').toLowerCase();
            var glDbgVendorLc = (gl1 && gl1.debugVendor ? String(gl1.debugVendor) : '').toLowerCase();
            var glDbgRendererLc = (gl1 && gl1.debugRenderer ? String(gl1.debugRenderer) : '').toLowerCase();
            var isArmPlatform = /arm|aarch/.test(navPlatformLc);
            var isMobileGpu = /\b(arm|qualcomm|imagination|powervr|apple|samsung|adreno|mali)\b/.test(glDbgVendorLc) || /\b(mali|adreno|powervr|apple gpu)\b/.test(glDbgRendererLc);
            var hasTouch = (navigator.maxTouchPoints || 0) > 0;
            var uadMobile = false;
            try {
                uadMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
            } catch (e) {}
            var isMobileChromium = claimsChrome && (uadMobile || (isArmPlatform && hasTouch) || (isMobileGpu && hasTouch));

            if (claimsChrome) {
                if (vendorLc.indexOf('google') === -1) {
                    tampered = true;
                    tamperedReasons.push('Chrome UA but vendor not Google');
                }
                if (!window.chrome) {
                    tampered = true;
                    tamperedReasons.push('Chrome UA but window.chrome absent');
                }
                if (!window.webkitRequestAnimationFrame) {
                    tampered = true;
                    tamperedReasons.push('Chrome UA but webkitRequestAnimationFrame absent');
                }
                try {
                    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && !CSS.supports('-webkit-appearance', 'none')) {
                        tampered = true;
                        tamperedReasons.push('Chrome UA but no -webkit-appearance');
                    }
                } catch (e) {}
                if (gl1) {
                    if (gl1.vendor !== 'WebKit') {
                        tampered = true;
                        tamperedReasons.push('Chrome UA but wrong WebGL vendor');
                    }
                    if (!isMobileChromium && !/google/i.test(gl1.debugVendor || '')) {
                        tampered = true;
                        tamperedReasons.push('Chrome UA but wrong WebGL debug vendor');
                    }
                }
            }
            var claimsFirefox = ua.indexOf('firefox') !== -1;
            if (claimsFirefox) {
                if (vendorLc !== '') {
                    tampered = true;
                    tamperedReasons.push('Firefox UA but vendor non-empty');
                }
                if (typeof InstallTrigger === 'undefined') {
                    try {
                        if (typeof CSS !== 'undefined' && !CSS.supports('-moz-appearance', 'none')) {
                            tampered = true;
                            tamperedReasons.push('Firefox UA but no -moz-appearance');
                        }
                    } catch (e) {}
                }
                if (!('onmozfullscreenchange' in document) || !('onmozfullscreenerror' in document)) {
                    tampered = true;
                    tamperedReasons.push('Firefox UA but missing moz fullscreen events');
                }
                if (gl1 && gl1.vendor !== 'Mozilla') {
                    tampered = true;
                    tamperedReasons.push('Firefox UA but wrong WebGL vendor');
                }
            }
            var iosWebKit = /(iphone|ipad|ipod).*applewebkit/i.test(ua) && ua.indexOf('chrome') === -1 && ua.indexOf('crios') === -1 && ua.indexOf('fxios') === -1 && ua.indexOf('edgios') === -1;
            var claimsSafari = (ua.indexOf('safari') !== -1 || iosWebKit) && ua.indexOf('chrome') === -1 && ua.indexOf('chromium') === -1;
            if (claimsSafari) {
                if (vendorLc.indexOf('apple') === -1) {
                    tampered = true;
                    tamperedReasons.push('Safari UA but vendor not Apple');
                }
                if (vendorLc.indexOf('apple') === -1) {
                    tampered = true;
                    tamperedReasons.push('Safari UA but vendor not Apple');
                }
                if (/ipad|iphone|macintel/i.test(navigator.platform && gl1)) {
                    if (!/apple gpu/i.test(gl1.debugRenderer || '')) {
                        tampered = true;
                        tamperedReasons.push('Safari UA but wrong WebGL debug renderer');
                    }
                    if (gl1.debugVendor !== 'Apple Inc.') {
                        tampered = true;
                        tamperedReasons.push('Safari UA but wrong WebGL debug vendor');
                    }
                }
            }
            if (/headless/i.test(ua)) {
                tampered = true;
                tamperedReasons.push('UA contains headless');
                addRisk('HEADLESS_UA', 'Headless in user agent', 20, 'high');
            }
            if (navigator.webdriver) {
                tampered = true;
                tamperedReasons.push('navigator.webdriver true');
            }
            if (navigator.plugins && navigator.plugins.length === 0 && claimsChrome && !isMobileChromium) {
                tampered = true;
                tamperedReasons.push('Chrome UA but zero plugins');
                addRisk('ZERO_PLUGINS_CHROME', 'Zero plugins in Chrome', 5, 'medium');
            }
            var malformedPlugin = false;
            if (navigator.plugins && navigator.plugins.length > 0) {
                try {
                    for (var mpi = 0; mpi < navigator.plugins.length; mpi++) {
                        var mp = navigator.plugins[mpi];
                        if (typeof mp.name !== 'string' || mp.name === '' || typeof mp.description !== 'string' || typeof mp.filename !== 'string' || typeof mp.length !== 'number') {
                            malformedPlugin = true;
                            break;
                        }
                    }
                } catch (e) {
                    malformedPlugin = true;
                }
                if (malformedPlugin) {
                    tampered = true;
                    tamperedReasons.push('Malformed plugin entry detected');
                    addRisk('MALFORMED_PLUGINS', 'Malformed plugin entry', 10, 'high');
                }
            }
            if (navigator.plugins && navigator.plugins.length > 0 && navigator.plugins.length < 5 && !malformedPlugin) {
                addRisk('LOW_PLUGINS_COUNT', 'Uncommon low plugins count (' + navigator.plugins.length + ')', 3, 'medium');
            }
            if (kernel.mismatch) {
                tampered = true;
                tamperedReasons.push('Kernel engine mismatch');
            }

            try {
                if ('speechSynthesis' in window) {
                    var voices = window.speechSynthesis.getVoices();
                    if (voices && voices.length > 0) {
                        if (claimsChrome && !isMobileChromium) {
                            var hasGV = false;
                            for (var vi = 0; vi < voices.length; vi++) {
                                if (voices[vi].name && voices[vi].name.indexOf('Google') !== -1) {
                                    hasGV = true;
                                    break;
                                }
                            }
                            if (!hasGV) {
                                tampered = true;
                                tamperedReasons.push('Chrome UA but no Google speech voices');
                            }
                        }
                        if (claimsFirefox) {
                            var hasMV = false;
                            for (var vi = 0; vi < voices.length; vi++) {
                                if (voices[vi].voiceURI && voices[vi].voiceURI.indexOf('moz-tts:sapi:') !== -1) {
                                    hasMV = true;
                                    break;
                                }
                            }
                            if (!hasMV) {
                                tampered = true;
                                tamperedReasons.push('Firefox UA but no moz-tts speech voices');
                            }
                        }
                    }
                }
            } catch (e) {}

            var requiredWindowKeys = ['history', 'navigator', 'name', 'onblur', 'scrollbars'];
            var windowKeys = [];
            try {
                windowKeys = Object.keys(window);
            } catch (e) {}
            if (windowKeys.length > 0) {
                var missing = [];
                for (var wki = 0; wki < requiredWindowKeys.length; wki++) {
                    var found = false;
                    for (var wkj = 0; wkj < windowKeys.length; wkj++) {
                        if (windowKeys[wkj] === requiredWindowKeys[wki]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) missing.push(requiredWindowKeys[wki]);
                }
                if (missing.length > 0) {
                    tampered = true;
                    tamperedReasons.push('Missing window keys: ' + missing.join(', '));
                }
            }

            if (!navigator.webdriver && navigator.plugins && navigator.plugins.length === 0 && (navigator.languages || []).length === 0) {
                tampered = true;
                tamperedReasons.push('Zero plugins and zero languages');
            }
            if (navigator.language && (navigator.languages || []).length === 0) {
                tampered = true;
                tamperedReasons.push('Language set but languages array empty');
            }
            if (!claimsSafari && !('Notification' in window)) {
                tampered = true;
                tamperedReasons.push('Notification API missing');
            }

            try {
                var phantomKeys = ['__nightmare', '_phantom', '__phantomas', 'callPhantom', '_selenium', '__webdriver_evaluate', '__driver_evaluate'];
                for (var pk = 0; pk < phantomKeys.length; pk++) {
                    if (phantomKeys[pk] in window || phantomKeys[pk] in document) {
                        tampered = true;
                        tamperedReasons.push('Automation prop: ' + phantomKeys[pk]);
                        break;
                    }
                }
            } catch (e) {}

            try {
                if (navigator.permissions) {
                    return navigator.permissions
                        .query({ name: 'notifications' })
                        .then(function (notif) {
                            if (notif.state === 'denied' && Notification.permission === 'default') {
                                tampered = true;
                                tamperedReasons.push('Permissions API mismatch');
                            }
                            var valid = ['granted', 'denied', 'prompt'];
                            var ok = false;
                            for (var psi = 0; psi < valid.length; psi++) {
                                if (notif.state === valid[psi]) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (!ok) {
                                tampered = true;
                                tamperedReasons.push('Permissions query returned invalid state');
                            }
                        })
                        .catch(function () {})
                        .then(function () {
                            return finalize(tampered, tamperedReasons);
                        });
                }
            } catch (e) {}

            return finalize(tampered, tamperedReasons);
        });

        function finalize(tampered, tamperedReasons) {
            if (tampered) {
                addRisk('BROWSER_TAMPERED', 'Browser tamper detected', 25, 'high');
            }

            return Promise.all([getWebRTCIPs(), getRemoteIP()]).then(function (results) {
                var webrtcPublicIPs = results[0];
                var remoteIP = results[1];

                var possibleProxy = false;
                if (webrtcPublicIPs.length > 0 && remoteIP && webrtcPublicIPs.indexOf(remoteIP) === -1) possibleProxy = true;

                sections.webrtc = {
                    rtcPeerConnection: hasRTC,
                    rtcDataChannel: hasDataChannel,
                    publicIPs: webrtcPublicIPs,
                    publicIPCount: webrtcPublicIPs.length,
                    multiplePublicIPs: webrtcPublicIPs.length > 1,
                    remoteIPAddress: remoteIP,
                    possibleProxy: possibleProxy,
                };
                if (possibleProxy) {
                    addRisk('POSSIBLE_PROXY', 'Possible VPN or proxy detected', 5, 'medium');
                }
                if (!hasRTC) {
                    addRisk('NO_WEBRTC', 'WebRTC not available', 5, 'medium');
                }

                sections.webgl = {
                    webgl: !!gl1,
                    webgl2: !!gl2,
                    vendor: gl1 ? gl1.vendor : '',
                    renderer: gl1 ? gl1.renderer : '',
                    debugVendor: gl1 ? gl1.debugVendor : '',
                    debugRenderer: gl1 ? gl1.debugRenderer : '',
                    shadingLanguageVersion: gl1 ? gl1.shadingLanguageVersion : '',
                    antialiasing: gl1 ? gl1.antialiasing : false,
                    angle: gl1 ? gl1.angle : false,
                    angleType: gl1 ? gl1.angleType : '',
                    supportedExtensions: gl1 ? gl1.supportedExtensions : [],
                };
                if (!gl1) {
                    addRisk('WEBGL_DISABLED', 'WebGL disabled', 15, 'high');
                }
                if (gl1 && /swiftshader|llvmpipe|mesa/i.test(gl1.debugRenderer || '')) {
                    addRisk('SOFTWARE_GPU', 'Software GPU renderer', 20, 'high');
                }

                var battLevel = null,
                    battCharging = null;
                var battPromise;
                try {
                    if (navigator.getBattery) {
                        battPromise = navigator
                            .getBattery()
                            .then(function (batt) {
                                battLevel = Math.round(batt.level * 100);
                                battCharging = batt.charging;
                            })
                            .catch(function () {});
                    } else {
                        battPromise = Promise.resolve();
                    }
                } catch (e) {
                    battPromise = Promise.resolve();
                }

                return battPromise.then(function () {
                    var autoProps = [
                        '__webdriver_evaluate',
                        '__selenium_evaluate',
                        '__fxdriver_evaluate',
                        '__driver_unwrapped',
                        '__webdriver_unwrapped',
                        '__driver_evaluate',
                        '__selenium_unwrapped',
                        '_Selenium_IDE_Recorder',
                        'calledSelenium',
                        '_phantom',
                        '__nightmare',
                        'domAutomation',
                        'domAutomationController',
                    ];
                    var foundAuto = [];
                    for (var ai = 0; ai < autoProps.length; ai++) {
                        try {
                            if (autoProps[ai] in navigator || autoProps[ai] in window || autoProps[ai] in document) foundAuto.push(autoProps[ai]);
                        } catch (e) {}
                    }

                    var speechVoiceNames = [];
                    try {
                        if ('speechSynthesis' in window) {
                            var allV = window.speechSynthesis.getVoices();
                            if (allV) {
                                for (var svi = 0; svi < allV.length; svi++) {
                                    if (allV[svi].name) speechVoiceNames.push(allV[svi].name);
                                }
                            }
                        }
                    } catch (e) {}

                    var notifPerm = '';
                    try {
                        if ('Notification' in window) notifPerm = Notification.permission || '';
                    } catch (e) {}

                    var hasIndexedDB = false;
                    try {
                        hasIndexedDB = !!window.indexedDB;
                    } catch (e) {}
                    var hasOpenDatabase = false;
                    try {
                        hasOpenDatabase = typeof window.openDatabase === 'function';
                    } catch (e) {}
                    var hasLocalStorage = false;
                    try {
                        hasLocalStorage = !!window.localStorage;
                    } catch (e) {}
                    var hasSessionStorage = false;
                    try {
                        hasSessionStorage = !!window.sessionStorage;
                    } catch (e) {}

                    var devToolsOpen = false;
                    try {
                        var threshold = 160;
                        var isMobileDev = sections.navigator.mobile;
                        if (!isMobileDev && (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold)) {
                            devToolsOpen = true;
                        }
                    } catch (e) {}

                    sections.extraSignals = {
                        webAudioAPI: hasAudio,
                        speechSynthesisAPI: hasSpeech,
                        speechVoices: speechVoiceNames,
                        canvasRendering: canvasOk,
                        webBluetoothAPI: !!navigator.bluetooth,
                        mediaDevicesAPI: !!navigator.mediaDevices,
                        notificationAPI: 'Notification' in window,
                        notificationPermission: notifPerm,
                        mediaSourceAPI: typeof MediaSource !== 'undefined',
                        batteryStatusAPI: !!navigator.getBattery,
                        batteryLevel: battLevel,
                        batteryCharging: battCharging,
                        indexedDB: hasIndexedDB,
                        openDatabase: hasOpenDatabase,
                        localStorage: hasLocalStorage,
                        sessionStorage: hasSessionStorage,
                        developerTools: devToolsOpen,
                        automationProps: foundAuto,
                    };

                    if (!hasAudio) {
                        addRisk('NO_WEB_AUDIO', 'Web Audio API missing', 5, 'medium');
                    }
                    if (!hasSpeech) {
                        addRisk('NO_SPEECH_SYNTHESIS', 'SpeechSynthesis missing', 5, 'medium');
                    }
                    if (!canvasOk) {
                        addRisk('CANVAS_ANOMALY', 'Canvas rendering anomaly', 15, 'high');
                    }
                    if (foundAuto.length) {
                        addRisk('AUTOMATION_PROPS', 'Automation properties found', 20, 'high');
                    }

                    var detectedFonts = detectFonts();

                    var fontPrefs = {};
                    var emojiPrefs = {};
                    try {
                        var prefContainer = document.createElement('div');
                        prefContainer.style.position = 'absolute';
                        prefContainer.style.left = '-9999px';
                        prefContainer.style.visibility = 'hidden';
                        var prefFonts = {
                            default: 'default',
                            serif: 'serif',
                            sansSerif: 'sans-serif',
                            monospace: 'monospace',
                            cursive: 'cursive',
                            fantasy: 'fantasy',
                            system: 'system-ui',
                            apple: '-apple-system, BlinkMacSystemFont',
                        };
                        var emojiFonts = {
                            emoji: 'emoji',
                            appleEmoji: 'Apple Color Emoji',
                            notoEmoji: 'Noto Color Emoji',
                            segoeEmoji: 'Segoe UI Emoji',
                            twemojiMozilla: 'Twemoji Mozilla',
                            androidEmoji: 'Android Emoji',
                            webkitStandard: '-webkit-standard',
                        };
                        var prefSpans = {};
                        for (var pf in prefFonts) {
                            if (!prefFonts.hasOwnProperty(pf)) continue;
                            var ps = document.createElement('span');
                            ps.style.fontSize = '72px';
                            ps.style.fontFamily = prefFonts[pf];
                            ps.textContent = 'mmmmmmmmmmlliWWWW';
                            prefContainer.appendChild(ps);
                            prefSpans[pf] = ps;
                        }
                        var emojiSpans = {};
                        for (var ef in emojiFonts) {
                            if (!emojiFonts.hasOwnProperty(ef)) continue;
                            var es = document.createElement('span');
                            es.style.fontSize = '72px';
                            es.style.fontFamily = emojiFonts[ef];
                            es.textContent = '\ud83d\ude03\ud83c\udf0d\ud83d\udc4d\ud83c\udfe0';
                            prefContainer.appendChild(es);
                            emojiSpans[ef] = es;
                        }
                        document.body.appendChild(prefContainer);
                        for (var pf in prefSpans) {
                            if (!prefSpans.hasOwnProperty(pf)) continue;
                            fontPrefs[pf] = prefSpans[pf].offsetWidth;
                        }
                        emojiPrefs = {};
                        for (var ef in emojiSpans) {
                            if (!emojiSpans.hasOwnProperty(ef)) continue;
                            emojiPrefs[ef] = emojiSpans[ef].offsetWidth;
                        }
                        document.body.removeChild(prefContainer);
                    } catch (e) {}

                    var fontSigParts = [];
                    fontSigParts.push(detectedFonts.join(','));
                    var prefKeys = ['default', 'serif', 'sansSerif', 'monospace', 'cursive', 'fantasy', 'system', 'apple'];
                    for (var fsi = 0; fsi < prefKeys.length; fsi++) {
                        fontSigParts.push(prefKeys[fsi] + ':' + (fontPrefs[prefKeys[fsi]] || 0));
                    }
                    var emojiKeys = ['emoji', 'appleEmoji', 'notoEmoji', 'segoeEmoji', 'twemojiMozilla', 'androidEmoji', 'webkitStandard'];
                    for (var esi = 0; esi < emojiKeys.length; esi++) {
                        fontSigParts.push(emojiKeys[esi] + ':' + (emojiPrefs[emojiKeys[esi]] || 0));
                    }

                    sections.fonts = {
                        found: detectedFonts,
                        preferences: fontPrefs,
                        emoji: emojiPrefs,
                        signature: fontSigParts.length ? md5(fontSigParts.join('|')) : '',
                    };

                    var fontBrowser = { browser: 'Unknown', os: 'Unknown', confidence: 'Low' };
                    try {
                        var hasFont = {};
                        for (var dfi = 0; dfi < detectedFonts.length; dfi++) {
                            hasFont[detectedFonts[dfi]] = true;
                        }
                        var fontCount = detectedFonts.length;

                        var isWinFonts = !!(hasFont['Segoe UI'] || hasFont['Calibri'] || hasFont['Cambria']);
                        var isMacFonts = !!(hasFont['Helvetica Neue'] || hasFont['Avenir'] || hasFont['Avenir Next'] || hasFont['San Francisco'] || hasFont['Menlo']);
                        var isLinuxFonts = !!(hasFont['DejaVu Sans'] || hasFont['FreeSans'] || hasFont['Ubuntu']);
                        var hasAppleExclusive = !!(hasFont['Apple Chancery'] || hasFont['Apple Braille'] || hasFont['Apple SD Gothic Neo']);
                        var hasMacExclusive = !!(hasFont['Futura'] || hasFont['Optima'] || hasFont['Didot'] || hasFont['Copperplate'] || hasFont['Gill Sans']);

                        var eDef = emojiPrefs.emoji || 0;
                        var eTwemoji = emojiPrefs.twemojiMozilla || 0;

                        var twemojiDiff = Math.abs(eTwemoji - eDef);
                        var twemojiActive = eTwemoji > 0 && twemojiDiff >= 30;

                        var pDefault = fontPrefs['default'] || 0;
                        var pSystem = fontPrefs.system || 0;
                        var pApple = fontPrefs.apple || 0;
                        var pFantasy = fontPrefs.fantasy || 0;
                        var pCursive = fontPrefs.cursive || 0;
                        var pSerif = fontPrefs.serif || 0;
                        var pMono = fontPrefs.monospace || 0;

                        var safariPrefs = pFantasy > 1100 && Math.abs(pApple - pSystem) <= 5 && pApple !== pSerif;
                        var chromeWinPrefs = isWinFonts && pFantasy < 900 && pSystem > 950;
                        var firefoxWinPrefs = isWinFonts && pFantasy > 900 && pSystem < 960;

                        if (safariPrefs) {
                            fontBrowser.os = 'macOS';
                            if (navigator.maxTouchPoints > 1) fontBrowser.os = 'iOS';
                        } else if ((hasAppleExclusive || hasMacExclusive) && !isWinFonts) {
                            fontBrowser.os = 'macOS';
                            if (navigator.maxTouchPoints > 1) fontBrowser.os = 'iOS';
                        } else if (isWinFonts) {
                            fontBrowser.os = 'Windows';
                        } else if (isLinuxFonts) {
                            fontBrowser.os = 'Linux';
                        }

                        if (twemojiActive) {
                            fontBrowser.browser = 'Firefox';
                            fontBrowser.confidence = 'High';
                        } else if (safariPrefs && (hasAppleExclusive || hasMacExclusive)) {
                            fontBrowser.browser = 'Safari';
                            fontBrowser.confidence = 'High';
                        } else if (chromeWinPrefs && !twemojiActive) {
                            fontBrowser.browser = 'Chromium-based';
                            fontBrowser.confidence = 'Medium';
                        } else if (firefoxWinPrefs && !twemojiActive) {
                            fontBrowser.browser = 'Firefox';
                            fontBrowser.confidence = 'Low';
                        } else if (isMacFonts && !isWinFonts && !twemojiActive && !safariPrefs) {
                            fontBrowser.browser = 'Chromium-based';
                            fontBrowser.confidence = 'Medium';
                        } else if (hasFont['Roboto'] && hasFont['Droid Sans']) {
                            fontBrowser.browser = 'Chrome (Android)';
                            fontBrowser.confidence = 'Medium';
                            if (fontBrowser.os === 'Unknown') fontBrowser.os = 'Android';
                        }

                        if (fontBrowser.os !== 'Unknown' && fontBrowser.browser !== 'Unknown' && fontBrowser.confidence === 'Low') {
                            fontBrowser.confidence = 'Medium';
                        }
                    } catch (e) {}

                    sections.fonts.browser = fontBrowser;

                    if (fontBrowser.confidence === 'High' || fontBrowser.confidence === 'Medium') {
                        var tamperedBeforeFonts = tampered;

                        if (fontBrowser.browser && fontBrowser.browser !== 'Unknown') {
                            var kernelBrowser = (kernel.browser || '').toLowerCase();
                            var fontBrLower = fontBrowser.browser.toLowerCase();
                            var browserMismatch = false;

                            if (fontBrLower === 'firefox' && kernelBrowser.indexOf('firefox') === -1) browserMismatch = true;
                            if (fontBrLower === 'safari' && kernelBrowser.indexOf('safari') === -1) browserMismatch = true;
                            if (fontBrLower === 'chromium-based' && kernelBrowser.indexOf('firefox') !== -1) browserMismatch = true;
                            if (fontBrLower === 'chromium-based' && kernelBrowser.indexOf('safari') !== -1 && kernelBrowser.indexOf('chrome') === -1) browserMismatch = true;

                            if (browserMismatch) {
                                tampered = true;
                                tamperedReasons.push('Font analysis says ' + fontBrowser.browser + ' but kernel says ' + kernel.browser);
                            }
                        }

                        if (fontBrowser.os && fontBrowser.os !== 'Unknown') {
                            var navPlatform = (sections.navigator.platform || '').toLowerCase();
                            var navUA = (sections.navigator.userAgent || '').toLowerCase();
                            var osMismatch = false;

                            if (fontBrowser.os === 'Windows' && navPlatform.indexOf('win') === -1 && navUA.indexOf('windows') === -1) osMismatch = true;
                            if (fontBrowser.os === 'macOS' && navPlatform.indexOf('mac') === -1 && navUA.indexOf('mac') === -1) osMismatch = true;
                            if (fontBrowser.os === 'iOS' && navUA.indexOf('iphone') === -1 && navUA.indexOf('ipad') === -1) osMismatch = true;
                            if (fontBrowser.os === 'Linux' && navPlatform.indexOf('linux') === -1 && navUA.indexOf('linux') === -1) osMismatch = true;
                            if (fontBrowser.os === 'Android' && navUA.indexOf('android') === -1) osMismatch = true;

                            if (osMismatch) {
                                tampered = true;
                                tamperedReasons.push('Font analysis says ' + fontBrowser.os + ' but UA says otherwise');
                            }
                        }

                        if (tampered && !tamperedBeforeFonts) {
                            addRisk('BROWSER_TAMPERED', 'Browser tamper detected', 25, 'high');
                        }
                    }

                    sections.canvas = getCanvasFingerprint();

                    return getAudioFingerprint().then(function (audioValue) {
                        sections.audio = {
                            value: audioValue || '',
                            signature: audioValue ? md5(audioValue) : '',
                        };

                        riskScore = Math.min(riskScore, 100);

                        var browserId = generateBrowserId(sections, kernel);

                        return {
                            risk: {
                                score: riskScore,
                                reasons: riskReasons,
                            },
                            tampering: {
                                detected: tampered,
                                reasons: tamperedReasons,
                            },
                            fingerprint: {
                                browserId: browserId,
                            },
                            sections: sections,
                        };
                    });
                });
            });
        }
    }

    return { scan: scan };
})();
