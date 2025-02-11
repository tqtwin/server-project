const Supplier = require('../models/supplier');

class SupplierService {
    // Tạo mới Supplier
    async createSupplier(data) {
        try {
            const supplier = new Supplier(data);
            await supplier.save();
            return supplier;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách tất cả Supplier
    async getSuppliers(query) {
        try {
            const { page = 1, limit = 10, name } = query;
            const searchQuery = {};

            if (name) {
                searchQuery.name = { $regex: name, $options: 'i' }; // Tìm theo tên, không phân biệt hoa thường
            }

            const suppliers = await Supplier.find(searchQuery)
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await Supplier.countDocuments(searchQuery);

            return { suppliers, total, page, limit };
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin Supplier theo ID
    async getSupplierById(id) {
        try {
            const supplier = await Supplier.findById(id);
            if (!supplier) throw new Error('Supplier not found');
            return supplier;
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật thông tin Supplier
    async updateSupplier(id, data) {
        try {
            const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });
            if (!supplier) throw new Error('Supplier not found');
            return supplier;
        } catch (error) {
            throw error;
        }
    }

    // Xóa Supplier
    async deleteSupplier(id) {
        try {
            const supplier = await Supplier.findByIdAndDelete(id);
            if (!supplier) throw new Error('Supplier not found');
            return supplier;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SupplierService();
