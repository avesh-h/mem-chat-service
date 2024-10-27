const express = require("express");
const {
  fetchChats,
  getAllSearchedUsers,
  createChat,
  createGroupChat,
  renameGroupChat,
  addMemberInGroup,
  removeMemberFromGroup,
} = require("../../controllers/chat-controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth, fetchChats).post(auth, createChat);

router.route("/users").get(auth, getAllSearchedUsers);

router.post("/group", auth, createGroupChat);

router.put("/rename", auth, renameGroupChat);

router.put("/groupremove", auth, removeMemberFromGroup);

router.put("/groupadd", auth, addMemberInGroup);

module.exports = router;
