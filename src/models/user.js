const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: emailValidator,
            message: 'Please fill a valid email address'
        }
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
    }],
    status: {
        type: String,
        required: true,
        default: 'active'
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    avatar: {
        type: String,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
