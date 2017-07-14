const router = require('express').Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const crypto = require('crypto');
const hash = require('../../../../utils/hash');

const User = mongoose.model('User');
const Session = mongoose.model('Session');

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
      
      var token = '';
      crypto.randomBytes(48, function(err, buffer) {
        token = buffer.toString('hex');
        return cb(null, {
          token: token,
          username: username
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
  console.log('test')
  cb(null, currentSession);
});

passport.deserializeUser(function(token, cb) {
  console.log(token);
  cb(new Error('no token'));
});

router.use(passport.initialize());
router.use(passport.session());

// router.use(function (req, res, next) {
//   if (req.url === '/auth/login/') {
//     next();
//     return;
//   }
// 
//   // TODO: implement auth middleware
//   console.log('should really do auth!')
//   next();
//   
//   
//   var token = req.headers['x-token'];
// 
//   // if (token) {
//   // 	for (var i = 0; i < accessTokens.length; i++) {
//   // 		
//   // 		if (accessTokens[i].token == token) {
//   // 			next();
//   // 			return;
//   // 		}
//   // 	};
//   // 	fail();
//   // } else {
//   // 	fail();
//   // }
//  
//   function fail() {
//     res.status(401).send('Unauthorised');
//   }
//   
// });

module.exports = router;
