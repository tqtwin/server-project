const userModel = require('../models/user');

class UserService {
    async createUser(data) {
        try {
            const user = await userModel.create(data);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId).populate('posts');
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, newData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(userId, newData, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(userId);
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
