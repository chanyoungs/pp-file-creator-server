const crypto = require('crypto');

/**
 * create a hash of a password and salt
 * @param password {string} - the password to hash
 * @param salt {string} - the salt
 * @return the generated password or false if failed
*/
function hash(password, salt) {
	if (typeof(password) !== 'undefined' && password !== '') {
		hmac = crypto.createHmac('sha256', salt);
		hmac.setEncoding('hex');
		hmac.write(password);
		hmac.end();
		
		return hmac.read();
	}
	else {
		return false;
	}
}

module.exports = hash;
