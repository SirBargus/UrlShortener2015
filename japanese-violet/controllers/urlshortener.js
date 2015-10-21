//urlshortener.js

var clickdb = require('../models/clickDB.js');
var shortdb = require('../models/shortUrlDB.js');
var validUrl = require('valid-url');
var HttpStatus = require('http-status');
var crypto = require('crypto');

module.exports = function(app){

    //get
    app.get('/*', function(req, res){
        var search = shortdb.findByHash(req.originalUrl.substring(1));
        if (search.length > 0){
            var cl = {"hash": req.originalUrl.substring(1), "created": Date.now(),
                "referrer": undefined, "browser": undefined, "platform": undefined,
                "ip": req.connection.remoteAddress, "country": undefined};
            clickdb.add(cl);
            res.redirect(search[0].target_);
        } else{
            res.sendStatus(404);
        }
    }),
        
    //post
    app.post('/link', function(req, res){
        if (validUrl.isUri(req.body.url)){
            var hash = crypto.createHash('md5').update(req.body.url).digest("hex");
            //Info for db
            var su = { "hash": hash, "target": req.body.url, 
               "uri": "http://" + req.get('host') + "/" + hash, 
               "sponsor": req.body.sponsor, "created": Date.now(), "safe": true, 
               "ip": req.connection.remoteAddress, "country": undefined, 
               "mode": HttpStatus.TEMPORARY_REDIRECT, "owner": req.body.brand};
            shortdb.add(su);
            //Message to client
            var resDummy = {"hash": su.hash, "target": req.body.url,
                "uri": su.uri, "created": new Date(su.created).toISOString().
                        replace(/T/, ' ').replace(/\..+/, ''), "owner": su.owner,
                "mode": su.mode};
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resDummy));
        } else{
            res.sendStatus(400);
        }
    })
}

