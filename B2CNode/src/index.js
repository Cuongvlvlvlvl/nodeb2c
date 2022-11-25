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
})

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
  callbackURL: 'http://localhost:8000/auth/login/facebook/callback',
  profileFields: ['id', 'displayName', 'emails', 'picture'],
  enableProof: true,
},
function verify(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log(profile);
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
      else{
        //old user
        //check account status
        if (user.active == false) { return done(err); }
        user.fbid = profile.id;
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
  callbackURL: 'http://localhost:8000/auth/login/google/callback',
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
      else{
        //old user
        //check account status
        if (user.active == false) { return done(err); }
        user.ggid = profile.id;
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

app.listen(port, () => console.log(`Example app ${port}`));
//https.createServer({options}, app).listen(port, () => console.log(`Example app ${port}`));
