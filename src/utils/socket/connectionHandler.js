// Handle all the socket events here based on the action

const handleSocketEvents = (socket) => {
  console.log("A user connected: " + socket.id);

  // Handle socket events
  // socket.on("setup", (userData) => handleSetup(socket, userData));
  // socket.on("join chat", (room) => handleJoinChat(socket, room));
  // socket.on("typing", (room) => handleTyping(socket, room));
  // socket.on("stop typing", (room) => handleStopTyping(socket, room));
  // socket.on("new message", (newMessageRecieved) => handleMessage(socket, newMessageRecieved));

  //user disconnected
  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
};

module.exports = handleSocketEvents;
