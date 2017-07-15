const router = require('express').Router();
const passport = require('passport');

router.get('/',
  passport.authenticate('facebook')
);

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json(req.user);
  });

module.exports = router;
