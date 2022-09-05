const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocketServer = require('websocket').server;
const favicon = require('serve-favicon');
const redis = require('redis');
const redisClient = redis.createClient();

//----String Constants Begin----

const sendMessageFunctionName = "sendMessage";

//----String Constants End----

//To load static files from "app" directory
app.use(express.static("app"));

//To load favicon image
app.use(favicon(__dirname + "/app/favicon.png"));

//----Functions Begin----

async function initRedis () {
  await redisClient.connect();
}

//----Functions End----

//Initializing websocket
var wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', async function(request) {
  var connection = request.accept(null, request.origin);
  connection.on('message', async (data) => {
    var receivedData = JSON.parse(data.utf8Data);
    switch(receivedData.funcName) {
      case sendMessageFunctionName:
        // msgs = await redisClient.get("messageQueue").then((x)=>x);
        // if(msgs) {
        //   msgs = JSON.parse(msgs);
        //   msgs.push(receivedData);
        // }
        // else{
        //   msgs = [receivedData];
        // }
        // redisClient.setEx("messageQueue",3600,JSON.stringify(msgs));
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

app.get('/loadMessages',async (req, res) => {
  var data = await redisClient.get("messageQueue");
  res.send(data);
});

//----URL Routings End----

//Initialize Redis
//initRedis();

//Host app on port
server.listen(3000, () => {
  console.log('listening on *:3000');
});