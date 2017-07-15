const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');
const Session = mongoose.model('Session');


// https://github.com/jaredhanson/passport/blob/935fbdbc2f63eb0a746a3e1373fb112c5efee6b6/lib/middleware/authenticate.js#L23-L40
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info, status) => {
    if (err) { return next(err) }
    // console.log('e ', err)
    // console.log('u ', user)
    // console.log('i ', info)
    // console.log('s ',status)
    
    // could be not user or not password
    if (!user) {
      return res.json(info)
    }
    
    req.logIn(user, function(err) {
      if (err) { 
        return res.json(err);
      }
      return res.json(user);
    })
  })(req, res, next);
});

router.delete('/', (req, res) => {
  
});

module.exports = router;
