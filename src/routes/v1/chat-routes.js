const express = require("express");
const {
  fetchChats,
  getAllSearchedUsers,
} = require("../../controllers/chat-controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth, fetchChats);

router.route("/users").get(auth, getAllSearchedUsers);

module.exports = router;
