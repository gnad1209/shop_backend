const express = require('express')
const router = express.Router()
const MessagesController = require('../controllers/MessagesController')

router.post("/", MessagesController.sendMess)
router.get("/:conversationId", MessagesController.getMess)

module.exports = router