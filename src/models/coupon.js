const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    description: { type: String },
    min_price:{type: Number},
    max_discount:{type: Number},
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    discountPct: { type: Number, required: true },
    status: { type: String }
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
