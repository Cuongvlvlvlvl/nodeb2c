const Book = require('../models/Books');
const User = require('../models/User');
const BuyHistory = require('../models/BuyHistory');
const crypto = require('crypto');

class UserController {
    
    info(req, res) { 
        if (req.isAuthenticated()) {  
            res.render('userInfo', {session: req.user});
        } else {
            res.redirect('/');
        }
    }

    async mybook(req, res) {
        if (req.isAuthenticated()) { 
            var lstBook = await Book.find({email: req.user.email, active: true});
            lstBook = lstBook.map(book => book.toObject());
            res.render('userLstBook', {session: req.user, lstBook});
        } else {
            res.redirect('/');
        }
    }

    async buyHistory(req, res) {
        if (req.isAuthenticated()) { 
            var lstBuy = await BuyHistory.find({email: req.user.email});
            lstBuy = lstBuy.map(his => his.toObject());
            res.render('buyHistory', {session: req.user, lstBuy});
        } else {
            res.redirect('/');
        }
    }

    changePass(req, res) {
        if (req.isAuthenticated()) { 
            res.render('changePass', {session: req.user})
        } else {
            res.redirect('/');
        }
    }

    changePassCB(req, res) {
        if (req.isAuthenticated()) { 
            crypto.pbkdf2(req.body.oldPass, 'cuongggg', 100000, 32, 'sha256',async function(err, hashedPassword){
                if (err) { return next(err); }
                hashedPassword = hashedPassword.toString('hex');
                var user = await User.findOne({email: req.user.email});
                if(hashedPassword == user.hashpassword) {
                    crypto.pbkdf2(req.body.newPass, 'cuongggg', 100000, 32, 'sha256',async function(err, hashedPassword){
                        if (err) { return next(err); }
                        user.hashpassword = hashedPassword.toString('hex');
                        user.save();
                        res.redirect('/auth/logout');
                    })
                } else {
                    res.render('changePass', {session: req.user, err: true})
                }
            })
        } else {
            res.redirect('/');
        }
    }
  
}
  
module.exports = new UserController();
  