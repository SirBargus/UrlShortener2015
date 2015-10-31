//route.js
var base = require('./util/base.js'),
    config = require('../config/conf'),
    confUrl = require('../config/confUrl');

// File with only server's methods

module.exports = function(app){

    //A simple method to test if server is alive
    app.get(confUrl.base.up, function(req, res){
        res.sendStatus(200);
    })
/**
    //getUrl
    app.get('/api/v1/URL/:shorturi', function(req, res){
        if (config.log == true) Console.log("Input Conex: " + req);
        base.getUrl(shorturi, function(err, result){
            if (err != null && config.log == true) Console.error("Error: " + err); 
            if (err == null && result != null) res.redirect(result);
            else res.sendStatus(401);
        });
    }),
**/
    //postUrl
    app.post(confUrl.base.createUri, function(req, res){
        if (config.log == true) console.log("Input Conex: " + req);
        base.postUrl(req.body.urlsource, function(err, result){
            if (err != null && config.log == true) console.error("Error: " + err);
            if (result == null) res.sendStatus(400);
            else res.send(result);
        });
    })
}
