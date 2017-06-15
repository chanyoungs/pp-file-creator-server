// TODO: figure out cors
const CORS_WHITELIST = [
  /^(https?:\/\/)?localhost(:\d+)?$/,
  /^(https?:\/\/)?kdoveton\.com(:\d+)?$/
]

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

const files = require('./files/files');
router.use('/files', files);

router.get('/', (req, res) => {
  res.send('api v1')
});

router.post('/parse', (req, res) => {
  const { toRtfData } = require('../../../utils/draftjs')
  var data = toRtfData(req.body.state)
  res.status(201).send(data);
});

module.exports = router;
