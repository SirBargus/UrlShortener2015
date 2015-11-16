//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    crypto = require('crypto'),
    http = require('http'),
    vCard = require('vcards-js'),
    urlencode = require('urlencode'),
    fs = require('fs');

// File with only server's methods

module.exports = function(app){

    //Create a QR
    app.put(conf.api.qr, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        if (req.body.urlsource == undefined) {
            if (conf.log == true) console.error("Miss urlsource in json");
            res.sendStatus(400);
            return 0;
        }
        var urlShort = crypto.createHash('md5').update(req.body.urlsource).digest('hex');
        var json = {"urlShort": urlShort, "urlSource": req.body.urlsource};
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + "/" + urlShort;

        //Level of error
        if (req.body.err == true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
        else ext = conf.extern.qr;

        //Get QR imagec
        getQr(ext + urlShortComplete, json, res);
    }),
    //Create a qr with a VCARD
    app.put(conf.api.vcard, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        //Exist a urlsource
        if (req.body.urlsource == undefined) {
            if (conf.log == true) console.error("Miss urlsource in json");
            res.sendStatus(400);
            return 0;
        }
        var urlShort = crypto.createHash('md5').update(req.body.urlsource).digest('hex');
        var json = {"urlShort": urlShort, "urlSource": req.body.urlsource};
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + "/" + urlShort;

        //Level of error
        if (req.body.err == true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
        else ext = conf.extern.qr;

        //Create vCard
        vcard = vCard();
        //Json from VCard
        if (req.body.firstName != undefined) vcard.firstName = req.body.firstName;
        if (req.body.middleName != undefined) vcard.middleName = req.body.middleName;
        if (req.body.lastName != undefined) vcard.lastName = req.body.lastName;
        if (req.body.organization != undefined) vcard.organization = req.body.organization;
        if (req.body.photo != undefined) vcard.photo.attachFromUrl(req.body.photo);
        if (req.body.workPhone != undefined) vcard.workPhone = req.body.workPhone;
        if (req.body.birthday != undefined) vcard.birthday = req.body.birthday;
        if (req.body.title != undefined) vcard.title = req.body.title;
        vcard.url = urlShortComplete;


        //Create qR
        getQr(ext + urlencode(vcard.getFormattedString()), json, res);
    })
}

//Get qr from google service
function getQr(url, json, res){
    http.get(url, function(response){
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
       } else {
           if (conf.log == true) console.error("Error get to google api for qr");
           res.sendStatus(400);
       }

    }).on('error', function(e){
        if (conf.log == true) console.error("Got error: " + e.message);
        res.sendStatus(400);
    });
}
