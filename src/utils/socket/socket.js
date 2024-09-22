const { Server } = require("socket.io");
const handleSocketEvents = require("./connectionHandler");
const { FRONTEND_URL } = require("../../config/serverConfig");

// follow singleton pattern here

let io = null;

// Setter function that set socket.io
const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: FRONTEND_URL,
      },
    });

    io.on("connection", (socket) => {
      // Additional event listeners can be added here
      handleSocketEvents(socket);
    });
  }
  return io;
};

//Getter function

const getSocketInstance = () => {
  if (!io) {
    new Error("Socket is not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getSocketInstance, io };
