const crypto = require('crypto');
const User = require('../models/User');

class AuthController {

    login(req, res) { 
        const err = req.query.err;
        if(err === 'true'){
            res.render('login', {layout: false, err: 'Sai tên đăng nhập hoặc mật khẩu!'});
        }else
            res.render('login', {layout: false});
    }

    logout(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
        res.redirect('/');
    })};
  
    fbauth(req, res) {
        res.render('');
    }

    signupr(req, res) {
        const perr = req.query.passErr;
        if(perr === 'true'){
            res.render('signup', {layout: false, passErr: 'Hai mật khẩu không trùng khớp!'});
        }else{
            const eerr = req.query.emailConflict;
            if(eerr === 'true') {
                res.render('signup', {layout: false, emailConflict: 'Địa chỉ email đã được đăng ký! Vui lòng sử dụng email khác.'});
            }else
                res.render('signup', {layout: false});
        }
    }

    signup(req, res, next) {
        if( !(req.body.password === req.body.confirm) ) { return res.redirect('/auth/signup?passErr=true') };
        const userForm = req.body;
        crypto.pbkdf2(req.body.password, 'cuongggg', 100000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return next(err); }
            userForm.hashpassword = hashedPassword.toString('hex');
                process.nextTick(function () {
                User.findOne({email: req.body.email}, function(err, userr){
                    if(err) { return next(err);}
                    if(!userr){
                        const user = new User(userForm);
                        user.save();
                        req.login(user, function(err) {
                            if(err) { return next(err); }
                            res.redirect('/');
                        })
                    }
                    else{
                        if( !(userr.hashpassword === null) ) { return res.redirect('/auth/signup?emailConflict=true')};
                        userr.hashpassword = hashedPassword.toString('hex');
                        userr.save();
                        req.login(userr, function(err) {
                            if(err) { return next(err); }
                            res.redirect('/');
                        })
                    }
                })
            })
        })
    };

}
  
  module.exports = new AuthController();