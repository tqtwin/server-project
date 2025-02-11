const roleService = require('../services/role.service');

class RoleController {
    // Get list of all roles
    async getListRoles(req, res) {
        try {
            const roles = await roleService.getRoles();
            return res.status(200).json({ success: true, data: roles });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching roles', success: false, error: error.message });
        }
    }

    // Get role by ID
    async getRoleById(req, res) {
        const roleId = req.params.id;
        try {
            const role = await roleService.getRoleById(roleId);
            if (!role) {
                return res.status(404).json({ message: 'Role not found', success: false });
            }
            return res.status(200).json({ success: true, data: role });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching role', success: false, error: error.message });
        }
    }

    // Create a new role
    async createRole(req, res) {
        try {
            const { description } = req.body;
            const { name } = req.body;
            if (!description || !name) {
                return res.status(400).json({ message: 'Description is required', success: false });
            }

            const newRole = await roleService.createRole({ description ,name});
            return res.status(201).json({ message: 'Role created successfully', success: true, data: newRole });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating role', success: false, error: error.message });
        }
    }

    // Update a role by ID
    async updateRole(req, res) {
        const roleId = req.params.id;
        const { name} = req.body;
        const { description} = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Description is required', success: false });
        }

        try {
            const updatedRole = await roleService.updateRole(roleId, { description });
            return res.status(200).json({ message: 'Role updated successfully', success: true, data: updatedRole });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating role', success: false, error: error.message });
        }
    }

    // Delete a role by ID
    async deleteRole(req, res) {
        const roleId = req.params.id;
        try {
            const deletedRole = await roleService.deleteRole(roleId);
            if (!deletedRole) {
                return res.status(404).json({ message: 'Role not found', success: false });
            }
            return res.status(200).json({ message: 'Role deleted successfully', success: true, data: deletedRole });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting role', success: false, error: error.message });
        }
    }
}

module.exports = new RoleController();
