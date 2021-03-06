// TODO: figure out cors
const CORS_WHITELIST = [
  /^(https?:\/\/)?localhost(:\d+)?$/,
  /^(http(s)?:\/\/)(.*\.)?kdoveton\.com(:\d+)?$/
]

const passport = require('passport');

const router = require('express').Router();

const cors = require('cors');
router.use(cors({
  origin: CORS_WHITELIST
}));

const AuthMiddleware = require('./auth/AuthMiddleware');
router.use(AuthMiddleware);

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const auth = require('./auth/auth');
router.use('/auth', auth);

const users = require('./users/users');
router.use('/users', users);

const files = require('./files/files');
router.use('/files', files);

const templates = require('./templates/templates');
router.use('/templates', templates);

const s3 = require('./s3/s3');
router.use('/s3', s3);

const bible = require('./bible/bible');
router.use('/bible', bible);

router.get('/', (req, res) => {
  res.send('api v1')
});

// TODO: DELETE
router.get('/sessions', (req, res) => {
  const Session = require('mongoose').model('Session');
  Session.find((err, session) => {
    res.json(session);
  })
})

router.delete('/sessions/all', (req, res) => {
  const Session = require('mongoose').model('Session');
  Session.find().remove().exec();
  return res.status(200).send();
})

module.exports = router;
