const express = require('express');
const router = express.Router();

const order = require('../app/controllers/OrderController');
const ctl = require('../app/controllers/VnpayController');

router.get('/', order.index);
//router.get('/create_payment_url', ctl.maked);
router.post('/create_payment_url', ctl.create);
router.get('/vnpay_ipn', ctl.ipn);
router.get('/vnpay_return', ctl.return);

module.exports = router;