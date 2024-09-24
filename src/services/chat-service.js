const chatRepository = require("../repositories/chat-repository");
const ServiceError = require("../utils/errors/service-error");
const axios = require("axios");
const { AUTH_SERVICE_URL } = require("../config/serverConfig");

class ChatService {
  async getUserDetailsById(userId) {
    try {
      const userDetails = await axios.get(
        `${AUTH_SERVICE_URL}/api/v1/user/get-user-details?user=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!userDetails?.data) {
        throw new ServiceError(
          "Service Error",
          "There is something wrong in Auth service error",
          "",
          500
        );
      }
      return userDetails?.data?.data;
    } catch (error) {
      throw error;
    }
  }

  async getChatsOfUser(userId) {
    try {
      const chats = await chatRepository.getUserChatById(userId);
      // Need to get user details who send the last message from user repo
      const allChats = [];
      for (const chat of chats) {
        // Convert Mongoose document to plain JavaScript object
        const chatObj = chat.toObject(); // Ensures you can modify it
        if (chat?.latestMessage) {
          chatObj.latestMessage.sender = await this.getUserDetailsById(
            chat?.latestMessage?.sender
          );
        }
        allChats.push(chatObj);
      }
      return allChats;
    } catch (error) {
      throw new ServiceError(
        error.name,
        error.message,
        error.explanation,
        error.statusCode
      );
    }
  }
}

module.exports = new ChatService();
