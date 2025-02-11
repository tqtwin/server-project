const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    birthday: { type: Date ,},
    address: { type: String },
    gender: { type: String },
    phone: { type: String },
    status: { type: String },
    isLock: { type: Boolean, default: false },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    avatar: { type: String },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    news: [{ type: mongoose.Schema.Types.ObjectId, ref: 'New' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    isVerified: { type: Boolean, default: false }, // Trường để xác nhận email
}, { timestamps: false });


const User = mongoose.model('User', userSchema);
module.exports = User;
