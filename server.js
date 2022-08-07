const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocketServer = require('websocket').server;
const favicon = require('serve-favicon');

const redis = require('redis');
const { throws } = require('assert');
const redisClient = redis.createClient();

async function main () {
  // You can use await inside this function block
  await redisClient.connect();
}
main();


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
        redisClient.setEx("messageQueue",3600,data.utf8Data);
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

app.get('/test',async (req, res) => {
  var data = "init";
  data = await redisClient.get("messageQueue").then((x)=>x.text());
  console.log(data+ "hello");
  res.send(data);
});

//----URL Routings End----


//Host app on port
server.listen(3000, () => {
  console.log('listening on *:3000');
});