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

// API
// create group chat
const createGroupChat = async (req, res) => {
  const userId = req?.userId;
  try {
    const groupChat = await chatService.createChatGroup(req?.body, userId);
    return res
      .status(httpStatusCode.OK)
      .json({ fullGroupChat: groupChat, status: "success" });
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

// rename group group
const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await chatService.renameGroup(chatId, chatName);
    return res
      .status(httpStatusCode.OK)
      .json({ updatedChat, status: "success" });
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

// remove member from group
const removeMemberFromGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    const remove = await chatService.removeOrAddUserInGroup(chatId, userId);
    return res.status(httpStatusCode.OK).json(remove);
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

// add member to group
const addMemberInGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    const added = await chatService.removeOrAddUserInGroup(
      chatId,
      userId,
      true
    );
    return res.status(httpStatusCode.OK).json(added);
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

module.exports = {
  fetchChats,
  getAllSearchedUsers,
  createChat,
  createGroupChat,
  renameGroupChat,
  removeMemberFromGroup,
  addMemberInGroup,
};
