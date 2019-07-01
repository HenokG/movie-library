var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on("connection", function(socket) {
  console.log("A new user connected");
});

socketApi.send = function(data) {
  io.sockets.emit("fromAPI", data);
};

module.exports = socketApi;
