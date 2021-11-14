//server.js
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,() => {
  console.log(`SERVER is OPEN FORM ${PORT}`);
})
exports.server = server;