const bcrypt = require('bcryptjs');
const userService = require('../services/user.service');
const postService = require('../services/review.service');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('478853764334-anrujr0ho33g1ghavi6c8m7vcu5aiuu7.apps.googleusercontent.com');
const crypto = require('crypto');
const { sendVerificationEmail ,sendPasswordResetEmail } = require('../services/email.service'); // Make sure the import matches
const redisClient = require('../dbs/redis'); // Import the Redis client
const { messaging } = require('firebase-admin');
class UserController {
    async googleLogin(req, res) {
        const { tokenId } = req.body;
        try {
            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: '478853764334-anrujr0ho33g1ghavi6c8m7vcu5aiuu7.apps.googleusercontent.com',
            });

            const payload = ticket.getPayload();
            let user = await userService.getUserByEmail(payload.email);

            if (user) {
                if (!user.isLock) {
                    return res.status(403).json({
                        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
                        success: false
                    });
                }
            } else {
                const role = await Role.findOne({ name: 'user' });
                if (!role) {
                    return res.status(400).json({ message: 'Role not found', success: false });
                }

                user = new User({
                    name: payload.name,
                    email: payload.email,
                    avatar: payload.picture,
                    status: 'active',
                    roleId: role._id
                });

                await user.save();
            }

            const token = jwt.sign(
                { id: user._id, role: user.roleId.name, status: user.status },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    status: user.status,
                    role: user.roleId.name
                }
            });

        } catch (error) {
            console.error('Google login error:', error);
            return res.status(500).json({ message: 'Google login failed', success: false });
        }
    }


    // User signup
    async signup(req, res) {
        try {
          const { name, email, password, birthday, address, gender, phone, status, avatar, roleId } = req.body;

          // Kiểm tra email đã tồn tại chưa
          const existingUser = await userService.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại', success: false });
          }

          // Kiểm tra số điện thoại đã tồn tại chưa
          const existingUserByPhone = await userService.getUserByPhone(phone);
          if (existingUserByPhone) {
            return res.status(400).json({ message: 'Số điện thoại đã tồn tại.', success: false });
          }

          let role;
          // Ưu tiên tìm role bằng _id nếu có
          if (roleId && roleId._id) {
            role = await Role.findById(roleId._id);
          }

          // Nếu không tìm thấy role bằng _id, tìm theo name
          if (!role && roleId && roleId.name) {
            role = await Role.findOne({ name: new RegExp(`^${roleId.name}$`, 'i') });
          }

          // Nếu vẫn không tìm thấy role, gán role mặc định là "user"
          if (!role) {
            role = await Role.findOne({ name: 'user' });
            if (!role) {
              return res.status(500).json({ message: 'Default user role not found.', success: false });
            }
          }
          // Kiểm tra role nếu là admin, personnel, hoặc warehouse
          if (["admin", "personnel", "warehouse"].includes(role.name.toLowerCase())) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const defaultAvatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBg0NBwgREBAJDQoNCwoKDRUIEQ8KFxEiFhURExMYKCgsGBolGxMTITEhJSk3Oi4uFx8zOD8sNygtLisBCgoKDQ0NDg0NDi0dHxkrKysrKystKysrKysrLS0rKysrKystKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAM0A0QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgUBBAYDB//EADQQAQACAgECAgcHAwUBAAAAAAABAgMRBAUhMUESIjJRcXKRFUJTYZKisTShwRMzUoHhJP/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/APoGLFjw4q0w1itcda1rSsejEVjyTBpkAAAAAAAAAAAAAAAAAAAAAAAAAFABAAAAAAAAAAAAAAAAAAAAAAAAAAUAEAAAAAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAA8QGxg4XJz+xTt/yt6sLHp3Ta1iL543M94pPhC0iIiO0JauKanRrzHr5Ij4R6SU9F7ds/wC3/wBW4auKHL0rkUj1NW/KJ7tK+O+O2r11MeUurePI42LkV1kj4W84NTHMDY5nFtxcup8J71t74a6oAAAAAAAAACgAgAAAAAA3+k8aM2f0rx2p3+Nmg6HpWOMfDr29vvKUjcARoAAABr87jxyMExMd4jdZ/NzUxMT38uzrXOdTxxj5ltR7XeFiVqgKgAAAAAAAKACAAAAAADqcFYrirEeUVhyzq6Tuka90JViQCKAAAAKXrldZaT762j6LpT9en18f5Rf/AAsSqoBUAAAAAAABQAQAAAAAAdNwrxk4tJ99e7mVv0Xkbiccz4d6pVi2ARQAAABRdayelytR9yP3LrLeuPHNreFYmZcxnyWy5bWn707WJUAFQAAAAAAAFABAAAAAABLFkthyRak96ztEB03E5FOTii1Z+aPdL3cvxuRk42T0sc/GPKarvi9RwZ49afRn3W9WEsWVuhExMdhFCfB55c2LDG8l4j4yqOd1OckTXB2jwm3nKjPVuZF5/wBPHPaJ9aY85VgKyAAAAAAAAACgAgAAAAAAPbFxORm/28c/HybVOkcifamI/cauK8Wn2Nf8aPpJ9i3/ABo/SbDFfTkZqexkmPhKc8zlTHfNb6t37Fv+NH6T7Fv+NH6U2HVZa1rT60/VhafYt/xo/SfYt/xo/SuwVYs56NliO2SPp6Lwy9N5WOO1d/L6xpjTEr0vSdXrrXlKIgAAAAAAAKACAAANrgcO3Kyd/Zr7Ug8+LxMvJtqkdvO0+ELrjdNwYe8x6Ux528G1ix0xU9HHGohNLVw1qOwCKAAAAAAAA882HHmrrJTfxVPM6Vakelx53Ed5pPiuhdHJTExPePDxiRe9Q4Fc9ZtjjVo+kqK0TWdTHeO0xKy6yAAAAACgAgAD04+G2fLFax4z3/KrpcGKuHHFaR7MfVXdGwxXHOSY729WPlWe0qxLZtHZtFZ2bY2bBI2js2CWzaOzYJbNo7Ngls2js2DO2do7NgltU9Y4ka/1aR88R/K02jetb0mLR2tFon4LODlh6cnFOHPas/dn9rzVkAAAFABAiNz2Hpxo3npE+dqx/cHQ8ekY8Nax92unojvszuUVkY2xsEhHZsEhHZsEhjZsGRHZsEhHbOwZEdmwSGNsbBU9ax6zVtH362if+lcuOsxE4Kz7p1/ZTrEAAABQAQevE/qsfz0/l5PTi/1NPmr/ACDotm0RFS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAafV5/8Alj56/wASp1v1b+nj5q/5VCxAAAAXH//Z";
            const finalAvatar = avatar || defaultAvatar;

            const newUser = await userService.createUser({
              name,
              email,
              password: hashedPassword,
              birthday,
              address,
              gender,
              phone,
              status,
              avatar: finalAvatar,
              roleId: role._id
            });

            return res.status(201).json({ message: 'Đăng ký tài khoản thành công.', success: true, user: newUser });
          }

          // Nếu role không phải admin/personnel/warehouse, tiếp tục quy trình xác thực email
          const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
          const hashedPassword = await bcrypt.hash(password, 10);
          const defaultAvatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBg0NBwgREBAJDQoNCwoKDRUIEQ8KFxEiFhURExMYKCgsGBolGxMTITEhJSk3Oi4uFx8zOD8sNygtLisBCgoKDQ0NDg0NDi0dHxkrKysrKystKysrKysrLS0rKysrKystKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAM0A0QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgUBBAYDB//EADQQAQACAgECAgcHAwUBAAAAAAABAgMRBAUhMUESIjJRcXKRFUJTYZKisTShwRMzUoHhJP/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/APoGLFjw4q0w1itcda1rSsejEVjyTBpkAAAAAAAAAAAAAAAAAAAAAAAAAFABAAAAAAAAAAAAAAAAAAAAAAAAAAUAEAAAAAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAA8QGxg4XJz+xTt/yt6sLHp3Ta1iL543M94pPhC0iIiO0JauKanRrzHr5Ij4R6SU9F7ds/wC3/wBW4auKHL0rkUj1NW/KJ7tK+O+O2r11MeUurePI42LkV1kj4W84NTHMDY5nFtxcup8J71t74a6oAAAAAAAAACgAgAAAAAA3+k8aM2f0rx2p3+Nmg6HpWOMfDr29vvKUjcARoAAABr87jxyMExMd4jdZ/NzUxMT38uzrXOdTxxj5ltR7XeFiVqgKgAAAAAAAKACAAAAAADqcFYrirEeUVhyzq6Tuka90JViQCKAAAAKXrldZaT762j6LpT9en18f5Rf/AAsSqoBUAAAAAAABQAQAAAAAAdNwrxk4tJ99e7mVv0Xkbiccz4d6pVi2ARQAAABRdayelytR9yP3LrLeuPHNreFYmZcxnyWy5bWn707WJUAFQAAAAAAAFABAAAAAABLFkthyRak96ztEB03E5FOTii1Z+aPdL3cvxuRk42T0sc/GPKarvi9RwZ49afRn3W9WEsWVuhExMdhFCfB55c2LDG8l4j4yqOd1OckTXB2jwm3nKjPVuZF5/wBPHPaJ9aY85VgKyAAAAAAAAACgAgAAAAAAPbFxORm/28c/HybVOkcifamI/cauK8Wn2Nf8aPpJ9i3/ABo/SbDFfTkZqexkmPhKc8zlTHfNb6t37Fv+NH6T7Fv+NH6U2HVZa1rT60/VhafYt/xo/SfYt/xo/SuwVYs56NliO2SPp6Lwy9N5WOO1d/L6xpjTEr0vSdXrrXlKIgAAAAAAAKACAAANrgcO3Kyd/Zr7Ug8+LxMvJtqkdvO0+ELrjdNwYe8x6Ux528G1ix0xU9HHGohNLVw1qOwCKAAAAAAAA882HHmrrJTfxVPM6Vakelx53Ed5pPiuhdHJTExPePDxiRe9Q4Fc9ZtjjVo+kqK0TWdTHeO0xKy6yAAAAACgAgAD04+G2fLFax4z3/KrpcGKuHHFaR7MfVXdGwxXHOSY729WPlWe0qxLZtHZtFZ2bY2bBI2js2CWzaOzYJbNo7Ngls2js2DO2do7NgltU9Y4ka/1aR88R/K02jetb0mLR2tFon4LODlh6cnFOHPas/dn9rzVkAAAFABAiNz2Hpxo3npE+dqx/cHQ8ekY8Nax92unojvszuUVkY2xsEhHZsEhHZsEhjZsGRHZsEhHbOwZEdmwSGNsbBU9ax6zVtH362if+lcuOsxE4Kz7p1/ZTrEAAABQAQevE/qsfz0/l5PTi/1NPmr/ACDotm0RFS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAafV5/8Alj56/wASp1v1b+nj5q/5VCxAAAAXH//Z";
          const finalAvatar = avatar || defaultAvatar;

          await redisClient.set(`pendingUser:${email}`, JSON.stringify({
            name,
            email,
            birthday,
            address,
            gender,
            phone,
            status,
            avatar: finalAvatar,
            password: hashedPassword,
            verificationCode,
            roleId: role._id
          }), 'EX', 900);

          await sendVerificationEmail(email, verificationCode);

          return res.status(201).json({ message: 'Đăng ký tài khoản thành công. Mã xác nhận đã được gửi tới email.', success: true });

        } catch (error) {
          console.error('Error during signup:', error);
          return res.status(500).json({ message: 'Error during signup', success: false, error: error.message });
        }
      }




    // User verify code
    async verifyCode(req, res) {
        try {
            const { email, code } = req.body;

            // Get user data from Redis
            const userDataString = await redisClient.get(`pendingUser:${email}`);
            if (!userDataString) {
                return res.status(400).json({ message: 'No pending registration found', success: false });
            }

            const userData = JSON.parse(userDataString);

            // Check if the user is already verified
            if (userData.isVerified) {
                return res.status(400).json({ message: 'User is already verified', success: false });
            }

            // Check verification code
            if (userData.verificationCode !== code) {
                return res.status(400).json({ message: 'Invalid verification code', success: false });
            }

            // Create the user object
            const newUser = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                birthday: userData.birthday, // Thêm các trường cần thiết
                address: userData.address,
                gender: userData.gender,
                phone: userData.phone,
                status: userData.status,
                roleId: userData.roleId, // Sử dụng roleId từ Redis
                avatar: userData.avatar,
                isVerified: true // Mark as verified
            });

            // Save user to the database
            await newUser.save();

            // Remove the temporary data in Redis
            await redisClient.del(`pendingUser:${email}`);

            return res.status(201).json({ message: 'User verified and created successfully', success: true, data: newUser });
        } catch (error) {
            console.error('Error verifying user:', error);
            return res.status(500).json({ message: 'Error verifying user', success: false, error: error.message });
        }
    }


    // Get list of users
    async getListUser(req, res) {
        try {
         const {usersData,page, limit, role } = await userService.getUsers(req.query);
            return res.status(200).json({ success: true, data: usersData ,page, limit, role });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Error fetching users', success: false, error: error.message });
        }
    }

    // Get user by ID
    async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found', success: false });
            }
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Error fetching user', success: false, error: error.message });
        }
    }
    async getUserByEmail(req, res) {
        const email = req.params.email;
        try {
            const user = await userService.getUserByEmail(email)
            if (!user) {
                return res.status(404).json({ message: 'User not found', success: false });
            }
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Error fetching user', success: false, error: error.message });
        }
    }
    async verifyCodePassword(req, res) {
        try {
            const { email, code } = req.body;

            // Kiểm tra xem mã xác minh có tồn tại trong Redis không
            const storedCode = await redisClient.get(`resetCode:${email}`);
            if (!storedCode) {
                return res.status(400).json({ message: 'Mã xác minh đã hết hạn hoặc không hợp lệ', success: false });
            }

            // Kiểm tra mã xác minh người dùng nhập vào có đúng không
            if (storedCode !== code) {
                return res.status(400).json({ message: 'Mã xác minh không đúng', success: false });
            }

            // Nếu mã xác minh đúng
            return res.status(200).json({ message: 'Mã xác minh đúng', success: true });
        } catch (error) {
            console.error('Lỗi khi xác minh mã xác thực:', error);
            return res.status(500).json({ message: 'Lỗi khi xác minh mã xác thực', success: false });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác', success: false });
        }

        try {
            const user = await User.findOne({ email }).populate('roleId');
            if (!user) {
                return res.status(404).json({ message: 'Email hoặc mật khẩu không chính xác', success: false });
            }
            // Kiểm tra nếu tài khoản được tạo qua Google OAuth
            if (!user.password) {
                return res.status(400).json({
                    message: 'Email đã được đăng nhập bằng google vui vòng đăng nhập bằng google và đặt mật khẩu.',
                    success: false
                });
            }
            // So sánh mật khẩu nếu tài khoản có mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác', success: false });
            }
            if (user.isLock) {
                return res.status(403).json({
                    message: 'Tài khoản của bạn đã bị khóa.',
                    success: false
                });
            }
            const role = user.roleId.name;
            const token = jwt.sign(
                { id: user._id, role, status: user.status , name: user.name,},
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                success: true,
                token,
                role,
                status: user.status,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    birthday: user.birthday,
                    address: user.address,
                    avatar: user.avatar,
                    role: user.roleId.name
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Server error during login', success: false });
        }
    }

    // Update user
    async updateUser(req, res) {
        const userId = req.params.id;
        const { name, age, avatar, email, phone, address, birthday, gender, roleId, isLock } = req.body;
        try {
            // Prepare user data for update
            const updateData = {};

            if (name) updateData.name = name;
            if (age) updateData.age = age;
            if (avatar) updateData.avatar = avatar;
            if (address) updateData.address = address;

            if (email) {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Invalid email format', success: false });
                }
                updateData.email = email;
            }

            if (phone) updateData.phone = phone;
            if (roleId) updateData.roleId = roleId;

            // Validate and add birthday
            if (birthday) {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Check YYYY-MM-DD format
                const date = new Date(birthday);
                const today = new Date();

                if (!dateRegex.test(birthday) || date > today) {
                    return res.status(400).json({ message: 'Invalid birthday format or date cannot be in the future', success: false });
                }
                updateData.birthday = birthday;
            }

            // Validate and add gender
            if (gender) {
                const validGenders = ['male', 'female', 'other'];
                if (!validGenders.includes(gender.toLowerCase())) {
                    return res.status(400).json({ message: 'Invalid gender value', success: false });
                }
                updateData.gender = gender;
            }

            // Handle isLock update
            if (typeof isLock !== 'undefined') {
                updateData.isLock = isLock;
            }

            // Check if there's any field to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: 'No fields to update', success: false });
            }

            // Call the service to update user
            const updatedUser = await userService.updateUser(userId, updateData);

            return res.status(200).json({ message: 'User updated successfully', success: true, data: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Error updating user', success: false, error: error.message });
        }
    }


// Reset password

    // Delete user and associated posts
    async deleteUserAndPosts(req, res) {
        const userId = req.params.id;
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            // Delete all posts associated with the user
            if (user.posts && user.posts.length > 0) {
                await Promise.all(user.posts.map(async postId => {
                    await postService.deletePostAndUserUpdate(postId);
                }));
            }

            // Delete the user
            const deletedUser = await userService.deleteUser(userId);
            return res.status(200).json({ message: 'User and associated posts deleted successfully', success: true, data: deletedUser });
        } catch (error) {
            console.error('Error deleting user and posts:', error);
            return res.status(500).json({ message: 'Error deleting user and posts', success: false, error: error.message });
        }
    }
    // Forgot password
    async resetPassword(req, res) {
        try {
            const { email, newPassword } = req.body;

            // Validate if the new password exists and is valid
            if (!newPassword || newPassword.trim() === '') {
                return res.status(400).json({ message: 'New password is required', success: false });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true } // Return the updated user
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            // Delete the reset code from Redis
            await redisClient.del(`resetCode:${email}`);

            return res.status(200).json({ message: 'Password reset successfully', success: true });
        } catch (error) {
            console.error('Error during password reset:', error);
            return res.status(500).json({ message: 'Server error during password reset', success: false, error: error.message });
        }
    }

    // Forgot password (already existing logic)
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Check if the email exists
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Email not found', success: false });
            }

            // Create a reset code (6 digits)
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Save the reset code to Redis (expires in 15 minutes)
            await redisClient.set(`resetCode:${email}`, resetCode, 'EX', 15 * 60);

            // Send password reset code via email
            await sendPasswordResetEmail(email, resetCode); // Call function to send the reset email

            return res.status(200).json({
                message: 'Reset password code sent successfully',
                success: true,
            });
        } catch (error) {
            console.error('Error in forgot password:', error);
            return res.status(500).json({ message: 'Server error during forgot password', success: false });
        }
    }
// Change password
async changePassword(req, res) {
    try {
        const userId = req.params.id;
        const {newPassword} = req.body;

        // Kiểm tra thông tin đầu vào
        if (!userId || !newPassword) {
            return res.status(400).json({
                message: 'User ID và mật khẩu mới là bắt buộc',
                success: false
            });
        }

        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng',
                success: false
            });
        }

        // Kiểm tra độ dài mật khẩu mới (nếu cần)
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Mật khẩu mới phải ít nhất 6 ký tự',
                success: false
            });
        }

        // Băm mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        user.password = hashedNewPassword;

        await user.save();

        return res.status(200).json({
            message: 'Đổi mật khẩu thành công',
            success: true
        });
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ khi đổi mật khẩu',
            success: false
        });
    }
}

// Verify password
async verifyPassword(req, res) {
    try {
        const { userId, password } = req.body;

        // Validate the input
        if (!userId || !password) {
            return res.status(400).json({ message: 'User ID and password are required', success: false });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Compare the provided password with the stored password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password', success: false });
        }

        // If password matches, return success
        return res.status(200).json({
            message: 'Password is correct',
            success: true
        });
    } catch (error) {
        console.error('Error verifying password:', error);
        return res.status(500).json({ message: 'Server error during password verification', success: false, error: error.message });
    }
}

}

module.exports = new UserController();
