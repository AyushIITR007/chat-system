var ws = new WebSocket("ws://localhost:3000");

// const redis = require('redis');
// const client = redis.createClient({
//     socket: {
//         host: '<hostname>',
//         port: <port>
//     },
//     password: '<password>'
// });

client.on('error', err => {
    console.log('Error ' + err);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const datetime = new Date(Date.now());
  if (input.value) {
    var data = JSON.stringify({
      message: input.value,
      time: datetime.toString()
    });
    ws.send(data);
  }
  input.value = '';
});

ws.onmessage = (message) => {
  var item = document.createElement('li');
  //parsing once was still converting to string for some reason, but parsing twice worked
  var myJson = JSON.parse(message.data);
  myJson = JSON.parse(myJson);
  var text = myJson.message;
  var time = myJson.time;
  item.textContent = time + ": " + text;
  messages.appendChild(item);
}
