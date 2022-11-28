const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');

var userStore;
var rndnum = new String();
var sended = false;

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

    emailconfirmcb(req, res, next) {
        if(req.query.err){
            res.render('emailConfirm', {layout: false, err: true});   
        } else
        res.render('emailConfirm', {layout: false});   
    }

    emailconfirm(req, res, next) {
        if(!sended) {
            userStore = req.body;
            rndnum = makeid();

            //send email
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'b2c.technology.developer@gmail.com',
                    pass: 'kgbimidzzewgrgyj',
                },
            });
            
            var mailOptions = {
                from: 'b2c.technology.developer@gmail.com',
                to: req.body.email,
                subject: '[B2C] Xác thực email',
                text: 'Mã xác thực của bạn là: ' + rndnum,
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                    sended = true;
                    res.render('emailConfirm', {layout: false});
                }
            });
        } else
        res.render('emailConfirm', {layout: false});     
    }

    signup(req, res, next) {
        var codestr = req.body.vcode;
        if(codestr === undefined){ var codestr = req.query.vcode };
        if( !(codestr === rndnum) ) { return res.redirect('/auth/confirm?err=true') };
        sended = false;
        rndnum = new String();
        if( !(userStore.currentpassword === userStore.confirm) ) { return res.redirect('/auth/signup?passErr=true') };
        const userForm = userStore;
        crypto.pbkdf2(userStore.currentpassword, 'cuongggg', 100000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return next(err); }
            userForm.hashpassword = hashedPassword.toString('hex');
                process.nextTick(function () {
                User.findOne({email: userStore.email}, function(err, userr){
                    if(err) { return next(err);}
                    if(!userr){
                        const user = new User(userForm);
                        user.save();
                        userStore = undefined;
                        req.login(user, function(err) {
                            if(err) { return next(err); }
                            res.redirect('/');
                        })
                    }
                    else{
                        if( !(userr.hashpassword === null) ) { return res.redirect('/auth/signup?emailConflict=true')};
                        userr.hashpassword = hashedPassword.toString('hex');
                        userr.save();
                        userStore = undefined;
                        req.login(userr, function(err) {
                            if(err) { return next(err); }
                            res.redirect('/');
                        })
                    }
                })
            })
        })
    };

    err(req, res){
        res.render('loginErr');
    }

}

function makeid() {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = 6;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = new AuthController();