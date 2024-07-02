const express = require("express");
const router = express.Router()
const ConversationController = require('../controllers/ConversationController');

router.post("/", ConversationController.createConversation)
router.get("/:userId", ConversationController.getMember)

module.exports = router