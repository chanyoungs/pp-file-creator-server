const router = require('express').Router();

const multer = require('multer');
const upload = multer({ dest: '/files/' });

const mongoose = require('mongoose');
const STATUS = require('../../../status');
const S3 = mongoose.model('S3');
const path = require('path');
// const fs = require('fs');

router.get('/', (req, res) => {
  S3.find((err, s3) => {
    if (err) {
      res.status(STATUS.SERVER_ERROR).send();
    }
    res.status(STATUS.OK).json(s3);
  })
})

router.get('/:file_id', (req, res) => {
  S3.find({_id: req.params.file_id}, (err, doc) => {
    if (err) {
      res.status(STATUS.SERVER_ERROR).json({success: false})
    }
    res.set({
      'Content-Type': doc.mimetype
    })
    res.status(STATUS.OK).sendFile(doc[0].path);
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
  console.log(req.file)
  // TODO: get user from access token or req.user
  var s3 = new S3({
    user: 'testy',
    path: req.file.path,
    filename: req.file.filename,
    mimetype: req.file.mimetype
  });
  s3.save((err, doc) => {
    res.status(STATUS.OK).json(doc);
  });
  
});

module.exports = router;
