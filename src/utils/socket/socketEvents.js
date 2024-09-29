const ClientError = require("../errors/client-error");
const httpStatusCode = require("../httpStatusCode");

const handleSetup = (socket, userDetails) => {
  // Here we create room for the logged in user for When another user wants to send a private message to this user, you can emit events specifically to their room (using their ID) instead of broadcasting to all connected sockets.
  // Room Name = userDetails?.result?._id

  // This is the private room for the current logged in user for if user have notification for new message or something like that events will fire in this room

  socket.join(userDetails?.result?._id);
  // To let logged in user know is connected
  socket.emit("connected");
};

const handleJoinChat = (socket, chatId) => {
  // This is the different room for the user based on click selected user and chat of them and in that chat we've the users so between those user will fire the event if they exchange message between them
  socket.join(chatId);
  console.log("user join room " + chatId);
};

const handleTyping = (socket, room) => {
  // socket for typing in which we will recieve room and inside that room we will emit typing event for all the users except one that typing now.
  socket.in(room).emit("typing");
};

const handleStopTyping = (socket, room) => {
  socket.in(room).emit("stop typing");
};

// When new message received
const handleMessage = (socket, newMessage) => {
  const chat = newMessage.chat;
  if (!chat?.users)
    return new ClientError(
      "ValidationError",
      "Invalid request!",
      "No number of users",
      httpStatusCode.BAD_REQUEST
    );

  // fire event to the each user individual room that they got notification of the new message.
  newMessage?.chat?.users?.forEach((user) => {
    // skip for the user who sent the message
    if (user?._id === newMessage?.sender?._id) return;

    //Fire event for the other users
    socket.in(user?._id).emit("message recieved", newMessage);
  });
};

module.exports = {
  handleSetup,
  handleJoinChat,
  handleTyping,
  handleStopTyping,
  handleMessage,
};
