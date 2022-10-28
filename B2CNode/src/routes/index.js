const newRouter = require('./home');
const pay = require('./vnpay');
const authRouter = require('./auth');
const upload = require('./upload');

function route(app) {
  app.use('/', newRouter);

  app.use('/auth', authRouter);

  app.use('/order', pay);

  app.use('/upload', upload);
}

module.exports = route;
