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

    //getUrl
    app.get(confUrl.base.getUri.url + ":" + confUrl.base.getUri.value, function(req, res){
        if (config.log == true) console.log("Input Conex: " + req);
        //req.param is deprecated, cant use string to access information
        base.getUrl(req.params.shortUrl, function(err, result){
            if (err != null && config.log == true) console.error("Error: " + err); 
            if (err == null && result != null) res.redirect(result.urlSource);
            else res.sendStatus(401);
        });
    }),
    //postUrl
    app.post(confUrl.base.createUri, function(req, res){
        if (config.log == true) console.log("Input Conex: " + req);
        base.postUrl(req.body.urlsource, function(err, result){
            if (err != null && config.log == true) console.error("Error: " + err);
            if (err == null && result != null) res.send(result);
            else res.sendStatus(400);
        });
    })
}
