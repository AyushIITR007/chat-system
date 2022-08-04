const express = require('express')
const server = express()
const port = 8080

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
}

server.use(requestTime)

server.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

server.listen(port, () => {
  console.log("Listening on port: " + port)
})