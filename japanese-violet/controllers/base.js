//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    crypto = require('crypto');

// File with only server's methods

module.exports = function(app){

    //A simple method to test if server is alive
    app.get(conf.api.up, function(req, res){
        res.sendStatus(200);
    }),
    //getUrl
    app.get(conf.api.getUri + "/:shortUrl", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        //req.param is deprecated, cant use string to access information
        ddbbUri.find(req.params.shortUrl, function(err, result){
            if (err != null && con.log == true) console.error("Error: " + err); 
            if (err == null && result != null) res.redirect(result.urlSource);
            else res.sendStatus(401);
        });
    }),
    //postUrl
    app.post(conf.api.createUri, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        var urlShort = crypto.createHash('md5').update(req.body.urlsource).digest('hex');
        var json = {"urlShort": urlShort, "urlSource": req.body.urlsource};
        ddbbUri.add(json, function(err, result){
            if (err != null && conf.log == true) console.error("Error: " + err);
            if (err == null) res.send({"urlShort": "http://" + conf.ip + "/" + urlShort,
                "urlSource": req.body.urlsource});
            else res.sendStatus(400);
        });
    })
}
