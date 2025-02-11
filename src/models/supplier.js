const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: {type: String},
    totalDebt: { type: Number, default: 0 }, // Dư nợ của nhà cung cấp
    paidAmount: { type: Number, default: 0 },
    stock: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StockEntry' }],
});

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
