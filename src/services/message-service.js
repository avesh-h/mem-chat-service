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
}

module.exports = new MessageService();
