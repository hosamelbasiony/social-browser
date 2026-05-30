module.exports = function init(browserApp) {
  browserApp.allow_widevinecdm = function () {
    let pluginName;
    switch (process.platform) {
      case 'win32':
        pluginName = 'widevinecdm.dll';
        break;
      case 'darwin':
        pluginName = 'widevinecdm.plugin';
        break;
      case 'linux':
        pluginName = 'widevinecdm.so';
        break;
    }

    let path = browserApp.path.resolve('C:/Program Files/Google/Chrome/Application/132.0.6834.197/WidevineCdm/_platform_specific/win_x64') || browserApp.path.join(browserApp.dir, 'plugins', pluginName);

    console.log('Loading Plugin :: ' + path);

    browserApp.electron.app.commandLine.appendSwitch('widevine-cdm-path', path);
    browserApp.electron.app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2830.0');
  };

  browserApp.allow_widevinecdm();
};
