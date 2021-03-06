const router = require('express').Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const crypto = require('crypto');
const hash = require('../../../../utils/hash');
const flash = require('connect-flash');
const User = mongoose.model('User');
const Session = mongoose.model('Session');
const STATUS = require('../../../status');

passport.use(new LocalStrategy(
  function(username, password, cb) {
    User.findOne({ username: username }, function(err, user) {	
      
      if (err) {
        console.log(err);
        return cb(err);
      }
      
      if (!user) {
        return cb(null, false, {message: 'Incorrect username.', success: false});
      }
      
      if (user.password != hash(password, user.salt)) {
        return cb(null, false, {message: 'Incorrect password.', success: false});
      }
      
      var token = '';
      crypto.randomBytes(48, function(err, buffer) {
        token = buffer.toString('hex');
        return cb(null, {
          token: token,
          username: username,
          success: true
        });
      });
    });
  }
));

passport.serializeUser(function(currentSession, cb) {
  var session = new Session({
    token: currentSession['token'],
    username: currentSession['username'],
    created: new Date()
  });
  
  session.save();
  cb(null, currentSession);
});

passport.deserializeUser(function(token, cb) {
  console.log(token);
  cb(new Error('no token'));
});

passport.use(new FacebookStrategy({
    clientID: process.env.FBAppId,
    clientSecret: process.env.FBAppSecret,
    callbackURL: process.env.FBCallbackUrl
    // callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback/'
  },
  (accessToken, refreshToken, profile, cb) => {
    // console.log('a ', accessToken);
    // console.log('r ', refreshToken);
    // console.log('p ', profile);
    User.find({facebookId: profile.id}, (err, user) => {
      if (user.length == 0) {
        var user = new User({
          facebookId: profile.id,
          email: profile.email
        });
        user.save((err, user, success) => {
          return cb(err, user);
        });
      } else {
        return cb(err, user);
      }
    })
  }
));

router.use(passport.initialize());

router.use(function (req, res, next) {
  var token = req.headers['x-token'] || req.query.token;

  if ((req.url == '/auth') || (req.url == '/users')) {
    return next();
  }
  
  if (token) {
    Session.find({'token': token}, (err, s) => {
      var session = s[0]

      if (err || s.length != 1) {
        return fail();
      }
      req.user = {
        username: session.username,
        token: session.token,
        created: session.created,
        id: session._id
      }
      return next();
    })
  } else {
  	return fail();
  }
 
  function fail() {
    return res.status(STATUS.UNAUTHORISED).send('Unauthorised');
  }
});

module.exports = router;
