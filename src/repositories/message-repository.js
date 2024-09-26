const Message = require("../models/message-model");
const { ObjectId } = require("mongodb");

class MessageRepository {
  async fetchMessages(chatId) {
    try {
      const messages = await Message.find({ chat: chatId }).populate("chat");
      return messages;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageRepository();
