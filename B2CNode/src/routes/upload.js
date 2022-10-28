const express = require('express');
const router = express.Router();
const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //can phan biet path cho book va path cho chap
    if(req.body.chapname !== undefined){
      //chap
      const dir = 'src/public/b2c_data/' + req.params.bookslug + '/' + req.body.chapname;
      fs.exists(dir, exist => {
        if(!exist) {
          return fs.mkdir(dir, err => cb(err, dir))
        }
        return cb(null, dir);
      })
    } else {
      //book
      const dir = 'src/public/b2c_data/' + req.body.bookname + '_' + req.user._id.toString();
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
      cb(null, req.user._id.toString() + file.originalname)
    } else {
      //book
      cb(null, req.user._id.toString() + file.originalname)
    }
  }
})
 
const upload = multer({ storage })

const ctl = require('../app/controllers/UploadController');
const { exists } = require('../app/models/User');

router.get('/', ctl.index);

router.get('/photo', ctl.photo);

router.post('/photo',upload.single('pic'), ctl.photoup);

router.get('/:bookslug/addchap', ctl.chap);

router.post('/:bookslug/addchap',upload.array('myFile'), ctl.chapup);

module.exports = router;
