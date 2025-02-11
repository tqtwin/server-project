const Warehouse = require('../models/warehouse');

class WarehouseService {
    async createWarehouse(data) {
        try {
            const warehouse = await Warehouse.create(data);
            return warehouse;
        } catch (error) {
            throw error;
        }
    }

    async getWarehouses(query) {
        try {
            const { page = 1, limit = 10 } = query;

            const warehouses = await Warehouse.find({})
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await Warehouse.countDocuments({});

            return { warehouses, total, page, limit };
        } catch (error) {
            throw error;
        }
    }

    async getWarehouseById(id) {
        try {
            const warehouse = await Warehouse.findById(id);
            return warehouse;
        } catch (error) {
            throw error;
        }
    }

    async updateWarehouse(id, data) {
        try {
            const warehouse = await Warehouse.findByIdAndUpdate(id, data, { new: true });
            return warehouse;
        } catch (error) {
            throw error;
        }
    }

    async deleteWarehouse(id) {
        try {
            await Warehouse.findByIdAndDelete(id);
            return { message: 'Warehouse entry deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new WarehouseService();
