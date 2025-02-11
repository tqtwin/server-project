const WarehouseService = require('../services/warehouse.service');

class WarehouseController {
    async createWarehouse(req, res) {
        try {
            const warehouse = await WarehouseService.createWarehouse(req.body);
            return res.status(201).json({ message: 'Warehouse entry created successfully', success: true, data: warehouse });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating warehouse entry', success: false, error: error.message });
        }
    }

    async getWarehouses(req, res) {
        try {
            const { warehouses, total, page, limit } = await WarehouseService.getWarehouses(req.query);
            return res.status(200).json({ success: true, data: warehouses, total, page, limit });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching warehouses', success: false, error: error.message });
        }
    }

    async getWarehouseById(req, res) {
        try {
            const warehouse = await WarehouseService.getWarehouseById(req.params.id);
            if (!warehouse) {
                return res.status(404).json({ message: 'Warehouse entry not found', success: false });
            }
            return res.status(200).json({ success: true, data: warehouse });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching warehouse entry', success: false, error: error.message });
        }
    }

    async updateWarehouse(req, res) {
        try {
            const warehouse = await WarehouseService.updateWarehouse(req.params.id, req.body);
            if (!warehouse) {
                return res.status(404).json({ message: 'Warehouse entry not found', success: false });
            }
            return res.status(200).json({ message: 'Warehouse entry updated successfully', success: true, data: warehouse });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating warehouse entry', success: false, error: error.message });
        }
    }

    async deleteWarehouse(req, res) {
        try {
            const warehouseId = req.params.id;
            const warehouse = await WarehouseService.getWarehouseById(warehouseId);
            if (!warehouse) {
                return res.status(404).json({ message: 'Warehouse entry not found', success: false });
            }
            await WarehouseService.deleteWarehouse(warehouseId);
            return res.status(200).json({ message: 'Warehouse entry deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting warehouse entry', success: false, error: error.message });
        }
    }
}

module.exports = new WarehouseController();
