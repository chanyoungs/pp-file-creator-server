const router = require('express').Router();

var accessTokens = process.env.NODE_ENV == "development" ? [{token: '9e5207a53db2ef22c6d0c0c802034748dc50d0ce2ba3d52c34d70bd7e6c8897f75e46ba9277b1911f92974ab754b65e5'}] : [];

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const crypto = require('crypto');
const hash = require('../../../../utils/hash');

const User = mongoose.model('User');

passport.use(new LocalStrategy(
  function(username, password, cb) {
    User.findOne({ username: username }, function(err, user) {	
      
      if (err) {
        return cb(err);
      }
      
      if (!user) {
        console.log('b')
        return cb(null, false, {message: 'Incorrect username.'});
      }
      
      if (user.password != hash(password, user.salt)) {
        console.log('a')
        return cb(null, false, {message: 'Incorrect password.'});
      }
      
      // TODO: check user is valid
      var token = '';
      crypto.randomBytes(48, function(err, buffer) {
        token = buffer.toString('hex');
        return cb(null, {token: token});
      });
    });
  }
));

passport.serializeUser(function(token, cb) {
  accessTokens.push(token);
  cb(null, token);
});

passport.deserializeUser(function(token, cb) {
  for (var i = 0; i < accessTokens.length; i++) {
    if (accessTokens[i] == token) {
      cb(null, token);
    }
  }
  cb(new Error('no token'));
});

router.use(passport.initialize());

router.use(function (req, res, next) {
  if (req.url === '/auth/login/') {
    next();
    return;
  }

  // TODO: implement auth middleware
  console.log('should really do auth!')
  next();
  
  
  var token = req.headers['x-token'];

  // if (token) {
  // 	for (var i = 0; i < accessTokens.length; i++) {
  // 		
  // 		if (accessTokens[i].token == token) {
  // 			next();
  // 			return;
  // 		}
  // 	};
  // 	fail();
  // } else {
  // 	fail();
  // }
 
  function fail() {
    res.status(401).send('Unauthorised');
  }
  
});

module.exports = router;
