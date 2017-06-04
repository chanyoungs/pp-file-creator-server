const path = require('path')
const FILE_PATH = path.join(__dirname, '/../', 'Docs/test.xml')

const fs = require('fs');
const xml2js = require('xml2js');
const builder = new xml2js.Builder({
  headless: true
});

var obj = {name: "Super", Surname: "Man", age: 23};
var xml = builder.buildObject(obj);

console.log(xml)
