const express = require("express");

const router = express.Router();

const chatRoutes = require("./v1/chat-routes");

const messageRoutes = require("./v1/message-routes");

router.use("/v1/chat", chatRoutes);

router.use("/v1/message", messageRoutes);

module.exports = router;
