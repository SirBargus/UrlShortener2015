//app.js

//modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Config file
var config = require('./config/conf');

//Config express
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//Configure routes/controllers
require('./controllers/urlshortener')(app)

//Init server
app.listen(config.port);
console.log("Magic happens on port: " + config.port);
