const router = require('express').Router();
const ProPresenter = require('../../../../utils/ProPresenter');

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

  // var templateStart = 

  for (var i = 0; i < req.body.slides.length; i++) {
    const slide = req.body.slides[i];
    let rtfData = ProPresenter.ConvertHtmlToRtf(slide.htmlContent);

  }

  return res.json({
    success: true
  });
})

module.exports = router;
