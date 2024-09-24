const express = require("express");

const router = express.Router();

const chatRoutes = require("./v1/chat-routes");

router.use("/v1/chat", chatRoutes);

module.exports = router;
