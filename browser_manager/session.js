module.exports = function (browserManager) {
  browserManager.session_name_list = [];

  browserManager.handleSession = function () {
    let ss = browserManager.electron.session.defaultSession;

    ss.registerPreloadScript({
      type: 'frame',
      id: 'frame-preload',
      filePath: browserManager.files_dir + '/js/preload.js',
    });
    ss.registerPreloadScript({
      type: 'service-worker',
      id: 'service-preload',
      filePath: browserManager.files_dir + '/js/preload.js',
    });

    return ss;
  };
};
