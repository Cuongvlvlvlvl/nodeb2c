const express = require('express');
const router = express.Router();

const ctl = require('../app/controllers/AdminController');

router.get('/', ctl.admin);

router.get('/all_user', ctl.admin);

router.get('/post_user', ctl.post);

router.get('/admin_user', ctl.adminn);

router.get('/disable_user', ctl.disable);

router.get('/:tab/:user/enable_user', ctl.enableAccount);

router.get('/:tab/:user/disable_user', ctl.disableAccount);

router.get('/:tab/:user/enable_post', ctl.enablePost);

router.get('/:tab/:user/disable_post', ctl.disablePost);

router.get('/:tab/:user/enable_admin', ctl.enableAdmin);

router.get('/:tab/:user/disable_admin', ctl.disableAdmin);

router.get('/all_book', ctl.allBook);

router.get('/vip_book', ctl.vipBook);

router.get('/disable_book', ctl.disabledBook);

router.get('/:tab/:book/enable_book', ctl.enableBook);

router.get('/:tab/:book/disable_book', ctl.disableBook);

router.get('/:tab/:book/enable_vip_book', ctl.enablevipBook);

router.get('/:tab/:book/disable_vip_book', ctl.disablevipBook);

//for analyzer

router.get('/views_analyze', ctl.viewsAnalyze);

router.get('/income_analyze', ctl.incomeAnalyze);

module.exports = router;
