const express = require('express');
const router = express.Router();

const ctl = require('../app/controllers/BooksController');

router.get('/', ctl.apiBooks);

router.get('/:slug', ctl.index);

router.get('/:slug/delete', ctl.bookDelete);

router.get('/:slug/:chap', ctl.chap);

router.get('/:slug/:chap/delete', ctl.chapDelete);

router.get('/:slug/:chap/previous', ctl.previousChap);

router.get('/:slug/:chap/next', ctl.nextChap);

module.exports = router;
