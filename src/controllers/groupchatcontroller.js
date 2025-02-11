const GroupChatService = require('../services/groupchat.service');
const GroupChat = require('../models/GroupChat')
class GroupChatController {
    // Xử lý gửi tin nhắn vào group chat
    async sendMessage(req, res) {
        const { groupId, userId, adminId, text } = req.body;
        try {
            const groupChat = await GroupChatService.addMessageToGroupChat(groupId, userId, adminId, text);
            return res.status(200).json({
                message: 'Message sent successfully',
                success: true,
                data: groupChat.messages[groupChat.messages.length - 1],
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error sending message',
                success: false,
                error: error.message,
            });
        }
    }

    // Xử lý lấy tất cả tin nhắn của group chat
    async getMessages(req, res) {
        const { groupId } = req.params;
        try {
            const messages = await GroupChatService.getMessages(groupId);
            return res.status(200).json({ success: true, data: messages });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching messages',
                success: false,
                error: error.message,
            });
        }
    }

}

module.exports = new GroupChatController();
