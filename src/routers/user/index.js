const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/usercontroller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Các endpoint liên quan đến người dùng
 */

/**
 * @swagger
 * /api/v1/users/create:
 *   post:
 *     summary: Đăng ký người dùng
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *                 example: "example@example.com"
 *               age:
 *                 type: number
 *                 description: Tuổi người dùng
 *                 example: 25
 *               address:
 *                 type: string
 *                 description: Địa chỉ người dùng
 *                 example: "123 Đường ABC, Quận XYZ"
 *               phone:
 *                 type: string
 *                 description: Số điện thoại người dùng
 *                 example: "0123456789"
 *               status:
 *                 type: string
 *                 description: Trạng thái người dùng
 *                 example: "active"
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *                 example: "password123"
 *               avatar:
 *                 type: string
 *                 description: URL ảnh đại diện người dùng
 *                 example: "http://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/create', UserController.signup);

/**
 * @swagger
 * /api/v1/users/get-user-by-id/{id}:
 *   get:
 *     summary: Lấy người dùng theo ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 name:
 *                   type: string
 *                   example: "Nguyen Van A"
 *                 email:
 *                   type: string
 *                   example: "example@example.com"
 *                 age:
 *                   type: number
 *                   example: 25
 *                 address:
 *                   type: string
 *                   example: "123 Đường ABC, Quận XYZ"
 *                 phone:
 *                   type: string
 *                   example: "0123456789"
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 avatar:
 *                   type: string
 *                   example: "http://example.com/avatar.jpg"
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 */
router.get('/get-user-by-id/:id', UserController.getUserById);

/**
 * @swagger
 * /api/v1/users/get-list-user:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Danh sách người dùng
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
 *                   name:
 *                     type: string
 *                     example: "Nguyen Van A"
 *                   email:
 *                     type: string
 *                     example: "example@example.com"
 *                   age:
 *                     type: number
 *                     example: 25
 *                   address:
 *                     type: string
 *                     example: "123 Đường ABC, Quận XYZ"
 *                   phone:
 *                     type: string
 *                     example: "0123456789"
 *                   status:
 *                     type: string
 *                     example: "active"
 *                   avatar:
 *                     type: string
 *                     example: "http://example.com/avatar.jpg"
 *                   posts:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                   orders:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 */
router.get('/get-list-user', UserController.getListUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/v1/users/update/{id}:
 *   put:
 *     summary: Cập nhật người dùng
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
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
 *                 description: Tên người dùng
 *                 example: "Nguyen Van B"
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *                 example: "example2@example.com"
 *               age:
 *                 type: number
 *                 description: Tuổi người dùng
 *                 example: 26
 *               address:
 *                 type: string
 *                 description: Địa chỉ người dùng
 *                 example: "456 Đường DEF, Quận UVW"
 *               phone:
 *                 type: string
 *                 description: Số điện thoại người dùng
 *                 example: "0987654321"
 *               status:
 *                 type: string
 *                 description: Trạng thái người dùng
 *                 example: "inactive"
 *               avatar:
 *                 type: string
 *                 description: URL ảnh đại diện người dùng
 *                 example: "http://example.com/new-avatar.jpg"
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put('/update/:id', UserController.updateUser);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Xóa người dùng và bài viết của họ
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.delete('/delete/:id', UserController.deleteUserAndPosts);

module.exports = router;
