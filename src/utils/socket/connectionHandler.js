// Handle all the socket events here based on the action

const {
  handleSetup,
  handleJoinChat,
  handleTyping,
  handleStopTyping,
  handleMessage,
} = require("./socketEvents");

const handleSocketEvents = (socket) => {
  console.log("A user connected: " + socket.id);

  let user;

  // Handle socket events
  socket.on("setup", (userData) => {
    user = userData;
    handleSetup(socket, userData);
  });

  // // When click on any user to chat with him so selected user in room with logged in user
  socket.on("join chat", (chatId) => handleJoinChat(socket, chatId));

  // When user typing
  socket.on("typing", (room) => handleTyping(socket, room));

  socket.on("stop typing", (room) => handleStopTyping(socket, room));

  socket.on("new message", (newMessageRecieved) =>
    handleMessage(socket, newMessageRecieved)
  );

  //user disconnected
  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
    if (user) {
      socket.leave(user?.result?._id);
    }
  });
};

module.exports = handleSocketEvents;
