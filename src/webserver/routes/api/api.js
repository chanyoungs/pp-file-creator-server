// TODO: figure out cors
const CORS_WHITELIST = [
  /^(https?:\/\/)?localhost(:\d+)?$/,
  /^(http(s)?:\/\/)(.*\.)?kdoveton\.com(:\d+)?$/
]

const passport = require('passport');

const router = require('express').Router();

const AuthMiddleware = require('./auth/AuthMiddleware');
router.use(AuthMiddleware);

const cors = require('cors');
router.use(cors({
  origin: CORS_WHITELIST
}));

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

router.post('/parse', (req, res) => {
  const { toRtfData } = require('../../../utils/draftjs')
  var data = toRtfData(req.body.state)
  res.status(201).send(data);
});

module.exports = router;
