const chatRepository = require("../repositories/chat-repository");
const messageRepository = require("../repositories/message-repository");
const ServiceError = require("../utils/errors/service-error");
const chatService = require("./chat-service");

class MessageService {
  async fetchMessagesByChatId(chatId) {
    try {
      const messages = await messageRepository.fetchMessages(chatId);
      const allMessages = [];
      //   Get users details based on the id
      for (const message of messages) {
        const messageObj = message.toObject(); // TO make sure first convert mongoose doc to editable js object.
        if (message.sender) {
          messageObj.sender = await chatService.getUserDetailsById(
            message.sender
          );
        }
        allMessages.push(messageObj);
      }
      return allMessages;
    } catch (error) {
      throw new ServiceError(
        error.name,
        error.message,
        error.explanation,
        error.statusCode
      );
    }
  }

  async sendMessage(content, chatId, senderId) {
    try {
      let messageObj = {
        sender: senderId,
        content,
        chat: chatId,
      };
      const newMessage = await messageRepository.createMessage(messageObj);
      //Get sender details
      // After created message make sender populate to get name and pic
      let newMessageObj;
      if (newMessage) {
        newMessageObj = newMessage.toObject();
        newMessageObj.sender = await chatService.getUserDetailsById(
          newMessage?.sender
        );
      }
      // Need to update the latest message of that chat
      await chatRepository.updateLatestMessageOfChat(chatId, newMessage);
      // populate each user of the chat for the emit the socket event for each user to norify that they get message.
      for (let i = 0; i < newMessageObj?.chat?.users?.length; i++) {
        // To populate each user of the chat
        newMessageObj.chat.users[i] = await chatService.getUserDetailsById(
          newMessageObj.chat.users[i]
        );
      }
      return newMessageObj;
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

module.exports = new MessageService();
