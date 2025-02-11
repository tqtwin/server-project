const express = require('express');
const MoMoController = require('../../controllers/momocontroller');

const router = express.Router();

// Create Payment Route (Frontend redirects here to get the payment link)
router.post('/create-payment', MoMoController.createPayment);



module.exports = router;
