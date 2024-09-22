// Handle all the socket events here based on the action

const handleSocketEvents = (socket) => {
  console.log("A user connected: " + socket.id);

  //user disconnected
  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
};

module.exports = handleSocketEvents;
