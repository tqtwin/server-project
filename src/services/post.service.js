const postModel = require('../models/post');
const UserModel = require('../models/user')
class PostService {
    async createPost(data) {
        try {
            const post = await postModel.create(data);
            console.log(post);
            const user = await UserModel.findById(data.userId);
            if (user) {
                user.posts.push(post);
                await user.save();
            }
            return post;
        } catch (error) {
            throw error;
        }
    }
    async getPostById(postId) {
        try {
            const post = await postModel.findById(postId).populate('userId');;
            return post;
        } catch (error) {
            throw error;
        }
    }

    async getPosts() {
        try {
            const posts = await postModel.find().populate('userId');
            return posts;
        } catch (error) {
            throw error;
        }
    }
    async updatePost(postId, newData) {
        try {
            const updatedPost = await postModel.findByIdAndUpdate(postId, newData, { new: true });
            return updatedPost;
        } catch (error) {
            throw error;
        }
    }

    async deletePostAndUserUpdate(postId) {
        try {
            const deletedPost = await postModel.findByIdAndDelete(postId);
            const user = await UserModel.findOne({ posts: postId });
            if (user) {
                user.posts.pull(postId);
                await user.save();
            }
            return deletedPost;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostService();
