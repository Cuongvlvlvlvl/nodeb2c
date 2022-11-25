const express = require('express');
const router = express.Router();

const ctl = require('../app/controllers/AdminController');

router.get('/', ctl.admin);

router.get('/all_user', ctl.admin);

router.get('/post_user', ctl.post);

router.get('/admin_user', ctl.adminn);

router.get('/disable_user', ctl.disable);

module.exports = router;
