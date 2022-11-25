const express = require('express');
const router = express.Router();
const fs = require('fs');

const Books = require('../app/models/Books');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    //can phan biet path cho book va path cho chap
    if(req.body.chapname !== undefined){
      //chap
      const dir = 'src/public/b2c_data/' + req.params.bookslug + '/' + removeVietnameseTones(req.body.chapname);
      fs.exists(dir, exist => {
        if(!exist) {
          return fs.mkdir(dir, err => cb(err, dir))
        }
        return cb(null, dir);
      })
    } else {
      //book
      const books = await Books.find({}).count() + 1;
      console.log(req.body);
      // chỉnh bookslug thành số định danh
      const dir = 'src/public/b2c_data/' + "B2C" + '_' + books;
      fs.exists(dir, exist => {
        if(!exist) {
          return fs.mkdir(dir, err => cb(err, dir))
        }
        return cb(null, dir);
      })
  }},
  filename: function (req, file, cb) {
    if(req.body.chapname !== undefined){
      //chap
      cb(null, removeVietnameseTones(file.originalname))
    } else {
      //book
      cb(null, req.user._id.toString() + removeVietnameseTones(file.originalname))
    }
  }
})
 
const upload = multer({ storage })

const ctl = require('../app/controllers/UploadController');
const { exists } = require('../app/models/User');

router.get('/', ctl.index);

router.get('/book', ctl.photo);

router.post('/book',upload.single('pic'), ctl.photoup);

router.get('/:bookslug/addchap', ctl.chap);

router.post('/:bookslug/addchap',upload.array('myFile'), ctl.chapup);

//router.get('/:bookslug/delete', ctl.delete);

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

module.exports = router;
