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

const createChat = async (req, res) => {
  const { userId: selectedChatUserId } = req?.body;
  const userId = req?.userId;
  try {
    // i'll find is it previous chat with this user.
    const chat = await chatService.createChat(selectedChatUserId, userId);
    return res.status(httpStatusCode.OK).json({ chat, status: "success" });
  } catch (error) {
    res.status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "failed",
      error,
    });
  }
};

module.exports = { fetchChats, getAllSearchedUsers, createChat };
