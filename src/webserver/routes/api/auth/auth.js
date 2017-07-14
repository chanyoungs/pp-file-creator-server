const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
router.post('/', passport.authenticate('local'),(req, res) => {

  // let username = req.body.username;
  // let password = req.body.password;
  // 
  // // TODO: check password and username
  // User.find({username: username}, (err, user) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send();
  //   }
  //   return res.status(200).json(user);
  // })
  
  return res.status(200).json({
    success: true,
    token: req.user.token
  });

})

module.exports = router;
