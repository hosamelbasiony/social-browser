module.exports = function init(browserManager) {
  if (browserManager.is_render) {
    browserManager.on = function (name, callback) {
      browserManager.electron.ipcRenderer.on(name, callback);
    };

    browserManager.call = function (channel, value) {
      browserManager.electron.ipcRenderer.send(channel, value);
    };
  } else {
    browserManager.on = function (name, callback) {
      browserManager.electron.ipcMain.on(name, callback);
    };
    browserManager.call = function (channel, value) {
      if (!browserManager.is_app_ready) {
        return null;
      }
      if (channel == '[send-render-message]' && value.name == '[open new tab]') {
        browserManager.get_main_window().send(channel, value);
      } else {
        browserManager.main_window_list.forEach((w) => {
          if (w.window && !w.window.isDestroyed()) {
            w.window.send(channel, value);
          }
        });
      }

      if (browserManager.addressbarWindow && !browserManager.addressbarWindow.isDestroyed()) {
        browserManager.addressbarWindow.send(channel, value);
      }
      if (browserManager.userProfileWindow && !browserManager.userProfileWindow.isDestroyed()) {
        browserManager.userProfileWindow.send(channel, value);
      }

      if (browserManager.window_list) {
        browserManager.window_list.forEach((view) => {
          if (view.window && !view.window.isDestroyed()) {
            view.window.send(channel, value);
          }
        });
      }
    };
  }
};
