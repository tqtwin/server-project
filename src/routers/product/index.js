const express = require('express');
const productController = require('../../controllers/productcontroller');
const { authenticateToken, isAdmin } = require('../../middlewares/auth');
const { Router } = require('express');
const router = express.Router();
router.get('/best-selling', productController.getBestSellingProducts);
router.get('/updaterating', productController.UpdateRating)
router.get('/isDelete', productController.getIsDelete)
router.put('/update-products-sale', productController.updateAllProductsWithSale);
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Các endpoint liên quan đến sản phẩm
 */

/**
 * @swagger
 * /api/v1/products/:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của sản phẩm
 *               price:
 *                 type: number
 *                 description: Giá của sản phẩm
 *               oldPrice:
 *                 type: number
 *                 description: Giá cũ của sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả của sản phẩm
 *               quantity:
 *                 type: number
 *                 description: Số lượng sản phẩm
 *               image:
 *                 type: string
 *                 description: Hình ảnh của sản phẩm
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các hình ảnh khác của sản phẩm
 *               brand:
 *                 type: string
 *                 description: Thương hiệu của sản phẩm
 *               review:
 *                 type: number
 *                 description: Số lượng đánh giá của sản phẩm
 *               category:
 *                 type: string
 *                 description: ID của category
 *               rating:
 *                 type: number
 *                 description: Đánh giá của sản phẩm
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các đánh giá của sản phẩm
 *     responses:
 *       201:
 *         description: Sản phẩm được tạo thành công
 *       500:
 *         description: Lỗi khi tạo sản phẩm
 */

router.post('/',authenticateToken, isAdmin, productController.createProduct);

/**
 * @swagger
 * /api/v1/products/:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm mỗi trang
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tên sản phẩm để tìm kiếm
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category của sản phẩm để tìm kiếm
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu của sản phẩm
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa của sản phẩm
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: |
 *           Sắp xếp theo trường cụ thể
 *           (vd: 'price:asc', 'price:desc', 'created_at:asc', 'created_at:desc')
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *       500:
 *         description: Lỗi khi lấy danh sách sản phẩm
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Lấy thông tin sản phẩm theo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi khi lấy thông tin sản phẩm
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm theo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của sản phẩm
 *               price:
 *                 type: number
 *                 description: Giá của sản phẩm
 *               oldPrice:
 *                 type: number
 *                 description: Giá cũ của sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả của sản phẩm
 *               quantity:
 *                 type: number
 *                 description: Số lượng sản phẩm
 *               image:
 *                 type: string
 *                 description: Hình ảnh của sản phẩm
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các hình ảnh khác của sản phẩm
 *               brand:
 *                 type: string
 *                 description: Thương hiệu của sản phẩm
 *               review:
 *                 type: number
 *                 description: Số lượng đánh giá của sản phẩm
 *               category:
 *                 type: string
 *                 description: ID của category
 *               rating:
 *                 type: number
 *                 description: Đánh giá của sản phẩm
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các đánh giá của sản phẩm
 *     responses:
 *       200:
 *         description: Sản phẩm được cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi khi cập nhật sản phẩm
 */
router.put('/:id',authenticateToken,isAdmin, productController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sản phẩm được xóa thành công
 *       500:
 *         description: Lỗi khi xóa sản phẩm
 */
router.delete('/:id',authenticateToken,isAdmin, productController.deleteProduct);
router.delete('/:id/soft-delete',authenticateToken,isAdmin, productController.softDeleteProduct)
router.put('/:id/restore',authenticateToken,isAdmin, productController.restoreProduct)
router.get('/categories/:categoryId', productController.getProductsByCategory)

module.exports = router;
