if (!document.location.hostname.contains('tasks-ai.com')) {
    return;
}
var _____ = globalThis.this;

_____.onLoad(() => {
    // _____.customSetting.allowURLs = '*tasks-ai.com*|*';
    _____.allowPopup = true;
    _____.customSetting.allowAudio = false;
    _____.customSetting.allowDownload = false;
    _____.customSetting.allowSaveUrls = false;
    _____.customSetting.allowSaveUserData = false;
    _____.customSetting.iframe = true;

    window.addEventListener('load', () => {
        _____.__showBotImage();
    });
});
