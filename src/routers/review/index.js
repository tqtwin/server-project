const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewcontroller');


/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Các endpoint liên quan đến đánh giá
 */

/**
 * @swagger
 * /api/v1/reviews/:
 *   post:
 *     summary: Tạo bài đánh giá mới
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []  # Yêu cầu xác thực JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung của bài viết
 *                 example: "Nội dung của bài đánh giá mới"
 *               imageUrl:
 *                 type: string
 *                 description: Hình ảnh của bài viết
 *                 example: "http://example.com/image.jpg"
 *               rating:
 *                 type: number
 *                 description: Đánh giá của sản phẩm (từ 0 đến 5)
 *                 example: 4.5
 *               productId:
 *                 type: string
 *                 description: ID của sản phẩm
 *                 example: "60d21b4667d0d8992e610c85"
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Bài đánh giá được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ (thiếu dữ liệu hoặc dữ liệu không đúng định dạng)
 *       500:
 *         description: Lỗi máy chủ khi tạo bài viết
 */
router.post('/', reviewController.createReview);

/**
 * @swagger
 * /api/v1/reviews/:
 *   get:
 *     summary: Lấy danh sách các bài đánh giá
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []  # Yêu cầu xác thực JWT
 *     responses:
 *       200:
 *         description: Danh sách các bài đánh giá
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
 *                   content:
 *                     type: string
 *                     example: "Nội dung của bài đánh giá mới"
 *                   rating:
 *                     type: number
 *                     example: 4.5
 *                   imageUrl:
 *                     type: string
 *                     example: "http://example.com/image.jpg"
 *                   productId:
 *                     type: string
 *                     example: "d4121b4667d0d8992e610c85"
 *                   userId:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *       500:
 *         description: Lỗi máy chủ khi lấy danh sách bài đánh giá
 */
router.get('/', reviewController.getListReviews);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Lấy bài đánh giá theo ID
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []  # Yêu cầu xác thực JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của bài đánh giá
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của bài đánh giá
 *       404:
 *         description: Không tìm thấy bài đánh giá
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', reviewController.getReviewById);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Cập nhật bài đánh giá theo ID
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []  # Yêu cầu xác thực JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của bài đánh giá
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung của bài đánh giá
 *                 example: "Nội dung của bài đánh giá cập nhật"
 *               imageUrl:
 *                 type: string
 *                 description: URL hình ảnh mới
 *                 example: "http://example.com/updated-image.jpg"
 *               rating:
 *                 type: number
 *                 description: Đánh giá mới của sản phẩm
 *                 example: 4.0
 *               productId:
 *                 type: string
 *                 description: ID của sản phẩm
 *                 example: "60d21b4667d0d8992e610c85"
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Bài đánh giá đã được cập nhật thành công
 *       404:
 *         description: Không tìm thấy bài đánh giá
 *       500:
 *         description: Lỗi máy chủ khi cập nhật
 */
router.put('/:id', reviewController.updateReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Xóa bài đánh giá theo ID
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []  # Yêu cầu xác thực JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của bài đánh giá
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bài đánh giá đã được xóa thành công
 *       404:
 *         description: Không tìm thấy bài đánh giá
 *       500:
 *         description: Lỗi máy chủ khi xóa bài đánh giá
 */
router.delete('/:id', reviewController.deleteReview);

router.patch('/:id/lock', reviewController.lockReview);

router.post('/:id/reply', reviewController.replyToReview);
module.exports = router;
