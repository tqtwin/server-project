const express = require('express');
const router = express.Router();

router.use('/api/v1/users', require('./user/index'));
router.use('/api/v1/posts', require('./post/index'));
router.use('/api/v1/products', require('./product/index'));
router.use('/api/v1/categories', require('./category/index'));
router.use('/api/v1/orders', require('./order/index'))
module.exports = router;
