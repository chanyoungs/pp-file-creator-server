const API_URL = 'https://www.familycentre.org.au/cfcapp/search/?json=true';
const REQUEST_CACHE_DIR = '/tmp/request-cache';


const router = require('express').Router();
const request = require('request');
const cachedRequest = require('cached-request')(request);
const STATUS = require('../../../status');

cachedRequest.setCacheDirectory(REQUEST_CACHE_DIR);

router.get('/', (req, res) => {

  let url = API_URL + '&' + 'v=' + encodeURI(req.query['v']) + '&ref=' + encodeURI(req.query['ref']);
  console.log(url);
  cachedRequest({
    url: url,
    ttl: 1440000
  }, (err, response, body) => {
    // console.log('e', err);
    // console.log('r', response);
    // console.log('b', body);
    if (err) { console.log(err); return res.status(STATUS.SERVER_ERROR).send(); }
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(STATUS.OK).send(body);
  })
})

module.exports = router;
