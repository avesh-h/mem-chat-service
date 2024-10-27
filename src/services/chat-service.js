const chatRepository = require("../repositories/chat-repository");
const ServiceError = require("../utils/errors/service-error");
const axios = require("axios");
const { AUTH_SERVICE_URL } = require("../config/serverConfig");
const ClientError = require("../utils/errors/client-error");

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
        // we want only the populate that user that i've one on one chat or also for all users of the group.
        for (let i = 0; i < chatObj?.users?.length; i++) {
          chatObj.users[i] = await this.getUserDetailsById(chat?.users?.[i]);
          if (
            chatObj?.isGroupChat &&
            chatObj?.users[i]?._id === chatObj?.groupAdmin?.toString()
          ) {
            chatObj.groupAdmin = chatObj?.users[i];
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

  async createChatGroup(groupDetails, userId) {
    const groupMembers = groupDetails?.users;
    var users = JSON.parse(groupMembers);
    const groupName = groupDetails?.name;
    let chatObj;
    try {
      if (!groupMembers || !users?.length || !groupName) {
        throw new ClientError("", "Please fill all the required fields");
      }
      if (users.length < 2) {
        throw new ClientError(
          "",
          "More than 2 users are required to form the group chat"
        );
      }
      users.push(userId);
      //Chat object of group chat
      const groupObj = {
        chatName: groupName,
        users,
        isGroupChat: true,
        groupAdmin: userId,
      };

      const groupChat = await chatRepository.createChat(groupObj);
      chatObj = groupChat.toObject();
      for (let i = 0; i < chatObj?.users?.length; i++) {
        chatObj.users[i] = await this.getUserDetailsById(chatObj.users[i]);
        if (
          chatObj?.isGroupChat &&
          chatObj?.users[i]?._id === chatObj?.groupAdmin?.toString()
        ) {
          chatObj.groupAdmin = chatObj?.users[i];
        }
      }
      return chatObj;
    } catch (error) {
      if (error?.name?.toLowerCase()?.includes("client")) {
        throw error;
      }
      throw new ServiceError(
        error.name,
        error.message,
        error.explanation,
        error.statusCode
      );
    }
  }

  async renameGroup(chatId, chatName) {
    try {
      const updatedChat = await chatRepository.renameGroup(chatId, chatName);
      if (!updatedChat) {
        throw new ClientError("", "Chat not found!");
      }
      const updatedChatObj = updatedChat.toObject();
      for (let i = 0; i < updatedChatObj?.users?.length; i++) {
        updatedChatObj.users[i] = await this.getUserDetailsById(
          updatedChatObj.users[i]
        );
        if (
          updatedChatObj?.isGroupChat &&
          updatedChatObj?.users[i]?._id ===
            updatedChatObj?.groupAdmin?.toString()
        ) {
          updatedChatObj.groupAdmin = updatedChatObj?.users[i];
        }
      }
      return updatedChatObj;
    } catch (error) {
      throw error;
    }
  }

  async removeOrAddUserInGroup(chatId, userId, isAdd = false) {
    try {
      let updatedChat;
      if (!isAdd) {
        updatedChat = await chatRepository.removeUserFromGroupChat(
          chatId,
          userId
        );
      } else {
        updatedChat = await chatRepository.addUserInGroupChat(chatId, userId);
      }
      if (!updatedChat) {
        throw new ClientError("", "User not found!", "", 404);
      }
      const updatedChatObj = updatedChat.toObject();
      for (let i = 0; i < updatedChatObj?.users?.length; i++) {
        updatedChatObj.users[i] = await this.getUserDetailsById(
          updatedChatObj.users[i]
        );
        if (
          updatedChatObj?.isGroupChat &&
          updatedChatObj?.users[i]?._id ===
            updatedChatObj?.groupAdmin?.toString()
        ) {
          updatedChatObj.groupAdmin = updatedChatObj?.users[i];
        }
      }
      return updatedChatObj;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatService();
