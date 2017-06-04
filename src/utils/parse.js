const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

class XmlParser {
  constructor(filePath) {
    this.filePath = filePath;
  }
  
  getObject() {
    fs.readFile(this.filePath, function(err, data) {
      parser.parseString(data, function (err, result) {
        return result;
      }
    }
  }
  
  getJSON() {
    return JSON.stringify(this.getObject());
  }
}

module.exports = XmlParser;
