const mongoose = require('mongoose');

const stockEntrySchema = new mongoose.Schema({
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    inventories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }], // Nhiều Inventory cho một lần nhập hàng
    entryDate: { type: Date, default: Date.now },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const StockEntry = mongoose.model('StockEntry', stockEntrySchema);

module.exports = StockEntry;
