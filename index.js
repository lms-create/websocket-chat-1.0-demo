//index.js
const { wsServer } = require('./wsServer');
const { server } = require('./server');
server.on('listening', () => {
  console.log('http server listening');
});
wsServer.on('listening', () => {
  console.log('websocket listening');
});
