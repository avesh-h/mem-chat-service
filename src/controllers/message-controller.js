const messageService = require("../services/message-service");
const httpStatusCode = require("../utils/httpStatusCode");

const fetchMessages = async (req, res) => {
  const chatId = req.params.id;
  try {
    const messages = await messageService.fetchMessagesByChatId(chatId);
    return res
      .status(httpStatusCode.OK)
      .json({ data: messages, status: "success" });
  } catch (error) {
    return res
      .status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
        status: "failed",
        error,
      });
  }
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req?.body;
  const senderId = req?.userId;
  try {
    const newMessage = await messageService.sendMessage(
      content,
      chatId,
      senderId
    );
    return res
      .status(httpStatusCode.OK)
      .json({ message: newMessage, status: "success" });
    // After created message make sender populate to get name and pic
  } catch (error) {
    return res
      .status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
        status: "failed",
        error,
      });
  }
};

module.exports = { fetchMessages, sendMessage };
