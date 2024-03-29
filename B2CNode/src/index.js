const express = require('express');
const session = require('express-session');
const app = express();
const crypto = require('crypto');
const handlebars = require('express-handlebars');
const path = require('path');
//const https = require('https');
//const fs = require('fs');
const port = process.env.PORT || 8000;

const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oidc');
const FacebookStrategy = require('passport-facebook');

const User = require('./app/models/User');

const dateFormat = require('dateformat');
const moment = require('moment');

//add file dinh tuyen
const route = require('./routes');

//add db
const db = require('./config/db');
const { use } = require('passport');
db.connect();

//add duong dan file tinh
app.use(express.static(path.join(__dirname, 'public')));

//add post data vao query.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//luu thong tin dang nhap
app.use(session({
  secret: 'keyboard dog',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

//template engine
app.engine('hbs', handlebars.engine({extname:'.hbs'}));
app.set('view engine','hbs');
app.set('views', path.join(__dirname,'resources/views'));
//using registerHelper
const hbs = require('handlebars');
hbs.registerHelper('toDate', function(value) {
  return dateFormat(value, 'dd/mm/yyyy');
});

hbs.registerHelper('toFromNow', function(value) {
  return moment(value).fromNow();
});

hbs.registerHelper('changeSpan', function(value) {
  if(value == 'post_user')
    return 'Quyền đăng: '
  else if(value == 'admin_user')
    return 'Quyền admin: '
  else
    return 'Trạng thái: '
});

hbs.registerHelper('enableRule', function(value) {
  switch(value){
    
    case 'post_user': {return 'enable_post'}

    case 'admin_user': {return 'enable_admin'}

    default: {return 'enable_user'}

  }
});

hbs.registerHelper('disableRule', function(value) {
  switch(value){
    
    case 'post_user': {return 'disable_post'}

    case 'admin_user': {return 'disable_admin'}

    default: {return 'disable_user'}

  }
});

hbs.registerHelper('checkType', function(val1, val2) {
  switch(val1){
    
    case 'post_user': {
      if(val2.uploader){
        return true;
      } else {
        return false;
      }
    }

    case 'admin_user': {
      if(val2.admin){
        return true;
      } else {
        return false;
      }
    }

    default: {
      if(val2.active){
        return true;
      } else {
        return false;
      }
    }

  }
});

//hbs between 4 main tags
hbs.registerHelper('changeMain', function(value) {
  if(value == 'all_user' || value == 'post_user' || value == 'admin_user' || value == 'disable_user') { return 'user_active'}
  else if(value == 'views_analyze') { return 'views_active'}
  else if(value == 'income_analyze') { return 'income_active'}
  else { return 'book_active' }
});

//
hbs.registerHelper('changeSpanBook', function(value) {
  if(value == 'vip_book')
    { return 'Trạng thái vip: ' }
  else
    { return 'Trạng thái: ' }
});

hbs.registerHelper('enableRuleBook', function(value) {
  switch(value){
    
    case 'vip_book': {return 'enable_vip_book'}

    default: {return 'enable_book'}

  }
});

hbs.registerHelper('disableRuleBook', function(value) {
  switch(value){
    
    case 'vip_book': {return 'disable_vip_book'}

    default: {return 'disable_book'}

  }
});

hbs.registerHelper('checkTypeBook', function(val1, val2) {
  switch(val1){
    
    case 'vip_book': {
      if(val2.vip){
        return true;
      } else {
        return false;
      }
    }

    default: {
      if(val2.active){
        return true;
      } else {
        return false;
      }
    }

  }
});


//xac thuc dang nhap user-password
passport.use(new LocalStrategy(function(Email, password, done) {
    User.findOne({email: Email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
  
      crypto.pbkdf2(password, 'cuongggg', 100000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); };
        hashedPassword = hashedPassword.toString('hex');
        if (!(hashedPassword === user.hashpassword)) {
          return done(null, false);
        }
        // check tk co dang active ko
        //check account status
        if (user.active == false) { return done(err); }
        return done(null, user);
      });
    });
}));

//xac thuc dang nhap facebook
passport.use(new FacebookStrategy({
  clientID: '445442411057022',
  clientSecret: 'f0c13772909c70765206b6e636b31676',
  callbackURL: 'https://b2cbook.up.railway.app/auth/login/facebook/callback',
  profileFields: ['id', 'displayName', 'emails', 'picture'],
  enableProof: true,
},
function verify(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    User.findOne({ $or:[{email: (profile.emails && profile.emails[0]) ? profile.emails[0].value : '' }, {fbid: profile.id}] }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { 
        //new user
        const newuser = new User();
        newuser.fbid = profile.id;
        newuser.username = profile.displayName;
        newuser.email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : '';
        newuser.save();
        return done(null, newuser);
      }
      else {
        //old user
        //check account status
        if (user.active == false) { return done(err); }
        //if (!(user.fbid == profile.id)) { return done(err); };
        user.save();
        return done(null, user);
      }      
    })
  });
}
));

//xac thuc dang nhap google
passport.use(new GoogleStrategy({
  clientID: '737651400824-5cp9pabdio1sh6l8e0nqmsphccdl5uek.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://b2cbook.up.railway.app/auth/login/google/callback',
},
function verify(accessToken, profile, done) {
  process.nextTick(function () {
    User.findOne({email: profile.emails[0].value }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { 
        //new user
        const newuser = new User();
        newuser.ggid = profile.id;
        newuser.username = profile.displayName;
        newuser.email = profile.emails[0].value;
        newuser.save();
        return done(null, newuser);
      }
      else {
        //old user
        //check account status
        if (user.active == false) { return done(err); }
        //if (!(user.ggid == profile.id)) { return done(err); }
        user.save();
        return done(null, user);
      }      
    })
  });
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

route(app);

// const options = {
//   key: fs.readFileSync(path.join(__dirname, '/security/cert.key')),
//   cert: fs.readFileSync(path.join(__dirname, '/security/cert.pem'))
// };

const server = app.listen(port, () => console.log(`Example app ${port}`));
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.on('comment', (data) => {
    socket.broadcast.emit('comment', data);
  })
  socket.on('notify', (data) => {
    socket.broadcast.emit('notify', data);
  })
})

//https.createServer({options}, app).listen(port, () => console.log(`Example app ${port}`));
