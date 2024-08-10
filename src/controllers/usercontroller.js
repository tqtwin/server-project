const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const userService = require('../services/user.service');
const PostService = require('../services/post.service')
class UserController {
    // Hàm đăng ký
    async signup(req, res) {
        try {
            const { name, age, avatar, password, email, phone, address } = req.body;

            // Kiểm tra email đã tồn tại
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists', success: false });
            }

            // Mã hóa mật khẩu và tạo người dùng mới
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({ name, age, avatar, password: hashedPassword, email, phone, address });

            await user.save();

            return res.status(201).json({ message: 'User created successfully', success: true });
        } catch (error) {
            console.error('Error adding user:', error);

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.keys(error.errors).map(key => error.errors[key].message);
                return res.status(400).json({ message: errors.join(', '), success: false });
            }

            return res.status(500).json({ message: 'Error adding user', success: false });
        }
    }
    async getListUser(req, res) {
        try {
            // const users = await userService.getListUsersWithCache();
            // if (users) {
            //     return res.json({ success: true, data: users });
            // }
            const usersData = await userService.getUsers();
            // await userService.setUsersCache(usersData);
            return res.status(200).json({ success: true, data: usersData });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching users', success: false, error: error.message });
        }
    }
    // Hàm lấy người dùng theo ID
    async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    // Hàm đăng nhập
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        try {
            const user = await userModel.findOne({ email: email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            return res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const userId = req.params._id;
            const { name, age, avatar, password, email, phone, address } = req.body;
            let missingFields = [];
            if (!name) missingFields.push('name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            const newData = { name, age, avatar, password, email, phone, address };

            const updatedUser = await userService.updateUser(userId, newData);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
    async deleteUserAndPosts(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Xóa tất cả các bài post của người dùng
            if (user.posts && user.posts.length > 0) {
                await Promise.all(user.posts.map(async postId => {
                    await PostService.deletePostAndUserUpdate(postId);
                }));
            }

            // Xóa người dùng
            const deletedUser = await userService.deleteUser(userId);
            return res.status(200).json(deletedUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting user and posts', error: error.message });
        }
    }


}

module.exports = new UserController();
