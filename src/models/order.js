const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kết nối với User
    recipientName:{ type: String, required: true },
    recipientPhone:{ type: String, required: true },
    address:{ type: String, required: true },
    note:{type:String},
    subtotalAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    orderDetails: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến Product
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
    }],
    couponCode: { type: String },

    // Mảng trạng thái
    orderStatus: [{
        name: { type: String, required: true },  // Tên trạng thái (ví dụ: "Pending", "Delivered")
        update: { type: Date, default: Date.now }, // Thời gian cập nhật trạng thái
    }],

    // Trạng thái hiện tại
    currentStatus: { type: String, default: 'Pending', required: true },
    // paymentAmount: {type:Number} ,// Giá trị mặc định là "Pending"
    paymentMethod: { type: String, required: true }, // Ví dụ: "momo", "cod"
    paymentStatus: { type: String, default: 'Pending' }, // Ví dụ: "Pending", "Success", "Failed"
    paymentTransactionId: { type: String }, // ID giao dịch thanh toán (do MoMo trả về)
    paymentDate: { type: Date },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
