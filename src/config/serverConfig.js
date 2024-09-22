require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  CHAT_SERVICE_URL: process.env.CHAT_SERVICE_URL,
  MAIL_SERVICE_URL: process.env.MAIL_SERVICE_URL,
  POST_SERVICE_URL: process.env.POST_SERVICE_URL,
};
