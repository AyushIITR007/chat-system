const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocketServer = require('websocket').server;
const favicon = require('serve-favicon');

const sendMessageFunctionName = "sendMessage";

//To load static files from "app" directory
app.use(express.static("app"));
app.use(favicon(__dirname + "/app/favicon.png"));


//Initializing websocket
var wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  connection.on('message', (data) => {
    var receivedData = JSON.parse(data.utf8Data);
    switch(receivedData.funcName) {
      case sendMessageFunctionName:
        connection.send(data.utf8Data);
        break;
      default:
        console.log("Invalid request received by socket!");
    };
  });
});


//----URL Routings Begin----

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//----URL Routings End----


//Host app on port
server.listen(3000, () => {
  console.log('listening on *:3000');
});