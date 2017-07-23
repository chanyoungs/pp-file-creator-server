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
const hash = require('../../../../utils/hash');
const STATUS = require('../../../status')

const User = mongoose.model('User');



// TODO: DELETE THIS!
router.get('/', (req, res) => {
  if (req.query.allow == 1) {
    User.find((err, users) => {
      return res.status(STATUS.OK).json(users);
    })
  }
  else {
    return res.status(STATUS.NOT_FOUND).send();
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
      return res.status(STATUS.SERVER_ERROR).send({
        success: false
      });
    }
    
    return res.status(STATUS.CREATED).json({
      success: true,
      user: user._id
    });
  });
});

// TODO: should probably delete this
router.delete('/all', (req, res) => {
  User.find().remove().exec();
  return res.status(STATUS.OK).send();
});

router.delete('/:user_id', (req, res) => {
	User.findByIdAndRemove(req.params.user_id, (err, result) => {
		if (err) {
			return res.status(STATUS.SERVER_ERROR).send();
		}
		return res.status(STATUS.NO_CONTENT).send();
	});
});

module.exports = router;
