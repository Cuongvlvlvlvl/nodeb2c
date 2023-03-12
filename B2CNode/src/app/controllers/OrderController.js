const Notify = require('../models/Notify');

class OrderController {
    //[get] -> home
  async index(req, res) {  
    if (req.isAuthenticated()) {   
      //load 10 thông báo
      var notify = await Notify.find({});
      var notifyCount = await Notify.find({}).count();
      notify = notify.slice(notifyCount-10, notifyCount).map( ele => ele.toObject());

      res.render('order', {notify, session: req.user});  
    } else
    res.redirect('/auth/login');
  }

}
  
module.exports = new OrderController();
  