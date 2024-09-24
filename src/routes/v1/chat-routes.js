const express = require("express");
const { fetchChats } = require("../../controllers/chat-controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth, fetchChats);

module.exports = router;
