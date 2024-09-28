const Chat = require("../models/chat-model");
// For just make populate work
require("../models/message-model");

class ChatRepository {
  async getUserChatById(userId) {
    try {
      const chats = await Chat.find({
        users: { $elemMatch: { $eq: userId } },
      })
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      return chats;
    } catch (error) {
      throw error;
    }
  }

  async updateLatestMessageOfChat(chatId, message) {
    try {
      const chat = await Chat.findOneAndUpdate(
        { _id: chatId },
        {
          latestMessage: message,
        },
        { new: true }
      );
      return chat;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatRepository();
