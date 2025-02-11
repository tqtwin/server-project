const express = require('express');
const router = express.Router();
const fetchData = require('../controllers/tikicontroller')

router.use('/api/v1/users', require('./user/index'));
router.use('/api/v1/reviews', require('./review/index'));
router.use('/api/v1/products', require('./product/index'));
router.use('/api/v1/categories', require('./category/index'));
router.use('/api/v1/coupons', require('./coupon/index'));
router.use('/api/v1/orders', require('./order/index'))
router.use('/api/v1/statistics', require('./static/index'))
router.use('/api/v1/suppliers', require('./supplier/index'))
router.use('/api/v1/role', require('./role/index'))
router.use('/api/v1/stockEntry', require('./stockEntry/index'))
router.use('/api/v1/warehouse', require('./warehouse/index'))
router.use('/api/v1/news', require('./news/index'))
router.use('/api/v1/groupchat',require('./chat/index'))
router.use('/api/v1/momo',require('./momo/index'))
router.use('/api/v1/website', require('./web/index'))

router.use('/api/v1/fetchdata', fetchData);
module.exports = router;
