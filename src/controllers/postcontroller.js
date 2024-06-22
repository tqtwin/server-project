const PostService = require('../services/post.service');
//import mongoseee
const mongoose = require('mongoose');
const userModel = require('../models/user')
class PostController {
    async createPost(req, res) {
        const body = req.body;
        const { userId } = body;

        try {
            const userDetail = await userModel.findById(userId);
            if (!userDetail) {
                return res.status(404).json({ message: "User not found" });
            }
            const post = {
                title: body.title,
                content: body.content,
                imageUrl: body.imageUrl,
                userId: new mongoose.Types.ObjectId(userId)
            };
            const createdPost = await PostService.createPost(post);
            res.status(201).json(createdPost);
        } catch (error) {
            res.status(500).json({ message: 'Error creating post', error: error.message });
        }
    }
    // async getPostById(req, res) {
    //     try {
    //         const postId = req.params.id;
    //         const post = await PostService.getPostById(postId);
    //         if (!post) {
    //             res.status(404).json({ message: 'Post not found' });
    //         } else {
    //             res.status(200).json(post);
    //         }
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error fetching post', error: error.message });
    //     }
    // }
    async getPostById(req, res) {
        const postId = req.params.id;
        try {
            const post = await PostService.getPostById(postId);
            if (!post) {
                return res.status(404).send({ message: 'post not found' });
            }
            return res.status(200).send(post);
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async updatePost(req, res) {
        try {
            const postId = req.params.id;
            const { title, content, imageUrl, userId } = req.body;
            let missingFields = [];
            if (!title) missingFields.push('title');
            if (!content) missingFields.push('content');
            if (!userId) missingFields.push('userId');

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            }
            const userDetail = await userModel.findById(userId);
            if (!userDetail) {
                return res.status(404).json({ message: "User not found" });
            }

            const newData = { title, content, imageUrl, userId: new mongoose.Types.ObjectId(userId) };

            const updatedPost = await PostService.updatePost(postId, newData);
            res.status(200).json(updatedPost);
        } catch (error) {
            res.status(500).json({ message: 'Error updating post', error: error.message });
        }
    }


    async deletePost(req, res) {
        try {
            const postId = req.params.id;
            const deletedPost = await PostService.deletePostAndUserUpdate(postId);
            res.status(200).json(deletedPost);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting post', error: error.message });
        }
    }

}

module.exports = new PostController();
