var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mongoose = require('mongoose');
var User = require('./app/models/user');

mongoose.connect('mongodb://localhost/myapp');

app.use(require('express-session')({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  var newUser = new User({
    local: {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
      voice: req.body.voice
    }
  });

  newUser.save(function(err) {
    if (err) throw err;
    res.redirect('/login');
  });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(3000);
