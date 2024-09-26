const express = require("express");
const { fetchMessages } = require("../../controllers/message-controller");

const router = express.Router();

router.get("/:id", fetchMessages);

module.exports = router;
