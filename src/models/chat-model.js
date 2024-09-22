const mongoose = require("mongoose");

//These field are going to added inside the schema

//chatName = if group chat then groupname or just "sender"
//isGroupChat = boolean
//users = group users or users in one on one chat
//latestMessage = last message we saw in chats list just like whatsapp
//groupAdmin = groupAdmin details

//ref:"User"

//It means reference like which model is reference to like in this case it's reference to the usersModel

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
