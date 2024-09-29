const express = require("express");
const {
  fetchChats,
  getAllSearchedUsers,
  createChat,
} = require("../../controllers/chat-controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth, fetchChats).post(auth, createChat);

router.route("/users").get(auth, getAllSearchedUsers);

module.exports = router;
