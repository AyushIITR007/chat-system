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

function makeDoubleDigitIfSingle(num)
{
  return (num/10) < 1 ? "0" + num : num;
}

function AmPmFormatting(time)
{
  var hours = Number(time.substring(0,2));
  if (hours > 12)
  {
    hours -= 12;
    time += "pm";
  }
  else if (hours == 12)
  {
    time += "pm";
  }
  time[0] = (hours/10)%1;
  time[1] = hours%10;
  return time;
}

messageForm[0].addEventListener('submit', function(e) {
  e.preventDefault();
  const currdatetime = new Date(Date.now());
  var dateForDisplay = "[" + makeDoubleDigitIfSingle(currdatetime.getDay()) + "/" + makeDoubleDigitIfSingle(currdatetime.getMonth()) + "/" + (currdatetime.getFullYear() - 2000) + "]";
  var timeForDisplay = AmPmFormatting(makeDoubleDigitIfSingle(currdatetime.getHours()) + ":" + makeDoubleDigitIfSingle(currdatetime.getMinutes()));
  if (messageBox[0].value) {
    var data = JSON.stringify({
      message: messageBox[0].value.trim(),
      time: dateForDisplay + " " + timeForDisplay,
      funcName: sendMessageFunctionName
    });
    ws.send(data);
  }
  messageBox[0].value = '';
});

ws.onmessage = (message) => {
  var item = document.createElement('div');
  item.setAttribute("class", "messageBlock");
  var myJson = JSON.parse(message.data);
  var text = myJson.message;
  var time = myJson.time;
  item.textContent = time + " - " + text;
  messages[0].appendChild(item);
}