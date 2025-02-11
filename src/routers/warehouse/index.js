const express = require('express');
const WarehouseController = require('../../controllers/warehousecontroller');

const router = express.Router();

router.post('/', WarehouseController.createWarehouse);
router.get('/', WarehouseController.getWarehouses);
router.get('/:id', WarehouseController.getWarehouseById);
router.put('/:id', WarehouseController.updateWarehouse);
router.delete('/:id', WarehouseController.deleteWarehouse);

module.exports = router;
