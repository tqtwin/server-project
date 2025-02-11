const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/rolecontroller');

// Get all roles
router.get('/', roleController.getListRoles);

// Get role by ID
router.get('/:id', roleController.getRoleById);

// Create a new role
router.post('/', roleController.createRole);

// Update role by ID
router.put('/:id', roleController.updateRole);

// Delete role by ID
router.delete('/:id', roleController.deleteRole);

module.exports = router;
