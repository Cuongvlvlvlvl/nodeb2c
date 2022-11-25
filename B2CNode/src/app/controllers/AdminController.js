const User = require('../models/User');
const Book = require('../models/Books');
const View = require('../models/Views');

class AdminController {
  //[get] -> home
  async admin(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var lstUser = await User.find({});
        lstUser = lstUser.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstUser});
      }
      else
      {
        res.redirect('/');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async post(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var lstUser = await User.find({uploader: true});
        lstUser.map(user => user.toObject({ virtuals: true }));
        res.render('admin', {session: req.user, layout: false, lstUser});
      }
      else
      {
        res.redirect('/');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async adminn(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var lstUser = await User.find({admin: true});
        lstUser.map(user => user.toObject({ virtuals: true }));
        res.render('admin', {session: req.user, layout: false, lstUser});
      }
      else
      {
        res.redirect('/');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disable(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var lstUser = await User.find({active: false});
        lstUser.map(user => user.toObject({ virtuals: true }));
        res.render('admin', {session: req.user, layout: false, lstUser});
      }
      else
      {
        res.redirect('/');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

}

module.exports = new AdminController();
