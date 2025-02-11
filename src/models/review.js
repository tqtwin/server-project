const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type: String,
    },
    imageUrls:[ {
        type: Array,
    }],
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 0,
        max: 5,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'deleted'],
        default: 'pending',
    },
    isLocked:{
        type:Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    repcmt:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Middleware to update `updated_at` before saving
postSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Review = mongoose.model('Review', postSchema);
module.exports = Review;
