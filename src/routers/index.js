const express = require('express');
const router = express.Router();

router.use('/api/v1/users', require('./user/index'));
router.use('/api/v1/posts', require('./post/index'));

module.exports = router;
