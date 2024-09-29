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
        // we want only the populate that user that i've one on one chat.
        if (!chat?.isGroupChat) {
          for (let i = 0; i < chatObj?.users?.length; i++) {
            chatObj.users[i] = await this.getUserDetailsById(chat?.users?.[i]);
          }
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

  async getUsersBySearch(keyWords, userId) {
    try {
      const response = await axios.get(
        `${AUTH_SERVICE_URL}/api/v1/user/search-user?search=${keyWords}&user=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const users = await response?.data?.users;
      return users;
    } catch (error) {
      throw new ServiceError(
        error.name,
        error.message,
        error.explanation,
        error.statusCode
      );
    }
  }

  async createChat(selectedChatUserId, userId) {
    let chatObj;
    try {
      const previousChat = await chatRepository.findOldChatWithUser(
        selectedChatUserId,
        userId
      );
      if (previousChat?.[0]) {
        chatObj = previousChat?.[0]?.toObject();
        //If previous chat is present
        // populate latestMessage.sender details
        if (chatObj?.latestMessage) {
          chatObj.latestMessage.sender = await this.getUserDetailsById(
            previousChat?.[0]?.latestMessage?.sender
          );
        }
      } else {
        // create new chat with selected user
        const chat = {
          chatName: "sender",
          isGroupChat: false,
          users: [selectedChatUserId, userId],
        };

        const createdChat = await chatRepository.createChat(chat);
        chatObj = createdChat?.toObject();
        //populate the users of the chat for the UI.
      }
      for (let i = 0; i < chatObj?.users?.length; i++) {
        chatObj.users[i] = await this.getUserDetailsById(chatObj.users[i]);
      }
      return chatObj;
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
