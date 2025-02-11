const express = require('express');
const router = express.Router();
const SupplierController = require('../../controllers/suppliercontroller');

router.post('/', SupplierController.createSupplier);

router.get('/', SupplierController.getSuppliers);
router.get('/:id', SupplierController.getSupplierById);
// Cập nhật Supplier theo ID
router.put('/:id', SupplierController.updateSupplier);
// Xóa Supplier theo ID
router.delete('/:id', SupplierController.deleteSupplier);

module.exports = router;
