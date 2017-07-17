const crypto = require('crypto');


/**
 * create a 4 character random hex string
 * @returns {String} random 4 hex characters
*/
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * create a guid
 * @return {String} guid
*/
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = guid;
