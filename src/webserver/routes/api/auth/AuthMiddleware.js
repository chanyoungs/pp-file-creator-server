const router = require('express').Router();

var accessTokens = process.env.runningEnvironment == "dev" ? [{token: '9e5207a53db2ef22c6d0c0c802034748dc50d0ce2ba3d52c34d70bd7e6c8897f75e46ba9277b1911f92974ab754b65e5'}] : [];

router.use(function (req, res, next) {
  if (req.url === '/auth/login/') {
    next();
    return;
  }

  // TODO: implement auth middleware
  console.log('should really do auth!')
  next();
  // var token = req.headers['x-token'];
  // 
  // if (token) {
  // 	for (var i = 0; i < accessTokens.length; i++) {
  // 		
  // 		if (accessTokens[i].token == token) {
  // 			next();
  // 			return;
  // 		}
  // 	};
  // 	fail();
  // } else {
  // 	fail();
  // }
  // 
  // function fail() {
  // 	res.status(401).send('Unauthorised');
  // }
	
});

module.exports = router;
