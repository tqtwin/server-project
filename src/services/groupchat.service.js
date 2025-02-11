// src/services/groupChat.service.js

const GroupChat = require('../models/GroupChat');

class GroupChatService {
    // Lưu tin nhắn vào group chat
    async addMessageToGroupChat(groupId, userId, adminId, text) {
        try {
            const groupChat = await GroupChat.findById(groupId);
            if (!groupChat) {
                throw new Error('Group chat not found');
            }

            const newMessage = {
                userId,
                adminId,
                text,
                timestamp: new Date(),
            };

            groupChat.messages.push(newMessage); // Thêm tin nhắn vào mảng messages
            await groupChat.save();
            return groupChat; // Trả về group chat đã được cập nhật
        } catch (error) {
            throw new Error('Error saving message: ' + error.message);
        }
    }

    // Lấy tất cả tin nhắn của một group chat
    async getMessages(groupId) {
        try {
            const groupChat = await GroupChat.findById(groupId).populate('messages.userId').populate('messages.adminId');
            if (!groupChat) {
                throw new Error('Group chat not found');
            }
            return groupChat.messages;
        } catch (error) {
            throw new Error('Error fetching messages: ' + error.message);
        }
    }
}

module.exports = new GroupChatService();
