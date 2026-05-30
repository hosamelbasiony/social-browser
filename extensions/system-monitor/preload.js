// Guard SOCIALBROWSER — may not be defined in native preload context
if (typeof SOCIALBROWSER !== 'undefined') {
    SOCIALBROWSER.addMenu({
        label: '📊 System Monitor',
        click() {
            document.location.href = 'http://127.0.0.1:60080/extentions/system-monitor';
        },
    });
    SOCIALBROWSER.addMenu({ type: 'separator' });
    SOCIALBROWSER.onLoad(() => {});
}
