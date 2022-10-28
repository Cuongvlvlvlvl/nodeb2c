const express = require('express');
const router = express.Router();

const ctl = require('../app/controllers/HomeController');

router.get('/', ctl.index);

module.exports = router;
