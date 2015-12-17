//app.js

//modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config/conf'),
    passport = require('passport'),
    cookieParser = require('cookie-parser');

require('./lib/passport')(passport); // pass passport for configuration

//Config express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Config passport
app.use(cookieParser());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//Websockets
var http = require('http').Server(app),
    io = require('socket.io')(http);

//Controller
require('./controllers/base.js')(app, passport);
require('./controllers/users.js')(app, passport);
require('./controllers/statistics.js')(app);

app.use(express.static(__dirname + '/public'));
//Init server
http.listen(config.port, function(){
    console.log("Magic happens on port: " + config.port);
});
module.exports = http;
