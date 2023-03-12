const express = require('express');
const router = express.Router();

const ctl = require('../app/controllers/HomeController');

router.get('/', ctl.index);

router.get('/session', ctl.sessionapi);

module.exports = router;
