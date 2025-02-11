const express = require('express');
const router = express.Router();
const ChatController = require('../../controllers/chatcontroller');

// Tạo nhóm chat mới
router.post('/', ChatController.createGroupChat);

// Lấy tin nhắn của nhóm chat
router.get('/:groupId/messages', ChatController.getMessages);

module.exports = router;
