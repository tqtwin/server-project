const OrderService = require('../services/order.service');
class OrderController {
    async createOrder(req, res) {
        try {
            const order = await OrderService.createOrder(req.body);
            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOrders(req, res) {
        try {
            const orders = await OrderService.getOrders(req.query);
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

    async deleteOrder(req, res) {
        try {
            const result = await OrderService.deleteOrder(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();
