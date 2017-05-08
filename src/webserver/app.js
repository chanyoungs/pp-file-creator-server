const path = require('path');

// express
const express = require('express');
const app = express()

// routes
const api = require('./routes/api/api')

// disable powered by express
app.disable('x-powered-by')

// api
app.use('/api/v1', api)

app.get('*', (req, res) => {
	return res.send('not found');
})

module.exports = app;