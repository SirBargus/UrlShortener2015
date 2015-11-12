//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    crypto = require('crypto'),
    http = require('http');

// File with only server's methods

module.exports = function(app){

    //postUrl
    app.post(conf.api.creqteQr, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        var urlShort = crypto.createHash('md5').update(req.body.urlsource).digest('hex');
        var json = {"urlShort": urlShort, "urlSource": req.body.urlsource};
        var urlShortComplete = "http://" + conf.ip + "/" + urlShort;
        console.log("ASDFADFADFADFADFAFD");

        //Get QR image
        http.get(conf.extern.qr + urlShortComplete, function(res){
           if (res.statusCode == 200){
               var img = '';
               res.setEncoding('binary');
               //Get the image
               res.on('data', function(chunk){
                   img += chunk;
               });
               //Finish img
               res.on('end', function(){
                   json.qr = img;
                   ddbbUri.add(json);
                   console.log(json);
                   res.send(json);
               });
           } else res.sendStatus(400);
           
        }).on('error', function(e){
            if (conf.log == true) console.error("Got error: " + e.message);
        });
    })
}
