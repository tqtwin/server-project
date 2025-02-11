const GroupChat = require('../models/GroupChat');
const mongoose = require('mongoose');

class ChatController {
    constructor() {
        this.createGroupChat = this.createGroupChat.bind(this); // Gắn kết `this`
        this.saveMessage = this.saveMessage.bind(this);         // Gắn kết `this`
    }
    // Hàm tạo nhóm chat
    async createGroupChat(req, res) {
        try {
            const { userId, adminId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: 'userId và name là bắt buộc.' });
            }

            const existingGroupChat = await GroupChat.findOne({ userId });
            if (existingGroupChat) {
                return res.status(200).json(existingGroupChat);
            }

            const newGroupChat = new GroupChat({
                userId,
                adminId,
            });

            const savedGroupChat = await newGroupChat.save();

            // Gửi tin nhắn tự động chào mừng
            const autoMessage = {
                groupId: savedGroupChat._id,
                role: 'auto',
                text: 'Thanh Tân xin kính chào quý khách! Mọi thắc mắc về đơn hàng hay sản phẩm, xin quý khách vui lòng chuyển đến Shop. Shop sẽ cố gắng trả lời quý khách trong thời gian sớm nhất.Để được tư vấn và đặt hàng vui lòng để lại thông tin để shop tư vấn !!',
            };

            await this.saveMessage(autoMessage);

            res.status(201).json(savedGroupChat);
        } catch (error) {
            console.error('Lỗi tạo nhóm chat:', error);
            res.status(500).json({ message: 'Lỗi tạo nhóm chat' });
        }
    }

    // Hàm lưu tin nhắn
    async saveMessage(message) {
        try {
            const { groupId, senderId, role, text } = message;

            if (role !== 'auto') {
                if (!groupId || !senderId || !role || !text) {
                    throw new Error('Thiếu thông tin bắt buộc');
                }
            }

            let userId = null;
            let adminId = null;

            if (role === 'user') {
                userId = new mongoose.Types.ObjectId(senderId);
            } else if (role === 'admin') {
                adminId = new mongoose.Types.ObjectId(senderId);
            }

            const messageObject = {
                userId: role !== 'auto' ? userId : undefined,
                adminId: role !== 'auto' ? adminId : undefined,
                text,
                role,
                timestamp: new Date(),
            };

            const updatedGroupChat = await GroupChat.findByIdAndUpdate(
                groupId,
                { $push: { messages: messageObject } },
                { new: true }
            );

            if (!updatedGroupChat) {
                throw new Error('Không tìm thấy nhóm chat');
            }

            console.log('Message saved successfully:', messageObject);
            return messageObject;
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    }

    // Hàm lấy tất cả GroupChat
    async getAllGroupChats() {
        try {
            // Lấy danh sách tất cả các nhóm chat
            const allGroupChats = await GroupChat.find()
                .populate('userId')
                .populate('adminId'); // Populate userId và adminId để có thêm thông tin

            return allGroupChats;
        } catch (error) {
            console.error('Lỗi lấy danh sách nhóm chat:', error);
            throw new Error('Không thể lấy danh sách nhóm chat');
        }
    }

    // Lấy tin nhắn từ GroupChat
    async getMessages(req, res) {
        try {
            const { groupId } = req.params;

            const groupChat = await GroupChat.findById(groupId);
            if (!groupChat) {
                return res.status(404).json({ message: 'GroupChat không tìm thấy' });
            }

            return res.status(200).json(groupChat.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            return res.status(500).json({ message: 'Error fetching messages' });
        }
    }
}

module.exports = new ChatController();
