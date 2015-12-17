//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    shortid = require('shortid'),
    fs = require('fs'),
    cool = require('cool-ascii-faces');

// File with statistics methods
module.exports = function(app){

    //getUrl statistics
    app.get(conf.api.uri + "/:shortUrl" + "+", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        var json = {"urlShort": req.params.shortUrl};
        //req.param is deprecated, cant use string to access information
        ddbbUri.findOne(req.params.shortUrl, function(err, result){
            if (err != null && con.log == true) console.error("Error: " + err);
            if (err == null && result != null){
                res.json(result);
            }
            else res.sendStatus(401);
        });
    }),

        //get statistics in json
        app.get(conf.api.uri + "/:shortUrl" + "+.json", function(req, res){
            if (conf.log == true) console.log("Input Conex: " + req);
            var json = {"urlShort": req.params.shortUrl};
            //req.param is deprecated, cant use string to access information
            ddbbUri.findOne(req.params.shortUrl, function(err, result){
                if (err != null && con.log == true) console.error("Error: " + err);
                if (err == null && result != null){
                    res.json(result);
                }
                else res.sendStatus(401);
            });
        }),

        //get statistics in html
        app.get(conf.api.uri + "/:shortUrl" + "+.html", function(req, res){
            if (conf.log == true) console.log("Input Conex: " + req);
            var json = {"urlShort": req.params.shortUrl};
            //req.param is deprecated, cant use string to access information
            ddbbUri.findOne(req.params.shortUrl, function(err, result){
                if (err != null && con.log == true) console.error("Error: " + err);
                if (err == null && result != null){

                    var path = result.urlSource +".html";
                    var stream = fs.createWriteStream(path);
                    stream.once('open',function(fd){
                        var html ="<!DOCTYPE html><html><head><title>URI statistics</title>" +
                            "</head><body>" + result + "</body></html>";
                        stream.end(html);
                    });
                    res.redirect(path);
                }
                else res.sendStatus(401);
            });
        })

}
