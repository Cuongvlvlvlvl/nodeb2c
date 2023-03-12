const book = require('../models/Books');
const chapter = require('../models/Chapters');
const Notify = require('../models/Notify');

class UploadController {
  //[get] -> home
  async index(req, res) { 
    if (req.isAuthenticated()) { 
      if(req.user.uploader || req.user.admin){

        //load 10 thông báo
        var notify = await Notify.find({});
        var notifyCount = await Notify.find({}).count();
        notify = notify.slice(notifyCount-10, notifyCount).map( ele => ele.toObject());

        res.render('uploadBooks', {notify, session: req.user});  
      } else {
        res.redirect('/lost'); 
      }
    } else
    res.redirect('/auth/login');
  }

  async photo(req, res) {
    if (req.isAuthenticated()) {   
      if(req.user.uploader || req.user.admin){

        //load 10 thông báo
        var notify = await Notify.find({});
        var notifyCount = await Notify.find({}).count();
        notify = notify.slice(notifyCount-10, notifyCount).map( ele => ele.toObject());

        res.render('uploadBooks', {notify, session: req.user, notFirstTime: false});  
      } else {
        res.redirect('/losts'); 
      }  
    } else
    res.redirect('/auth/login');
  }

  async photoup(req, res) {
    if (req.isAuthenticated()) {   

      //load 10 thông báo
      var notify = await Notify.find({});
      var notifyCount = await Notify.find({}).count();
      notify = notify.slice(notifyCount-10, notifyCount).map( ele => ele.toObject());

      if(req.body.bookname == "" || req.body.bookname == null) { res.render('uploadBooks', {notify, session: req.user, notFirstTime: true}); }
      else {
        const formData = req.body;
        //xoá khoảng trắng và dấu trong bookname và file - xong
        const books = await book.find({}).count() + 1;
        formData.pic = '/b2c_data/' + "B2C" + '_' + books + "/" + req.user._id.toString() + removeVietnameseTones(req.file.originalname);
        formData.author = req.user.username;
        formData.email = req.user.email;
        formData.slug = "B2C" + '_' + books;
        if(req.body.vip == 'on'){
          formData.vip = true;
        } else {
          formData.vip = false;
        }
        const newBook = new book(formData);   
        // const cater = ["saubanhancut", "khong an cut dau", "ănc  o m", "more"];
        // newBook.categories = cater;
        newBook.save();
        await sleep(100);
        res.redirect('/upload/' + newBook.slug + '/addchap');
      }
    } else res.redirect('/auth/login');
  }

  async chap(req, res) {
    if (req.isAuthenticated()) {     
      var thisbook = await book.findOne({slug: req.params.bookslug, active: true});
      if(thisbook.email == req.user.email) {

        //load 10 thông báo
        var notify = await Notify.find({});
        var notifyCount = await Notify.find({}).count();
        notify = notify.slice(notifyCount-10, notifyCount).map( ele => ele.toObject());

        res.render('uploadChaps', {notify, link: req.params.bookslug, name: thisbook.bookname, session: req.user, pic: thisbook.pic});  
      } else {
        res.redirect('/lost');
      }
    } else {
      res.redirect('/auth/login');
    }
  }

  async chapup(req, res) {
    if (req.isAuthenticated()) {  
      //load 10 thông báo
      var notify = await Notify.find({});
      var notifyCount = await Notify.find({}).count();
      notify = notify.slice(notifyCount-10, notifyCount).map( ele => ele.toObject());

      //xử lí add thông tin vào db ở đây
      book.findOne({slug: req.params.bookslug, active: true}, async function(err, book) {
        if(!book) { res.redirect('/?ko-co-sach'); } 
        else 
        {
          if(req.body.chapname == "delete" || req.body.chapname == "" || req.body.chapname == null) { res.render ('uploadChaps',{notify, link: req.params.bookslug, name: book.bookname, session: req.user, err: true, notFirstTime: true, pic: book.pic})}
          else
          {
            var dbChap = await chapter.findOne({bookid: book._id.toString() ,chapname: req.body.chapname})
            if(dbChap) { res.render ('uploadChaps',{notify, link: req.params.bookslug, name: book.bookname, session: req.user, err: true, notFirstTime: true, pic: book.pic})}
            else
            {
              const formData = req.body;
              formData.bookid = book._id.toString();
              formData.chaplink = book.slug + "/" + removeVietnameseTones(req.body.chapname);
              formData.chapslug = removeVietnameseTones(req.body.chapname);
              const newChap = new chapter(formData);
              //link xong
              req.files.forEach(element  =>{
                var data = new String( formData.chaplink + "/" + removeVietnameseTones(element.originalname));
                newChap.imglinks.push(data);
              });
              newChap.save();
              res.render ('uploadChaps',{notify, link: req.params.bookslug, name: book.bookname, session: req.user, err: false, notFirstTime: true, pic: book.pic});
            }
          }
        }
      })
    } else res.redirect('/auth/login');
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g,"_");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,"_");
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,"_");
  str = str.replace(/ /g,"_");
  return str;
}

module.exports = new UploadController();
