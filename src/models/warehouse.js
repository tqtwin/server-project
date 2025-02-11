const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên kho
    location: { type: String }, // Địa chỉ kho (tùy chọn)
    inventories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }], // Liên kết tới bảng Inventory
    created_at: { type: Date, default: Date.now },
    last_update: { type: Date, default: Date.now }
});

// Tạo model từ schema
const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
