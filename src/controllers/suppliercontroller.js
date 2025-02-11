const SupplierService = require('../services/supplier.service');

class SupplierController {
    // Tạo mới Supplier
    async createSupplier(req, res) {
        try {
            const supplier = await SupplierService.createSupplier(req.body);
            res.status(201).json(supplier);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy danh sách các Supplier
    async getSuppliers(req, res) {
        try {
            const suppliers = await SupplierService.getSuppliers(req.query);
            res.status(200).json(suppliers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy thông tin Supplier theo ID
    async getSupplierById(req, res) {
        try {
            const supplier = await SupplierService.getSupplierById(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.status(200).json(supplier);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật thông tin Supplier
    async updateSupplier(req, res) {
        try {
            const supplier = await SupplierService.updateSupplier(req.params.id, req.body);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.status(200).json(supplier);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xóa Supplier
    async deleteSupplier(req, res) {
        try {
            const supplier = await SupplierService.deleteSupplier(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.status(200).json({ message: 'Supplier deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SupplierController();
