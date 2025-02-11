const CouponService = require('../services/coupon.service');

class CouponController {
    async createCoupon(req, res) {
        try {
            const coupon = await CouponService.createCoupon(req.body);
            return res.status(201).json({ message: 'Coupon created successfully', success: true, data: coupon });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating coupon', success: false, error: error.message });
        }
    }

    async getCoupons(req, res) {
        try {
            const coupons = await CouponService.getCoupons();
            return res.status(200).json({ success: true, data: coupons });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching coupons', success: false, error: error.message });
        }
    }

    async getCouponById(req, res) {
        try {
            const coupon = await CouponService.getCouponById(req.params.id);
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found', success: false });
            }
            return res.status(200).json({ success: true, data: coupon });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching coupon', success: false, error: error.message });
        }
    }
    async getCouponByUserId(req, res) {
        try {
            const userId = req.params.userId; // Lấy userId từ params
            const coupons = await CouponService.getCouponByUserId(userId); // Gọi tới service

            return res.status(200).json({
                success: true,
                data: coupons,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching coupons for user',
                success: false,
                error: error.message,
            });
        }
    }

    async updateCoupon(req, res) {
        try {
            const coupon = await CouponService.updateCoupon(req.params.id, req.body);
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found', success: false });
            }
            return res.status(200).json({ message: 'Coupon updated successfully', success: true, data: coupon });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating coupon', success: false, error: error.message });
        }
    }

    async deleteCoupon(req, res) {
        try {
            const result = await CouponService.deleteCoupon(req.params.id);
            return res.status(200).json({ message: result.message, success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting coupon', success: false, error: error.message });
        }
    }
}

module.exports = new CouponController();
