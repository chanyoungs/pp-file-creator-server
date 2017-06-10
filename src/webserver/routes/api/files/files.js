const router = require('express').Router();

// Connection URL
const url = 'mongodb://localhost:27017/sermoncreator';

var MongoClient = require('mongodb').MongoClient

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   if (err == null) {
//     console.log("Connected successfully to server");
//   }
// 
//   db.close();
// });

router.post('/', (req, res) => {
  
  console.log(req.body)
  const { toRtfData } = require('../../../utils/draftjs')
  // var data = toRtfData(req.body.slides)
  // res.status(201).send(data);
  
  res.send('success');
})

module.exports = router;
