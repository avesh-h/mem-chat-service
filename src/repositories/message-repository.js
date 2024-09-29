const Message = require("../models/message-model");

class MessageRepository {
  async fetchMessages(chatId) {
    try {
      const messages = await Message.find({ chat: chatId }).populate("chat");
      return messages;
    } catch (error) {
      throw error;
    }
  }

  async createMessage(msgObj) {
    try {
      const newMessage = await Message.create(msgObj);
      return newMessage?.populate("chat");
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageRepository();
