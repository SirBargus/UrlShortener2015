//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    crypto = require('crypto'),
    http = require('http');

// File with only server's methods

module.exports = function(app){

    //Create a QR
    app.put(conf.api.qr, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        if (req.body.urlsource == undefined) {
            res.sendStatus(400);
            return 0;
        }
        var urlShort = crypto.createHash('md5').update(req.body.urlsource).digest('hex');
        var json = {"urlShort": urlShort, "urlSource": req.body.urlsource};
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + "/" + urlShort;

        //Get QR image
        http.get(conf.extern.qr + urlShortComplete, function(response){
           if (response.statusCode == 200){
               var img = '';
               response.setEncoding('binary');
               //Get the image
               response.on('data', function(chunk){
                   img += chunk;
               });
               //Finish img
               response.on('end', function(){
                   json.qr = img;
                   ddbbUri.add(json);
                   res.send(json);
               });
           } else res.sendStatus(400);

        }).on('error', function(e){
            if (conf.log == true) console.error("Got error: " + e.message);
        });
    })
}
