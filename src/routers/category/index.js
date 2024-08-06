const express = require('express');
const categoryController = require('../../controllers/categorycontroller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Các endpoint liên quan đến danh mục
 * /api/v1/categories/create-categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Danh mục được tạo thành công
 */
router.post('/create-categories', categoryController.createCategory);

/**
 * @swagger
 * /api/v1/categories/categories:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/categories', categoryController.getCategories);

/**
 * @swagger
 * /api/v1/categories/categories/{id}:
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
router.get('/categories/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /api/v1/categories/categories/{id}:
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
router.put('/categories/:id', categoryController.updateCategory);

/**
 * @swagger
 * /api/v1/categories/categories/{id}:
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
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
