module.exports = function init(browserManager) {
  browserManager.WebSocket = require('ws');
  browserManager._chat_ = new browserManager.WebSocket.Server({
    noServer: true,
  });

  browserManager.api.servers.forEach((server) => {
    server.on('upgrade', function upgrade(request, socket, head) {
      const pathname = new browserManager.url(request.url).pathname;

      if (pathname === '/x-chat') {
        browserManager._chat_.handleUpgrade(request, socket, head, function done(ws) {
          browserManager._chat_.emit('connection', ws, request);
        });
      }
    });
  });

  browserManager.chatUserList = [];
  browserManager.sendToAllChatUsers = function (message, parser, user) {
    browserManager.chatUserList.forEach((client) => {
      if (client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
        if (user && user.guid === client.guid) {
          return;
        }
        if (parser === false) {
          client.ws.send(message);
        } else {
          client.ws.send(JSON.stringify(message));
        }
      }
    });
  };

  browserManager._chat_.on('connection', (ws, req) => {
    let user = { guid: new Date().getTime() + '_' + Math.random(), isOnlie: true, joinTime: new Date().getTime(), ws: ws };

    ws.send(
      JSON.stringify({
        type: 'connected',
      }),
    );

    ws.on('message', (data) => {
      try {
        if (Buffer.isBuffer(data)) {
          browserManager.sendToAllChatUsers(new Uint8Array(data), false, user);
        } else {
          let message = JSON.parse(data);
          switch (message.type) {
            case '[request-join]':
              (user.userName = message.userName), browserManager.chatUserList.push(user);
              browserManager.sendToAllChatUsers({
                type: '[new-user-join]',
                user: {
                  guid: user.guid,
                  userName: user.userName,
                  isOnlie: user.isOnlie,
                  joinTime: user.joinTime,
                },
              });
              browserManager.sendToAllChatUsers(
                {
                  type: '[request-stream]',
                  guid: user.guid,
                },
                true,
                user,
              );
              break;
              case '[to-all]':
                browserManager.chatUserList.forEach((client) => {
                  if (client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                  }
                });
                break;
              case 'candidate':
              browserManager.chatUserList.forEach((client) => {
                if (client.guid == message.ref.guid && client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
                  client.ws.send(JSON.stringify(message));
                }
              });
              break;
              case 'answer':
                browserManager.chatUserList.forEach((client) => {
                  if (client.guid == message.ref.guid && client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                  }
                });
                break;
                case 'offer':
                  browserManager.chatUserList.forEach((client) => {
                    if (client.guid == message.ref.guid && client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
                      client.ws.send(JSON.stringify(message));
                    }
                  });
                  break;
            case '[to-other]':
              browserManager.chatUserList.forEach((client) => {
                if (client.index !== message.index && client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
                  client.ws.send(JSON.stringify(message));
                }
              });
              break;
            case '[to-index]':
              browserManager.chatUserList.forEach((client) => {
                if (client.index === message.index && client.ws && client.ws.readyState === browserManager.WebSocket.OPEN) {
                  client.ws.send(JSON.stringify(message));
                }
              });
              break;
            default:
              break;
          }
        }
      } catch (e) {
        browserManager.log(e);
        ws.send(
          JSON.stringify({
            type: 'ERROR',
            payload: e,
          }),
        );
      }
    });
  });
};
