const router = require('express').Router();

const multer = require('multer');
const upload = multer({ dest: '/files/' });

const mongoose = require('mongoose');

const S3 = mongoose.model('S3');
const path = require('path');
// const fs = require('fs');

router.get('/:file_id', (req, res) => {
  S3.find({_id: req.params.file_id}, (err, doc) => {
    if (err) {
      res.json({success: false})
    }
    res.set({
      'Content-Type': doc.mimetype
    })
    res.sendFile(doc[0].path);
  })
})

router.post('/', upload.single('file'), (req, res) => {
  if (typeof(req.file) == 'undefined') {
    return res.status(400).send('send file, also check content-type');
  }
  
  // var filePath = path.join('/files/', req.file.path);
  
  var s3 = new S3({
    user: 'testy',
    path: req.file.path,
    mimetype: req.file.mimetype
  });
  s3.save((err, doc) => {
    res.json(doc);
  });
  
});

module.exports = router;