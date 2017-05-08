const router = require('express').Router();

const auth = require('./auth/auth');
router.use('/auth', auth);

router.get('/', (req, res) => {
  res.send('api v1')
});

module.exports = router;
