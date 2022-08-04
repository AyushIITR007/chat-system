var ws = new WebSocket("ws://localhost:3000");

// const redis = require('redis');
// const client = redis.createClient({
//     socket: {
//         host: '<hostname>',
//         port: <port>
//     },
//     password: '<password>'
// });

const messageForm = document.getElementsByClassName("sendMessageForm");
const messageBox = document.getElementsByClassName("messageBox");
const messages = document.getElementsByClassName("messages");
const sendMessageFunctionName = "sendMessage";

messageForm[0].addEventListener('submit', function(e) {
  e.preventDefault();
  const datetime = new Date(Date.now());
  console.log(datetime.getDate());
  if (messageBox[0].value) {
    var data = JSON.stringify({
      message: messageBox[0].value.trim(),
      time: datetime.toString(),
      funcName: sendMessageFunctionName
    });
    ws.send(data);
  }
  messageBox[0].value = '';
});

ws.onmessage = (message) => {
  var item = document.createElement('div');
  item.setAttribute("class", "messageBlock");
  //parsing once was still converting to string for some reason, but parsing twice worked
  var myJson = JSON.parse(message.data);
  var text = myJson.message;
  var time = myJson.time;
  item.textContent = text + " (" + time + ")";
  messages[0].appendChild(item);
}