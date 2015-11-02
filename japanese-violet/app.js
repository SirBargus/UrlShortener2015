//app.js

//modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

//Config file
var config = require('./config/conf');

//Config express
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//Configure routes/controllers
require('./controllers/route')(app)

var http = require('http').Server(app),
    io = require('socket.io')(http);

//Init server
http.listen(config.port, function(){
//    console.log("Magic happens on port: " + config.port);
});
module.exports = http;
