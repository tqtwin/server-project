const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/couponcontroller');

// Get all roles
router.get('/', couponController.getCoupons);

// Get role by ID
router.get('/:id', couponController.getCouponById);

// Create a new role
router.post('/', couponController.createCoupon);

// Update role by ID
router.put('/:id', couponController.updateCoupon);

// Delete role by ID
router.delete('/:id', couponController.deleteCoupon);

router.get('/user/:userId', couponController.getCouponByUserId);

module.exports = router;
