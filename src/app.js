const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Database connection
require('./dbs/mongo');

// Router
app.use('/', require('./routers/index'));


module.exports = app;
