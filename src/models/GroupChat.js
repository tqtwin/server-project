// src/models/groupChat.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupChatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Single userId instead of an array
  messages: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      adminId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  adminId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // adminId field
});

module.exports = mongoose.model('GroupChat', groupChatSchema);
