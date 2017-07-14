const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');
const Session = mongoose.model('Session');

router.post('/', passport.authenticate('local'),(req, res) => {

  return res.status(200).json({
    success: true,
    token: req.user.token
  });

})

router.delete('/', (req, res) => {
  
});

module.exports = router;
