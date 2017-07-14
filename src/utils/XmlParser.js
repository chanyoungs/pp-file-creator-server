const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

class XmlParser {
  constructor(filePath) {
    this.filePath = filePath;
  }

  /**
   * convert an xml file to a xml javascript object
   * @param cb {function} - a callback to be executed once finished
  */
  getObject(cb) {
    fs.readFile(this.filePath, function(err, data) {
      parser.parseString(data, function (err, result) {
        return cb(result);
      })
    })
  }

  /**
   * convert an xml file to a json string
   * @param cb {function} - a callback to be executed once finished
  */
  getJSON(cb) {
    this.getObject((result) => {
      return cb(JSON.stringify(result));
    })
  }

  /**
   * parse an xml string to a xml javascript object
   * @param {string} - the string to be converted
   * @param {function} - the function to be executed once finished
  */
  static parseString(data, cb) {
    parser.parseString(data, function (err, result) {
      if (err !== null) {
        console.log(err);
      }
      return cb(result);
    })
  }

  /**
   * convert a xml javascript object to xml
   * @param obj {object} - the object to be converted
   * @returns {string} - the xml string
  */
  static build(obj) {
    const builder = new xml2js.Builder({
      headless: true
    });
    return builder.buildObject(obj);
  }
}

module.exports = XmlParser;
