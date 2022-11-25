const express = require('express');
const router = express.Router();

const ctl = require('../app/controllers/UserController');

router.get('/', ctl.info);

router.get('/info', ctl.info);

router.get('/book', ctl.mybook);

router.get('/history', ctl.buyHistory);

router.get('/changepass', ctl.changePass);

router.post('/changepass', ctl.changePassCB);


module.exports = router;
