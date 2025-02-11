const userModel = require('../models/user');
const roleModel = require('../models/role')
class UserService {
    // Get all users
    async getUsers(query) {
        try {
            // Base query
            const searchQuery = {};
            const { page = 1, limit = 10, role } = query;
            // Adjust the query based on the role
            if (role === 'admin') {
               // Tìm các _id của role `admin`, `employee`, và `warehouse`
            const roles = await roleModel.find({ name: { $in: ['admin', 'employee', 'warehouse'] } }).select('_id');
            const roleIds = roles.map(roleDoc => roleDoc._id);
            searchQuery['roleId'] = { $in: roleIds };
            } else if (role === 'user') {
                const userRole = await roleModel.findOne({ name: 'user' }).select('_id');
                if (userRole) {
                    searchQuery['roleId'] = userRole._id;
                }
            }
            // Fetch users from the database with pagination and filtering
            const usersFromDb = await userModel
                .find(searchQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()
                .populate('reviews')
                .populate('orders')
                .populate({ path: 'roleId', select: 'name' });

            // Count total users to calculate pagination
            const totalUsers = await userModel.countDocuments(searchQuery);

            return { usersData: usersFromDb, total: totalUsers, page, limit, role };
        } catch (error) {
            throw error;
        }
    }

    async getListUsers() {
        try {
            // Fetch all users from the database
            const users = await userModel.find().populate('reviews').populate('orders');
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Create a new user
    async createUser(data) {
        try {
            const user = await userModel.create(data);
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Get a user by ID
    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId).lean().populate('reviews').populate('orders');
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            // Use findOne to find user by email
            const user = await userModel.findOne({ email }).populate('reviews').populate('orders');

            if (!user) {
                return null; // Return null if user not found
            }

            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUserByPhone(phone) {
        try {
            // Use findOne to find user by email
            const user = await userModel.findOne({ phone }).populate('reviews').populate('orders');

            if (!user) {
                return null; // Return null if user not found
            }

            return user;
        } catch (error) {
            throw error;
        }
    }
    // Update a user by ID
    async updateUser(userId, newData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(userId, newData, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    // Delete a user by ID
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
