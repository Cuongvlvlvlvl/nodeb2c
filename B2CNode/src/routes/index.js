const newRouter = require('./home');
const pay = require('./vnpay');
const authRouter = require('./auth');
const upload = require('./upload');
const adminload = require('./admin');
const read = require('./read');
const user = require('./user');

function route(app) {
  app.use('/', newRouter);

  app.use('/auth', authRouter);

  app.use('/order', pay);

  app.use('/upload', upload);
  
  app.use('/admin', adminload);

  app.use('/read', read);

  app.use('/user', user);

}

module.exports = route;
