const express = require("express");
const {
  fetchMessages,
  sendMessage,
} = require("../../controllers/message-controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

// Message APIS
// FetchMessage[done];
// SendMessage [done]

router.post("/", auth, sendMessage);

router.get("/:id", auth, fetchMessages);

module.exports = router;
