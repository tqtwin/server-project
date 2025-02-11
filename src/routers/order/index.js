const express = require('express');
const orderController = require('../../controllers/ordercontroller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Các endpoint liên quan đến đơn hàng
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID của sản phẩm
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *               statusId:
 *                 type: string
 *                 description: ID trạng thái đơn hàng ban đầu
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *       500:
 *         description: Lỗi khi tạo đơn hàng
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng
 *     tags:
 *       - Orders
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
 *         description: Số lượng đơn hàng mỗi trang
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Trạng thái của đơn hàng
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *       500:
 *         description: Lỗi khi lấy danh sách đơn hàng
 */
router.get('/', orderController.getOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Lấy thông tin đơn hàng theo ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đơn hàng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi khi lấy thông tin đơn hàng
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Cập nhật thông tin đơn hàng theo ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đơn hàng
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Trạng thái của đơn hàng
 *     responses:
 *       200:
 *         description: Đơn hàng được cập nhật thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi khi cập nhật đơn hàng
 */
router.put('/:id', orderController.updateOrder);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Xóa đơn hàng theo ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đơn hàng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đơn hàng được xóa thành công
 *       500:
 *         description: Lỗi khi xóa đơn hàng
 */
router.delete('/:id', orderController.deleteOrder);
router.post('/update-payment-status', orderController.updateOrderPaymentStatus);
router.delete('/', orderController.deleteOrderA)
module.exports = router;
