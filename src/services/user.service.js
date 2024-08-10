const userModel = require('../models/user');
const redisClient = require('../dbs/redis');

class UserService {
    getListUsersWithCache = async (params = {}) => {
        try {
            const users = await redisClient.get('us');
            if (users) {
                return JSON.parse(users);
            }
            return null;
        } catch (error) {
            console.error('Error getting users from cache:', error);
            return null;
        }
    }
    setUsersCache = async (users) => {
        try {
            return await redisClient.set('us', JSON.stringify(users));
        } catch (error) {
            console.error('Error setting users to cache:', error);
        }
    }

    async createUser(data) {
        try {
            const user = await userModel.create(data);
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUsers() {
        try {
            const users = await userModel.find().populate('posts').populate('orders');
            return users;
        } catch (error) {
            throw error;
        }
    }
    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId).populate('posts').populate('orders');
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
