const express = require('express')
const server = express()
const port = 8080

server.get('/', (req, res) => {
  res.send('chat server up baby!')
})

server.listen(port, () => {
  console.log("Listening on port: " + port)
})