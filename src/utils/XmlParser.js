const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

class XmlParser {
  constructor(filePath) {
    this.filePath = filePath;
  }
  
  getObject(cb) {
    fs.readFile(this.filePath, function(err, data) {
      parser.parseString(data, function (err, result) {
        return cb(result);
      })
    })
  }

  getJSON(cb) {
    this.getObject((result) => {
      return cb(JSON.stringify(result));
    })
  }
  
  static parseString(data, cb) {
    parser.parseString(data, function (err, result) {
      if (err !== null) {
        console.log(err);
      }
      return cb(result);
    })
  }
  
  static build(obj) {
    const builder = new xml2js.Builder({
      headless: true
    });
    return builder.buildObject(obj);
  }
}

// var x = new XmlParser(process.cwd() + '/Docs/Template.pro5Template');
// x.getJSON((res) => {
//   console.log(res);
// })
module.exports = XmlParser;
