/**
 * express router providing user routes
 * @module routers/users
 * @requires express
*/

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = require('express').Router();
const mongoose = require('mongoose'); 
const crypto = require('crypto');

const User = mongoose.model('User');

/**
 * create a hash of a password and salt
 * @param password {string} - the password to hash
 * @param salt {string} - the salt
 * @return the generated password or false if failed
*/
function hash(password, salt) {
	if (typeof(password) !== 'undefined' && password !== '') {
		hmac = crypto.createHmac('sha256', salt);
		hmac.setEncoding('hex');
		hmac.write(password);
		hmac.end();
		
		return hmac.read();
	}
	else {
		return false;
	}
}

// TODO: DELETE THIS!
router.get('/', (req, res) => {
  if (req.query.allow == 1) {
    User.find((err, users) => {
      return res.status(200).json(users);
    })
  }
  else {
    return res.status(404).send();
  }
})

router.post('/', (req, res) => {
  let salt = Math.random().toString(36).substring(7);
  let pw = hash(req.body.password, salt);
  
  let user = new User({
    username: req.body.username,
    password: pw,
    salt: salt
  });
  
  // TODO: check the user doesn't already exist
  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        success: false
      });
    }
    
    return res.status(201).json({
      success: true,
      user: user._id
    });
  });
});

// TODO: should probably delete this
router.delete('/all', (req, res) => {
  User.find().remove().exec();
  return res.status(200).send();
});

router.delete('/:user_id', (req, res) => {
	User.findByIdAndRemove(req.params.user_id, (err, result) => {
		if (err) {
			return res.status(500).send();
		}
		return res.status(204).send();
	});
});

module.exports = router;
