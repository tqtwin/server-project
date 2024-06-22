const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/usercontroller');


// Đăng ký người dùng
router.post('/create', UserController.signup);

// Lấy người dùng theo ID
router.get('/get-user-by-id/:id', UserController.getUserById);

// Đăng nhập
router.post('/login', UserController.login);

router.put('/update/:_id' ,UserController.updateUser)
router.delete('/delete/:id', UserController.deleteUserAndPosts);

module.exports = router;
