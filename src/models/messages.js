// src/models/Message.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text: { type: String, required: true },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    timestamp: { type: Date, default: Date.now },
    groupId: { type: Schema.Types.ObjectId, ref: 'GroupChat', required: true }, // Có thể là group chat hoặc 1-1
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
