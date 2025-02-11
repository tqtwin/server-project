const couponModel = require('../models/coupon');
const orderModel = require('../models/order')
class CouponService {
    async createCoupon(data) {

        try {
            const coupon = await couponModel.create(data);
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async getCoupons() {
        const now = new Date();
        try {
            const coupons = await couponModel.find();
            const updatedCoupons = coupons.map((coupon) => {
                if (coupon.start_date > now || coupon.end_date < now) {
                    coupon.status = 'Inactive';
                } else {
                    coupon.status = 'Active';
                }
                return coupon;
            });
            return coupons;
        } catch (error) {
            throw error;
        }
    }

    async getCouponById(id) {
        try {
            const coupon = await couponModel.findById(id);
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async updateCoupon(id, data) {
        try {
            const coupon = await couponModel.findByIdAndUpdate(id, data, { new: true });
            return coupon;
        } catch (error) {
            throw error;
        }
    }
    async getCouponByUserId(userId) {
        try {
            // Lấy tất cả các order của user
            const userOrders = await orderModel.find({ userId: userId });
            // Lấy danh sách couponCode đã được sử dụng
            const usedCouponCodes = userOrders.map(order => order.couponCode).filter(code => code);
            // Lấy tất cả coupon từ database
            const coupons = await couponModel.find();

            // Lọc các coupon chưa được sử dụng bởi user
            const availableCoupons = coupons.filter(coupon => !usedCouponCodes.includes(coupon.code));

            return availableCoupons;
        } catch (error) {
            throw error;
        }
    }
    async deleteCoupon(id) {
        try {
            await couponModel.findByIdAndDelete(id);
            return { message: 'Coupon deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CouponService();
