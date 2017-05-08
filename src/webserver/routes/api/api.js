const router = require('express').Router();

const AuthMiddleware = require('./auth/AuthMiddleware');
router.use(AuthMiddleware);



const auth = require('./auth/auth');
router.use('/auth', auth);

router.get('/', (req, res) => {
  res.send('api v1')
});

module.exports = router;
