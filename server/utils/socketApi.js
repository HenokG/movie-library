var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on("connection", function(socket) {
  console.log("New Client Connected");
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

socketApi.sendForSharedMovies = function(data) {
  io.sockets.emit("fromAPIUpdateSharedMovies", data);
};

socketApi.sendForAllMovies = function(data) {
  io.sockets.emit("fromAPIUpdateAllMovies", data);
};

module.exports = socketApi;
