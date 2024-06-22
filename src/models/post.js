const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    content: {
        type: String,
        required: [true, 'content is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'imageUrl is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
