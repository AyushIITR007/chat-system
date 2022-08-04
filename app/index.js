const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var WebSocketServer = require('websocket').server;

app.use(express.static("app"));
var wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  connection.on('message', (data) => {
    connection.send(JSON.stringify(data.utf8Data));
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});