const User = require('../models/User');
const Book = require('../models/Books');
const Notify = require('../models/Notify');
const Buyhistory = require('../models/BuyHistory');


class AdminController {
  //[get] -> home
  async admin(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var tab = 'all_user';
        var lstUser = await User.find({email: { $ne: req.user.email }}).sort({active: -1});
        lstUser = lstUser.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstUser, tab});
      }
      else
      {
        res.redirect('/lost');
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
        var tab = 'post_user';
        var lstUser = await User.find({active: true, email: { $ne: req.user.email }}).sort({active: -1});
        lstUser = lstUser.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstUser, tab});
      }
      else
      {
        res.redirect('/lost');
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
        var tab = 'admin_user';
        var lstUser = await User.find({active: true, email: { $ne: req.user.email }}).sort({active: -1});
        lstUser = lstUser.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstUser, tab});
      }
      else
      {
        res.redirect('/lost');
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
        var tab = 'disable_user';
        var lstUser = await User.find({active: false, email: { $ne: req.user.email }});
        lstUser = lstUser.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstUser, tab});
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disableAccount(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí trang thai
        var thisUser = await User.findOne({email: req.params.user});
        thisUser.active = false;
        thisUser.save();
        //xử lý hien thi
        var tab = req.params.tab;
        sleep(500);
        res.redirect('/admin/'+ tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async enableAccount(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí trang thai
        var thisUser = await User.findOne({email: req.params.user});
        thisUser.active = true;
        thisUser.save();
        //xử lý hien thi
        var tab = req.params.tab;
        sleep(500);
        res.redirect('/admin/'+ tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disablePost(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí trang thai
        var thisUser = await User.findOne({email: req.params.user});
        thisUser.uploader = false;
        thisUser.save();
        //xử lý hien thi
        var tab = req.params.tab;
        sleep(500);
        res.redirect('/admin/'+ tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async enablePost(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí trang thai
        var thisUser = await User.findOne({email: req.params.user});
        thisUser.uploader = true;
        thisUser.save();
        //xử lý hien thi
        var tab = req.params.tab;
        sleep(500);
        res.redirect('/admin/'+ tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disableAdmin(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí trang thai
        var thisUser = await User.findOne({email: req.params.user});
        thisUser.admin = false;
        thisUser.save();
        //xử lý hien thi
        var tab = req.params.tab;
        sleep(500);
        res.redirect('/admin/'+ tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async enableAdmin(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí trang thai
        var thisUser = await User.findOne({email: req.params.user});
        thisUser.admin = true;
        thisUser.save();
        //xử lý hien thi
        var tab = req.params.tab;
        sleep(500);
        res.redirect('/admin/'+ tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async allBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        var tab = 'all_book';
        var lstBook = await Book.find({}).sort({active: -1});
        lstBook = lstBook.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstBook, tab});
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async vipBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào book
        var tab = 'vip_book';
        var lstBook = await Book.find({active: true}).sort({vip: -1});
        lstBook = lstBook.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstBook, tab});
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disabledBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào book
        var tab = 'disable_book';
        var lstBook = await Book.find({active: false});
        lstBook = lstBook.map(user => user.toObject());
        res.render('admin', {session: req.user, layout: false, lstBook, tab});
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disableBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var thisbook = await Book.findOne({_id: req.params.book});
        thisbook.active = false;
        var lstNotify = await Notify.find({bookname: thisbook.bookname});
        lstNotify.forEach( noti => { noti.remove(); });
        thisbook.save();
        sleep(500);
        res.redirect('/admin/'+ req.params.tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async enableBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var thisbook = await Book.findOne({_id: req.params.book});
        thisbook.active = true;
        thisbook.save();
        sleep(500);
        res.redirect('/admin/'+ req.params.tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async enablevipBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var thisbook = await Book.findOne({_id: req.params.book});
        thisbook.vip = true;
        thisbook.save();
        sleep(500);
        res.redirect('/admin/'+ req.params.tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async disablevipBook(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        //xử lí thông tin vào admin
        //xử lý all account
        var thisbook = await Book.findOne({_id: req.params.book});
        thisbook.vip = false;
        thisbook.save();
        sleep(500);
        res.redirect('/admin/'+ req.params.tab);
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async viewsAnalyze(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        var tab = 'views_analyze';
        var lstView = await Book.find({}).sort({ viewCount: -1 , createdAt: -1});
        lstView = lstView.map(view => view.toObject());
        res.render('admin', {session: req.user, layout: false, lstView, tab});
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

  async incomeAnalyze(req, res) { 
    if(req.isAuthenticated()) {
      if(req.user.admin == true) {
        var tab = 'income_analyze';
        var sum = 0;
        var lstIncome = new Array();
        var lstUser = await User.find({});
        await Promise.all(lstUser.map( async function(thisuser) {
          var totalMoney = 0;
          var userLstBuy = await Buyhistory.find({email: thisuser.email});
          userLstBuy.forEach( history => {
            totalMoney += history.vnp_Amount;
          })
          lstIncome.push({
            username: thisuser.username,
            email: thisuser.email,
            totalMoney: totalMoney
          });
          sum += totalMoney;
        }))
        lstIncome = lstIncome.sort((a, b) => b.totalMoney-a.totalMoney);
        //lstIncome là biến trả về
        res.render('admin', {session: req.user, layout: false, lstIncome, tab, sum});
      }
      else
      {
        res.redirect('/lost');
      }
    }
    else
    {
      res.redirect('/auth/login');
    }
  }

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = new AdminController();
