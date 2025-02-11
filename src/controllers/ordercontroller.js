const OrderService = require('../services/order.service');

class OrderController {
    async createOrder(req, res) {
        try {
            const order = await OrderService.createOrder(req.body); // Tạo đơn hàng
            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOrders(req, res) {
        try {
            const { status, userId, page, limit } = req.query;
            const query = { userId, status, page, limit }; // Truyền các tham số truy vấn
            const orders = await OrderService.getOrders(query);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await OrderService.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateOrder(req, res) {
        try {
            const order = await OrderService.updateOrder(req.params.id, req.body);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateOrderPaymentStatus(req, res) {
        try {
            const { orderId, paymentStatus, paymentTransactionId } = req.body;

            // Gọi đến OrderService để cập nhật trạng thái thanh toán
            const updatedOrder = await OrderService.updateOrderPaymentStatus(orderId, paymentStatus, paymentTransactionId);

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteOrder(req, res) {
        try {
            const deletedOrder = await OrderService.deleteOrder(req.params.id);
            res.status(200).json(deletedOrder);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteOrderA(req, res) {
        try {
            const deletedOrder = await OrderService.deleteAllOrders();
            res.status(200).json(deletedOrder);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();
