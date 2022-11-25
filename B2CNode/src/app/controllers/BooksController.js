const Book = require('../models/Books');
const Chap = require('../models/Chapters');
const View = require('../models/Views');

const fs = require('fs');

class BooksController {
  //xong trả về đọc truyện
  async index(req, res) { 

    var chapCount;
    var thisbook = await Book.findOne({slug: req.params.slug, active: true});
    var isView;
    
    //count how many people has viewed this book
    var viewNumber;

    //check xem phai truyen vip ko
    if(thisbook.vip == true){
      //check xem nguoi dung da dang nhap chua
      if(!req.isAuthenticated()){
        res.redirect('/');
      } else {
        const userVipDate = new Date(req.user.vipexpire);
        const today = new Date(Date.now());
        //check vip cua nguoi dung da het han chua
        if(userVipDate < today) {
          res.render('order', {session: req.user})
        } else {
          //check if user viewed this book
          isView = await View.findOne({bookid: thisbook._id.toString(), viewer: req.user._id.toString()});
          if(!isView){
            var viewer = new View();
            viewer.bookid = thisbook._id.toString();
            viewer.viewer = req.user._id.toString();
            viewer.save();
            await sleep(50);
          }
          viewNumber = await View.find({bookid: thisbook._id.toString()}).count();
          thisbook.viewCount = viewNumber;
          thisbook.save();  
          var chaps = await Chap.find({bookid: thisbook._id});
          chaps = chaps.map(chap => chap.toObject());
          chapCount = await Chap.find({bookid: thisbook._id}).count();
          var thisUser; 
          console.log(req.user.email == thisbook.email);
          if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; }
          res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
        }
      }
    } else {
      //check if user viewed this book
      if(req.isAuthenticated()){
        isView = await View.findOne({bookid: thisbook._id.toString(), viewer: req.user._id.toString()});
        if(!isView){
          var viewer = new View();
          viewer.bookid = thisbook._id.toString();
          viewer.viewer = req.user._id.toString();
          viewer.save();
          await sleep(50);
        }
      }
      viewNumber = await View.find({bookid: thisbook._id.toString()}).count();
      thisbook.viewCount = viewNumber;
      thisbook.save();
      var chaps = await Chap.find({bookid: thisbook._id});
      chaps = chaps.map(chap => chap.toObject());
      chapCount = await Chap.find({bookid: thisbook._id}).count();
      var thisUser; 
      if(req.isAuthenticated()){
        if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; };
      } else { thisUser = false; };
      res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
    }

  }

  async bookDelete(req, res) {
    if(req.isAuthenticated()){
      var thisbook = await Book.findOne({slug: req.params.slug, active: true});
        if(req.user.email == thisbook.email) {
        thisbook.active = false;
        thisbook.save();
        res.redirect('/user/book');
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  }

  async chap(req, res) { 
    // làm link đàng hoàng cho chap --- xong
    var thisbook = await Book.findOne({slug: req.params.slug, active: true});
    if(thisbook.vip == true){
      //check xem nguoi dung da dang nhap chua
      if(!req.isAuthenticated()){
        res.redirect('/');
      } else {
        const userVipDate = new Date(req.user.vipexpire);
        const today = new Date(Date.now());
        //check vip cua nguoi dung da het han chua
        if(userVipDate < today) {
          res.render('order', {session: req.user})
        } else {
          var chaps = await Chap.findOne({bookid: thisbook._id,  chapslug: req.params.chap});
          res.render('chap', {session: req.user, thisbook: thisbook.toObject(), chaps: chaps.toObject()});
        }
      }
    } else {
      var chaps = await Chap.findOne({bookid: thisbook._id,  chapslug: req.params.chap});
      res.render('chap', {session: req.user, thisbook: thisbook.toObject(), chaps: chaps.toObject()});
    }

  }

  async previousChap(req, res) {
    var thisbook = await Book.findOne({slug: req.params.slug, active: true});
    var viewNumber;
    var chapCount;
    if(thisbook.vip == true){
      //check xem nguoi dung da dang nhap chua
      if(!req.isAuthenticated()){
        res.redirect('/');
      } else {
        const userVipDate = new Date(req.user.vipexpire);
        const today = new Date(Date.now());
        //check vip cua nguoi dung da het han chua
        if(userVipDate < today) {
          res.render('order', {session: req.user})
        } else {
          viewNumber = thisbook.viewCount;
          chapCount = await Chap.find({bookid: thisbook._id}).count();
          var chaps = await Chap.find({bookid: thisbook._id});
          if((chaps.findIndex(({chapslug})=>chapslug==req.params.chap) - 1) < 0) {
            chaps = chaps.map(chap => chap.toObject());
            var thisUser;
            if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; }
            res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
          } else {
            var previousChap = chaps[chaps.findIndex(({chapslug})=>chapslug==req.params.chap) - 1];
            res.render('chap', {session: req.user, thisbook: thisbook.toObject(), chaps: previousChap.toObject()});
          }
        }
      }
    } else {
      viewNumber = thisbook.viewCount;
      chapCount = await Chap.find({bookid: thisbook._id}).count();
      var chaps = await Chap.find({bookid: thisbook._id});
      if((chaps.findIndex(({chapslug})=>chapslug==req.params.chap) - 1) < 0) {
        chaps = chaps.map(chap => chap.toObject());
        var thisUser; 
        if(req.isAuthenticated()){
          if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; };
        } else { thisUser = false; };
        res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
      } else {
        var previousChap = chaps[chaps.findIndex(({chapslug})=>chapslug==req.params.chap) - 1];
        res.render('chap', {session: req.user, thisbook: thisbook.toObject(), chaps: previousChap.toObject()});
      }
    }
  }

  async nextChap(req, res) {
    var thisbook = await Book.findOne({slug: req.params.slug, active: true});
    var viewNumber;
    var chapCount;
    if(thisbook.vip == true){
      //check xem nguoi dung da dang nhap chua
      if(!req.isAuthenticated()){
        res.redirect('/');
      } else {
        const userVipDate = new Date(req.user.vipexpire);
        const today = new Date(Date.now());
        //check vip cua nguoi dung da het han chua
        if(userVipDate < today) {
          res.render('order', {session: req.user})
        } else {
          viewNumber = thisbook.viewCount;
          chapCount = await Chap.find({bookid: thisbook._id}).count();
          var chaps = await Chap.find({bookid: thisbook._id});
          if((chaps.findIndex(({chapslug})=>chapslug==req.params.chap) + 1) >= chapCount) {
            chaps = chaps.map(chap => chap.toObject());
            var thisUser;
            if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; }
            res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
          } else {
            var nextChap = chaps[chaps.findIndex(({chapslug})=>chapslug==req.params.chap) + 1];
            res.render('chap', {session: req.user, thisbook: thisbook.toObject(), chaps: nextChap.toObject()});
          }
        }
      }
    } else {
      viewNumber = thisbook.viewCount;
      chapCount = await Chap.find({bookid: thisbook._id}).count();
      var chaps = await Chap.find({bookid: thisbook._id});
      if((chaps.findIndex(({chapslug})=>chapslug==req.params.chap) + 1) >= chapCount) {
        chaps = chaps.map(chap => chap.toObject());
        var thisUser; 
        if(req.isAuthenticated()){
          if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; };
        } else { thisUser = false; };
        res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
      } else {
        var nextChap = chaps[chaps.findIndex(({chapslug})=>chapslug==req.params.chap) + 1];
        res.render('chap', {session: req.user, thisbook: thisbook.toObject(), chaps: nextChap.toObject()});
      }
    }
  }

  async chapDelete(req, res) {
    if(req.isAuthenticated()){
      var thisbook = await Book.findOne({slug: req.params.slug, active: true});
      if(req.user.email == thisbook.email) {
        const viewNumber = thisbook.viewCount;
        //xử lí xoá chap
        //1. xoá file
        const thischap = await Chap.findOne({bookid: thisbook._id,  chapslug: req.params.chap});
        const dirPath = "src/public/b2c_data/" + thischap.chaplink
        fs.rm(dirPath, { recursive: true, force: true }, async function() {
        //2. xoá database
        thischap.remove();
        const chapCount = await Chap.find({bookid: thisbook._id}).count();
        var chaps = await Chap.find({bookid: thisbook._id});
        chaps = chaps.map(chap => chap.toObject());
        //3. trả về
        var thisUser;
        if(req.user.email == thisbook.email) { thisUser = true; } else { thisUser = false; }        
        res.render('book', {session: req.user, thisbook: thisbook.toObject(), lstchap: chaps, viewNumber, chapCount, thisUser});
        });
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  }

  async apiBooks(req, res) {
    var lstBooks = await Book.find({active: true});
    lstBooks = lstBooks.map(book => book.toObject());
    res.json(lstBooks);
  }

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = new BooksController();
