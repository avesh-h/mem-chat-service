const { Server } = require("socket.io");
const { FRONTEND_URL } = require("./serverConfig");

const initializeSocket = (server) => {
  return new Server(server, {
    cors: {
      origin: FRONTEND_URL,
    },
  });
};

module.exports = initializeSocket;
