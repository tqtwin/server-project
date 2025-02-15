const express = require('express');
const categoryController = require('../../controllers/categorycontroller');
const { authenticateToken, isAdmin } = require('../../middlewares/auth');
const router = express.Router();
const cs = require('../../services/category.service')
// router.get('/clear/cleanup-categories', async (req, res) => {
//     try {
//         const result = await cs.cleanUpCategoryProducts();
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error cleaning up categories', error: error.message });
//     }
// });

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Các endpoint liên quan đến danh mục
 * /api/v1/categories/:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Danh mục được tạo thành công
 */
router.post('/',authenticateToken,isAdmin, categoryController.createCategory);

/**
 * @swagger
 * /api/v1/categories/:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của danh mục
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Cập nhật thông tin danh mục theo ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh mục được cập nhật thành công
 */
router.put('/:id',authenticateToken,isAdmin, categoryController.updateCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh mục được xóa thành công
 */
router.delete('/:id',authenticateToken,isAdmin, categoryController.deleteCategory);

module.exports = router;
