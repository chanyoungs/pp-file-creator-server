// Connection URL
const url = 'mongodb://localhost:27017/sermoncreator';

var MongoClient = require('mongodb').MongoClient

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  if (err == null) {
    console.log("Connected successfully to server");
  }

  db.close();
});
