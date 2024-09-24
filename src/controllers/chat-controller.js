const chatService = require("../services/chat-service");
const httpStatusCode = require("../utils/httpStatusCode");

const fetchChats = async (req, res) => {
  const userId = req?.userId;
  try {
    const chats = await chatService.getChatsOfUser(userId);
    return res.status(httpStatusCode.OK).json(chats);
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      status: "failed",
      error,
    });
  }
};

module.exports = { fetchChats };
