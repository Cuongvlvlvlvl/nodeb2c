const newRouter = require('./home');
const pay = require('./vnpay');
const authRouter = require('./auth');
const upload = require('./upload');
const adminload = require('./admin');
const read = require('./read');
const user = require('./user');

const Comment = require('../app/models/Comment')

function route(app) {
  app.use('/', newRouter);

  app.use('/auth', authRouter);

  app.use('/order', pay);

  app.use('/upload', upload);
  
  app.use('/admin', adminload);

  app.use('/read', read);

  app.use('/user', user);

  //for fetch-use
  app.post('/comments', (req, res) => {
    const comment = new Comment({
      username: req.body.username,
      comment: req.body.comment,
      bookid: req.body.bookid
    })
    comment.save();
  })

}

module.exports = route;
