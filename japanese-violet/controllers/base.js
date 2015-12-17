//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    shortid = require('shortid'),
    cool = require('cool-ascii-faces');

// File with only server's methods
module.exports = function(app){

    //A simple method to test if server is alive
    app.get(conf.api.up, function(req, res){
        res.sendStatus(200);
    }),
    //getUrl
    app.get(conf.api.uri + "/:shortUrl", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        //geoip is synchronous
        var geo = geoip.lookup(req.body.ip,function(){
                var json = {"urlShort": req.params.shortUrl, "date": new Date(),
                    "browser": req.body.browser, "ip": req.body.ip, "country": geo.country,
                    "city": geo.city};
                //req.param is deprecated, cant use string to access information
                ddbbUri.find(req.params.shortUrl, function(err, result){
                    if (err != null && con.log == true) console.error("Error: " + err);
                    if (err == null && result != null){
                        res.redirect(result.urlSource);
                    }
                    else res.sendStatus(401);
                });
            });
    }),
    //getUrlByUsers
    app.get(conf.api.uriUser + "/:user", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        ddbbUri.findByUser(req.params.user, function(err, result){
            if (err != null && con.log == true) console.error("Error: " + err);
            if (err == null && result != []){
                res.send(result);
            }
            else res.sendStatus(401);
        });
    }),
    //postUrl
    app.post(conf.api.uri, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        var shortUrl_ = shortid.generate();
        //Comprueba el usuario
        if(req.body.user == '') res.sendStatus(400);

        //Crea el la url
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_,
            "user": req.body.user, "pass": req.body.pass};
        ddbbUri.add(json, function(err, result){
            if (err != null && conf.log == true) console.error("Error: " + err);
            if (err == null && result != {}){
                res.send({
                    "urlShort": "http://" + conf.ip + ":" + conf.port +
                        conf.api.uri + "/" + shortUrl_,
                    "urlSource": req.body.urlsource
                });
            }
            else res.sendStatus(400);
        });
    }),
    //Be cool my friend
    app.get(conf.api.cool, function(req, res){
        res.send(cool());
    })
}
