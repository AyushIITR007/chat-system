var ws = new WebSocket("ws://localhost:3000");
var xhr = new XMLHttpRequest();

const messageForm = document.getElementsByClassName("sendMessageForm");
const messageBox = document.getElementsByClassName("messageBox");
const messages = document.getElementsByClassName("messages");
const sendMessageFunctionName = "sendMessage";

function makeDoubleDigitIfSingle(num) {
  return (num/10) < 1 ? "0" + num : num;
}

function AmPmFormatting(time) {
  var hours = Number(time.substring(0,2));
  if (hours >= 12)
  {
    if(hours != 12) {
      hours -= 12;
    }
    time += "PM";
  }
  else {
    time += "AM";
  }
  var formattedTime = parseInt((hours/10)).toString() + hours%10 + time.substring(2)
  return formattedTime;
}

function appendMessageBlock(message) {
  var block = document.createElement("div");
  block.setAttribute("class", "messageBlock");
  var msgHolder = document.createElement("div");
  msgHolder.setAttribute("class", "msgHolder");
  var timeStampHolder = document.createElement("div");
  timeStampHolder.setAttribute("class", "timeStampHolder");
  var msgTextHolder = document.createElement("div");
  msgTextHolder.setAttribute("class", "msgTextHolder");
  timeStampHolder.textContent = message.time;
  msgTextHolder.textContent = message.message;

  msgHolder.appendChild(timeStampHolder);
  msgHolder.appendChild(msgTextHolder);
  block.appendChild(msgHolder);
  messages[0].appendChild(block);
  block.scrollIntoView({block: "end"});
}

async function ajaxHandler(method, endpoint, async=true) { 
  xhr.open(method, endpoint, async);
  xhr.send();
};

window.onload = async function() {
  await ajaxHandler("GET","/loadMessages").then(() => {
    xhr.onreadystatechange = function () {  
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        data.forEach(message => {
          appendMessageBlock(message)
        });
      }
    }
  });
}

messageForm[0].addEventListener('submit', async function(e) {
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
  messageBox[0].value = "";
});

ws.onmessage = (message) => {
  appendMessageBlock(JSON.parse(message.data));
}