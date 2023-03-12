const express = require('express');
const passport = require('passport');

const router = express.Router();

const ctl = require('../app/controllers/AuthController');

router.get('/login', ctl.login);

router.get('/err', ctl.err);

router.post('/login/password', passport.authenticate('local', {
  failureRedirect: '/auth/err'
  }),
  function(req, res){
    res.redirect('/');
  }
);

// app.get('/login/password', function(req, res, next) {
//   passport.authenticate('local', function(err, user) {
//     if (err) { return next(err); }
//     if (!user) { return res.render('/login', {err: 'Sai tên đăng nhập hoặt '}); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/');
//     });
//   })(req, res, next);
// });

router.get('/login/facebook', passport.authenticate('facebook', {scope:'email'}));

router.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
  failureRedirect: '/auth/err'
  }),
  function(req, res){
  res.redirect('/');
  }
);

router.get('/login/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/login/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/err'
  }),
  function(req, res){
  res.redirect('/');
  }
);

router.get('/signup', ctl.signupr);

router.get('/confirm', ctl.emailconfirmcb);

router.post('/confirm', ctl.emailconfirm);

router.post('/signup', ctl.signup);

router.get('/logout', ctl.logout);

module.exports = router;