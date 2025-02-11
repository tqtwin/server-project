const Role = require('../models/role');
const redisClient = require('../dbs/redis');

class RoleService {
    // Get all roles with cache
    async getRoles() {
        try {
            const cacheKey = 'roles:list';
            const cachedRoles = await redisClient.get(cacheKey);

            if (cachedRoles) {
                return JSON.parse(cachedRoles);
            }

            const roles = await Role.find().lean();
            await redisClient.set(cacheKey, JSON.stringify(roles), 'EX', 3600); // Cache for 1 hour
            return roles;
        } catch (error) {
            throw error;
        }
    }

    // Create a new role
    async createRole(data) {
        try {
            const role = await Role.create(data);
            await redisClient.del('roles:list'); // Invalidate roles list cache
            return role;
        } catch (error) {
            throw error;
        }
    }

    // Get role by ID
    async getRoleById(roleId) {
        try {
            const cacheKey = `role:${roleId}`;
            const cachedRole = await redisClient.get(cacheKey);

            if (cachedRole) {
                return JSON.parse(cachedRole);
            }

            const role = await Role.findById(roleId).lean();
            if (!role) {
                throw new Error('Role not found');
            }

            await redisClient.set(cacheKey, JSON.stringify(role), 'EX', 3600); // Cache for 1 hour
            return role;
        } catch (error) {
            throw error;
        }
    }

    // Update a role by ID
    async updateRole(roleId, newData) {
        try {
            const updatedRole = await Role.findByIdAndUpdate(roleId, newData, { new: true });
            await redisClient.del(`role:${roleId}`); // Invalidate specific role cache
            await redisClient.del('roles:list'); // Invalidate roles list cache
            return updatedRole;
        } catch (error) {
            throw error;
        }
    }

    // Delete a role by ID
    async deleteRole(roleId) {
        try {
            const deletedRole = await Role.findByIdAndDelete(roleId);
            await redisClient.del(`role:${roleId}`);
            await redisClient.del('roles:list');
            return deletedRole;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RoleService();
