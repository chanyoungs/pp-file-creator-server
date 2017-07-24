const router = require('express').Router();

const AWS = require('aws-sdk')
var awsS3 = new AWS.S3({apiVersion: '2006-03-01'});

const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({ 
  storage: multerS3({
    s3: awsS3,
    bucket: process.env.AWS_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

const mongoose = require('mongoose');
const STATUS = require('../../../status');
const S3 = mongoose.model('S3');
const path = require('path');


router.get('/', (req, res) => {
  S3.find((err, s3) => {
    if (err) {
      res.status(STATUS.SERVER_ERROR).send();
    }
    res.status(STATUS.OK).json(s3);
  })
})

router.get('/:file_id', (req, res) => {
  console.log('#')
  S3.findById(req.params.file_id, (err, doc) => {
    if (err) {
      console.log('no file');
      res.status(STATUS.SERVER_ERROR).json({success: false})
    }
    
    let options = {
      Bucket: process.env.AWS_BUCKET,
      Key: doc.key
    }
    
    res.set({
      'Content-Type': doc.mimetype
    })
    console.log('###')
    var fileStream = awsS3.getObject(options).createReadStream();
    console.log('#####')
    fileStream.pipe(res);
  })
})

router.delete('/all', (req, res) => {
  S3.find().remove().exec();
  res.status(STATUS.NO_CONTENT).send();
});

router.delete('/:file_id', (req, res) => {
  S3.find({_id: req.params.file_id}).remove().exec();
  res.status(STATUS.OK).send();
});

router.post('/', upload.single('file'), (req, res) => {
  if (typeof(req.file) == 'undefined') {
    return res.status(STATUS.BAD_REQUEST).send({
      message: 'send file, also check content-type',
      success: false
    });
  }

  console.log('##', req.file);
  
  var s3 = new S3({
    user: req.user.username,
    path: req.file.location,
    key: req.file.key,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
  s3.save((err, doc) => {
    res.status(STATUS.OK).json(doc);
  });
  
});

module.exports = router;
