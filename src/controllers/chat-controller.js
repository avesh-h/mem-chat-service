const chatService = require("../services/chat-service");
const httpStatusCode = require("../utils/httpStatusCode");

const fetchChats = async (req, res) => {
  const userId = req?.userId;
  try {
    const chats = await chatService.getChatsOfUser(userId);
    return res.status(httpStatusCode.OK).json(chats);
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

const getAllSearchedUsers = async (req, res) => {
  const keyWords = req?.query?.search;
  const userId = req?.userId;
  try {
    const users = await chatService.getUsersBySearch(keyWords, userId);
    return res.status(httpStatusCode.OK).json({ users, status: "successs" });
  } catch (error) {
    res.status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "failed",
      error,
    });
  }
};

module.exports = { fetchChats, getAllSearchedUsers };
