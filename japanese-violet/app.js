//app.js

//modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config/conf'),
    fs = require('fs');

//Config express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Controller
require('./controllers/base.js')(app);
require('./controllers/qr.js')(app);
require('./controllers/users.js')(app);
require('./controllers/statistics.js')(app);

var http = require('http').Server(app),
    io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
//Init server
http.listen(config.port, function(){
    var date = new Date();
    console.log(date);
    date.getMinutes();
    console.log("Magic happens on port: " + config.port);
});
module.exports = http;
