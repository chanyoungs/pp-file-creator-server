const router = require('express').Router();
const mongoose = require('mongoose');

const User = mongoose.model('User');
router.post('/', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  // TODO: check password and username
  User.find({username: username}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).json(user);
  })

})

module.exports = router;
