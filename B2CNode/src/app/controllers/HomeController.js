
class HomeController {
  //[get] -> home
  index(req, res) { 
    res.render('home', {session: req.user});
  }

}

module.exports = new HomeController();
