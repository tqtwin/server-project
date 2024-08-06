const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postcontroller');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Các endpoint liên quan đến bài viết
 */

/**
 * @swagger
 * /api/v1/posts/create-post:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tên của bài viết
 *                 example: "Bài viết mới"
 *               content:
 *                 type: string
 *                 description: Nội dung của bài viết
 *                 example: "Nội dung của bài viết mới"
 *               imageUrl:
 *                 type: string
 *                 description: Hình ảnh của bài viết
 *                 example: "http://example.com/image.jpg"
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Bài viết được tạo thành công
 *       500:
 *         description: Lỗi khi tạo bài viết
 */
router.post('/create-post', postController.createPost);

/**
 * @swagger
 * /api/v1/posts/getlistpost:
 *   get:
 *     summary: Lấy danh sách các bài viết
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Danh sách các bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   title:
 *                     type: string
 *                     example: "Bài viết mới"
 *                   content:
 *                     type: string
 *                     example: "Nội dung của bài viết mới"
 *                   imageUrl:
 *                     type: string
 *                     example: "http://example.com/image.jpg"
 *                   userId:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 */
router.get('/getlistpost', postController.getListPosts);

/**
 * @swagger
 * /api/v1/posts/get-post-by-id/{id}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của bài viết
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin của bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 title:
 *                   type: string
 *                   example: "Bài viết mới"
 *                 content:
 *                   type: string
 *                   example: "Nội dung của bài viết mới"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 userId:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 */
router.get('/get-post-by-id/:id', postController.getPostById);

/**
 * @swagger
 * /api/v1/posts/update-post/{id}:
 *   put:
 *     summary: Cập nhật bài viết theo ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của bài viết
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tên của bài viết
 *                 example: "Bài viết cập nhật"
 *               content:
 *                 type: string
 *                 description: Nội dung của bài viết
 *                 example: "Nội dung của bài viết cập nhật"
 *               imageUrl:
 *                 type: string
 *                 description: Hình ảnh của bài viết
 *                 example: "http://example.com/updated-image.jpg"
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Bài viết được cập nhật thành công
 *       500:
 *         description: Lỗi khi cập nhật bài viết
 */
router.put('/update-post/:id', postController.updatePost);

/**
 * @swagger
 * /api/v1/posts/delete-post/{id}:
 *   delete:
 *     summary: Xóa bài viết theo ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của bài viết
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bài viết được xóa thành công
 *       500:
 *         description: Lỗi khi xóa bài viết
 */
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;
