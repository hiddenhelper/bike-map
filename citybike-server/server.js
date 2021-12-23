const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach";

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
let bikeData = null;

app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

io.on("connection", (socket) => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log("New connection " + socketId + " from " + clientIp);
  socket.emit("bikeData", bikeData);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

axios
  .get(citybikeurl)
  .then((res) => {
    bikeData = res.data;
  })
  .catch((err) => console.log(err));
