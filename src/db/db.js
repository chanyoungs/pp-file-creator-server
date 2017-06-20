module.exports = function() {
  const DB_URI = process.env.NODE_ENV == 'production' ? 'mongodb://mongodb/pp-file-creator' : 'mongodb://localhost/pp-file-creator';
  
  
  const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
  mongoose.connect(DB_URI);

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', function () {  
    console.log('Mongoose default connection open to ' + DB_URI);
  }); 

  // If the connection throws an error
  mongoose.connection.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
  }); 

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
  });

  // If the Node process ends, close the Mongoose connection 
  process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
  }); 

  const TEMPLATE_SCHEMA = mongoose.Schema({
    slide: String,
    width: Number,
    height: Number,
    backgroundColor: String,
    preview: Object,
    htmlContent: String,
    title: String
  });
  const Template = mongoose.model('Template', TEMPLATE_SCHEMA)

  const PRESENTATION_SCHEMA = mongoose.Schema({
    slide: String,
    title: String,
    date: Date
  });

  const Presentation = mongoose.model('Presentation', PRESENTATION_SCHEMA)
}
