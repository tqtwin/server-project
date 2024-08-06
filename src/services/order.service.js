const orderModel = require('../models/order');
const productModel = require('../models/product');
const userModel = require('../models/user');

class OrderService {
    async createOrder(data) {
        try {
            const { userId, products } = data;
            let totalAmount = 0;

            for (let item of products) {
                const product = await productModel.findById(item.product);
                if (!product) throw new Error('Product not found');
                totalAmount += product.price * item.quantity;
            }

            const order = await orderModel.create({
                user: userId,
                products: products,
                totalAmount: totalAmount,
            });

            // Thêm orderId vào user
            await userModel.findByIdAndUpdate(userId, { $push: { orders: order._id } });

            return order;
        } catch (error) {
            throw error;
        }
    }

    async getOrders(query) {
        try {
            const { page = 1, limit = 10, userId, status } = query;
            let searchQuery = {};

            if (userId) {
                searchQuery.user = userId;
            }

            if (status) {
                searchQuery.status = status;
            }

            const orders = await orderModel.find(searchQuery)
                .populate('user')
                .populate('products.product')
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await orderModel.countDocuments(searchQuery);

            return { orders, total, page, limit };
        } catch (error) {
            throw error;
        }
    }

    async getOrderById(id) {
        try {
            const order = await orderModel.findById(id)
                .populate('user')
                .populate('products.product');
            return order;
        } catch (error) {
            throw error;
        }
    }

    async updateOrder(id, data) {
        try {
            const order = await orderModel.findByIdAndUpdate(id, data, { new: true });
            return order;
        } catch (error) {
            throw error;
        }
    }

    async deleteOrder(id) {
        try {
            await orderModel.findByIdAndDelete(id);
            return { message: 'Order deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new OrderService();
