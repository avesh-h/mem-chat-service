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

module.exports = { fetchMessages };
