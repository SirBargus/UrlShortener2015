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
        ddbbUri.find(req.params.shortUrl, function(err, result){
            if (err != null && con.log == true) console.error("Error: " + err);
            if (err == null && result != null){
                res.json(result);
            }
            else res.sendStatus(401);
        });
    }),
        //Los dos siguientes gets, se diferencian por angular
        //get statistics in json
        app.get(conf.api.uri + "/:shortUrl" + "+.json", function(req, res){
            if (conf.log == true) console.log("Input Conex: " + req);
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
            //req.param is deprecated, cant use string to access information
            ddbbUri.findOne(req.params.shortUrl, function(err, result){
                if (err != null && con.log == true) console.error("Error: " + err);
                if (err == null && result != null){
                    res.send(htmlHeader+result.toString+htmlEnd);
                    res.json(result);
                }
                else res.sendStatus(401);
            });
        }),

        app.get(conf.api.stats, function (req,res){
            queryStatistics(req,res);
        })



}

var htmlHeader = "<html><title>HTML</title><body>";
var htmlEnd = "</body></html>";

function queryStatistics(req,res){
    if (req.body.all != null){
        ddbbUri.findStats(function(err,result){
            if (err) throw  err;
            res.send(result);
        });
    }
    else if (req.body.before != null){
        ddbbUri.findStatsBefore(function(err,result){
            if (err) throw  err;
            res.send(result);
        });
    }else if (req.body.after != null){
        ddbbUri.findStatsAfter(function(err,result){
            if (err) throw  err;
            res.send(result);
        });
    }else if (req.body.both != null){
        ddbbUri.findStatsBetween(function(err,result){
            if (err) throw  err;
            res.send(result);
        });
    }
}
