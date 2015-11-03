//app.js

//modules
var app = require('express')(),
    bodyParser = require('body-parser'),
    config = require('./config/conf'),
    fs = require('fs');

//Config express
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
require('./controllers/base.js')(app);

var http = require('http').Server(app),
    io = require('socket.io')(http);

//Init server
http.listen(config.port, function(){
//    console.log("Magic happens on port: " + config.port);
});
module.exports = http;
