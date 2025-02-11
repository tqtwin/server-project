const mongoose = require('mongoose');

const productCouponSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true }
});

const ProductCoupon = mongoose.model('ProductCoupon', productCouponSchema);
module.exports = ProductCoupon;
