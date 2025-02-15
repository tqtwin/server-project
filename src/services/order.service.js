const orderModel = require('../models/order');
const productModel = require('../models/product');
const userModel = require('../models/user');
const inventoryModel = require('../models/inventory')
const { sendOrderConfirmationEmail, sendPaymentSuccessEmail ,sendStatusOrderEmail } = require('../services/email.service');
class OrderService {
    // Tạo đơn hàng
    async createOrder(data) {
        try {
            const { userId, products, paymentMethod, recipientName, recipientPhone, address, note, statusName = 'Pending', couponCode = '', subtotalAmount, discountAmount, totalAmount } = data;

            let orderDetails = [];

            // Tính chi tiết đơn hàng
            for (let item of products) {
                const product = await productModel.findById(item.productId);
                if (!product) throw new Error(`Product not found for ID: ${item.productId}`);

                const inventory = await inventoryModel.findOne({ productId: item.productId });
                if (!inventory) throw new Error(`Inventory not found for product ID: ${item.productId}`);

                if (inventory.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                // Trừ số lượng sản phẩm trong kho
                await inventoryModel.updateOne(
                    { productId: item.productId },
                    { $inc: { quantity: -item.quantity } }
                );

                // Thêm vào chi tiết đơn hàng
                const orderDetail = {
                    productId: product._id,
                    productName: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    image: product.image,
                };
                orderDetails.push(orderDetail);
            }

            // Khởi tạo đơn hàng
            const order = await orderModel.create({
                userId: userId,
                recipientName,
                recipientPhone,
                paymentMethod,
                address,
                note,
                subtotalAmount,   // Tổng tiền trước khi giảm giá
                discountAmount,   // Số tiền giảm giá
                couponCode,       // Mã giảm giá (nếu có)
                totalAmount,      // Tổng tiền sau khi giảm giá
                orderDetails,
                orderStatus: [{ name: statusName, update: new Date() }],
                currentStatus: statusName,
            });

            // Gắn đơn hàng vào danh sách của người dùng
            const user = await userModel.findByIdAndUpdate(userId, { $push: { orders: order._id } });

            // Nếu phương thức thanh toán là COD, gửi email xác nhận
            if (paymentMethod === 'cod') {
                await sendOrderConfirmationEmail(user.email, order);
            }

            return order;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách đơn hàng
    async getOrders(query) {
        try {
            const { page = 1, limit = 10, userId, status } = query;
            let searchQuery = { deleted: false };

            if (userId) searchQuery.userId = userId;
            if (status) searchQuery.currentStatus = status; // Lọc theo trạng thái hiện tại

            const orders = await orderModel.find(searchQuery)
                // .populate('orderDetails.productId') // Populate thông tin sản phẩm
                .sort({ created_at: -1 }) // Sắp xếp mới nhất
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await orderModel.countDocuments(searchQuery);

            return { orders, total, page, limit };
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin chi tiết đơn hàng
    async getOrderById(orderId) {
        try {
            const order = await orderModel.findOne({ _id: orderId, deleted: false })
                .populate('orderDetails.productId'); // Populate thông tin sản phẩm

            if (!order) throw new Error('Order not found');
            return order;
        } catch (error) {
            throw error;
        }
    }

// Cập nhật trạng thái hoặc thông tin đơn hàng
async updateOrder(orderId, data) {
    try {
        const order = await orderModel.findById(orderId);
        if (!order) throw new Error('Order not found');

        // Nếu trạng thái được cập nhật là "Canceled"
        if (data.statusName === 'Canceled') {
            for (let item of order.orderDetails) {
                // Hoàn trả vào tồn kho
                await inventoryModel.updateOne(
                    { productId: item.productId },
                    { $inc: { quantity: item.quantity } } // Cộng lại số lượng tồn kho
                );
            }
        }

        // Nếu trạng thái được cập nhật là "Delivered"
        if (data.statusName === 'Delivered') {
            for (let item of order.orderDetails) {
                // Cập nhật số lượng đã bán
                await productModel.updateOne(
                    { _id: item.productId },
                    { $inc: { sold: item.quantity } } // Tăng số lượng đã bán
                );
            }
        }

        // Cập nhật trạng thái đơn hàng
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            {
                $push: { orderStatus: { name: data.statusName, update: new Date() } },
                currentStatus: data.statusName,
            },
            { new: true }
        );

        if (!updatedOrder) throw new Error('Failed to update order');

        // Gửi email thông báo trạng thái đơn hàng mới
        const user = await userModel.findById(updatedOrder.userId);
        if (user && user.email) {
            await sendStatusOrderEmail(user.email, updatedOrder, data.statusName);
        }

        return updatedOrder;
    } catch (error) {
        throw error;
    }
}

// Trong OrderService.js
async updateOrderPaymentStatus(orderId, paymentStatus, paymentTransactionId) {
    try {
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: paymentStatus,
                paymentTransactionId: paymentTransactionId, // ID giao dịch thanh toán
                paymentDate: new Date(), // Ngày thanh toán
            },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        if (!order) {
            throw new Error('Order not found');
        }

        // Nếu thanh toán thành công, gửi email xác nhận và cập nhật thêm thông tin
        if (paymentStatus === 'Success') {

            const user = await userModel.findById(order.userId);
            if (user && user.email) {
                await sendPaymentSuccessEmail(user.email, order);
            }
        }

        return order;
    } catch (error) {
        throw error;
    }
}
    // Xóa đơn hàng
    async deleteOrder(orderId) {
        try {
            const deletedOrder = await orderModel.findByIdAndUpdate(orderId, { deleted: true });
            const user = await userModel.findOne({ orders: orderId });
            if (user) {
                user.orders.pull(orderId);
                await user.save();
            }
            return deletedOrder;
        } catch (error) {
            throw error;
        }
    }
    async deleteAllOrders() {
        try {
          // Tìm tất cả các đơn hàng có thuộc tính deleted: true
          const deletedOrders = await orderModel.find({ deleted: true });

          // Nếu không có đơn hàng nào bị xóa, trả về thông báo
          if (deletedOrders.length === 0) {
            return { message: 'Không có đơn hàng nào đã bị xóa.' };
          }

          // Lặp qua tất cả các đơn hàng đã bị xóa
          for (let order of deletedOrders) {
            // Lấy người dùng liên quan đến đơn hàng
            const user = await userModel.findOne({ orders: order._id });

            // Nếu người dùng có đơn hàng này, xóa khỏi danh sách đơn hàng của họ
            if (user) {
              user.orders.pull(order._id);
              await user.save();
            }

            // Xóa đơn hàng khỏi database (có thể sử dụng findByIdAndDelete nếu muốn xóa hoàn toàn)
            await orderModel.findByIdAndDelete(order._id);
          }

          return { message: `${deletedOrders.length} đơn hàng đã bị xóa thành công.` };
        } catch (error) {
          throw error;
        }
      }


}

module.exports = new OrderService();
