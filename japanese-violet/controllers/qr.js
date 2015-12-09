//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    qr = require('../lib/fancyqr.js'),
    shortid = require('shortid'),
    http = require('http'),
    vCard = require('vcards-js'),
    urlencode = require('urlencode'),
    fs = require('fs');

module.exports = function(app){

    /**
     * Create a QR
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      errLevel: null or L or M or Q or H,
     * }
     */
    app.put(conf.api.qr, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        if (req.body.urlsource == undefined) {
            if (conf.log == true) console.error("Miss urlsource in json");
            res.sendStatus(400);
            return 0;
        }
        //Comprueba el usuario
        if(req.body.user == '') res.sendStatus(400);

        //Level of error
        if (req.body.err == true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
        else ext = conf.extern.qr;

        var shortUrl_ = shortid.generate();
        var urlShortComplete = "htt://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_,
            "user": req.body.user, "pass": req.body.pass};
        //Get QR imagec
        getQr(ext + urlShortComplete, json, res);
    }),
    /**
     * Create a qr with a VCARD
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      errLevel: null or L or M or Q or H,
     *      firstName: null or string,
     *      lastName: null or string,
     *      organization: null or string,
     *      photo: null or url,
     *      workPhone: null or string,
     *      birthday: null or string,
     *      title: null or string
     * }
     */
    app.put(conf.api.vcard, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        //Exist a urlsource
        if (req.body.urlsource == undefined) {
            if (conf.log == true) console.error("Miss urlsource in json");
            res.sendStatus(400);
            return 0;
        }
        //Comprueba el usuario
        if(req.body.user == '') res.sendStatus(400);

        //Level of error
        if (req.body.err == true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
        else ext = conf.extern.qr;

        var shortUrl_ = shortid.generate();
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_,
             "user": req.body.user, "pass": req.body.pass};
        var urlShortComplete = "htt://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;

        var vcard = createVcard(req, urlShortComplete);

        //Create qR
        getQr(ext + urlencode(vcard.getFormattedString()), json, res);
    }),
    /**
     * Create a local qr
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      errLevel: null or L or M or Q or H,
     *      color: {
     *          r: red color,
     *          g: green color,
     *          b: blue color
     *      },
     *      logo: null or buffer with logo (max 30x30 pixels)
     * }
     */
    app.put(conf.api.qrlocal, function(req,res){
        //Our Qr local library only accept minium, medium high and max level or error
        var errLevel = {"L": "minium", "M": "medium","Q": "high", "H":"max"};
        if (conf.log == true) console.log("Input Conex: " + req);
        //Exist a urlsource
        if (req.body.urlsource == undefined) {
            if (conf.log == true) console.error("Miss urlsource in json");
            res.sendStatus(400);
            return 0;
        }
        //Comprueba el usuario
        if(req.body.user == '') res.sendStatus(400);

        var shortUrl_ = shortid.generate();
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_,
            "user": req.body.user, "pass": req.body.pass};
        var urlShortComplete = "htt://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;

        createQrLocal(urlShortComplete, json, req, res);
    }),
    /**
     * Create a local qr with vcard
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      errLevel: null or L or M or Q or H,
     *      color: {
     *          r: red color,
     *          g: green color,
     *          b: blue color
     *      },
     *      logo: null or buffer with logo (max 30x30 pixels)
     * }
     */
    app.put(conf.api.vcardlocal, function(req,res){
        if (conf.log == true) console.log("Input Conex: " + req);
        //Exist a urlsource
        if (req.body.urlsource == undefined) {
            if (conf.log == true) console.error("Miss urlsource in json");
            res.sendStatus(400);
            return 0;
        }
        //Comprueba el usuario
        if(req.body.user == '') res.sendStatus(400);

        var shortUrl_ = shortid.generate();
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_,
            "user": req.body.user, "pass": req.body.pass};
        var urlShortComplete = "htt://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;

        var vcard = createVcard(req, urlShortComplete);

        createQrLocal(urlencode(vcard.getFormattedString()), json, req, res);
    })
}

//Get qr from google service
function getQr(url, json, res){
    http.get(url, function(response){
       if (response.statusCode == 200){
           var img = '';
           response.setEncoding('binary');
           //Get the image
           response.on('data', function(chunk){img += chunk;});
           //Finish img
           response.on('end', function(){
               json.qr = img;
               ddbbUri.add(json, function(err, result){
                   delete json.pass;
                   json.urlShort = "htt://" + conf.ip + ":" + conf.port
                        + conf.api.uri + "/" + json.urlShort;
                   if (err || result == {}) res.sendStatus(400);
                   else res.send(json);
               });
           });
       } else {
           if (conf.log == true) console.error("Error get to google api for qr");
           res.sendStatus(400);
       }

    }).on('error', function(e){
        if (conf.log == true) console.error("Got error: " + e.message);
        res.sendStatus(400);
    });
};

//Create a vCard
function createVcard(req, urlShortComplete){
    //Create vCard
    vcard = vCard();
    //Json to VCard
    if (req.body.firstName != undefined) vcard.firstName = req.body.firstName;
    if (req.body.lastName != undefined) vcard.lastName = req.body.lastName;
    if (req.body.organization != undefined) vcard.organization = req.body.organization;
    if (req.body.photo != undefined) vcard.photo.attachFromUrl(req.body.photo);
    if (req.body.workPhone != undefined) vcard.workPhone = req.body.workPhone;
    if (req.body.birthday != undefined) vcard.birthday = req.body.birthday;
    if (req.body.title != undefined) vcard.title = req.body.title;
    vcard.url = urlShortComplete;

    return vcard;
}

//Create a qrlocal
function createQrLocal(add, json, req, res){
    //Our Qr local library only accept minium, medium high and max level or error
    var errLevel = {"L": "minium", "M": "medium","Q": "high", "H":"max"};
    var opt = {};
    //Create options for qr.save
    if (req.body.color != undefined){
        if (req.body.color.r != undefined) opt.r = req.body.color.r;
        if (req.body.color.g != undefined) opt.g = req.body.color.g;
        if (req.body.color.b != undefined) opt.b = req.body.color.b;
    }
    if (req.body.errLevel != undefined) opt.err = errLevel[req.body.errLevel];
    if(req.body.logo != undefined) opt.logo = new Buffer(req.body.logo);

    qr.save(add, opt, function(err, buf){
        if (err) res.sendStatus(400);
        else {
            ddbbUri.add(json, function(err, result){
                json.qr = buf;
                delete json.pass;
                json.urlShort = "htt://" + conf.ip + ":" + conf.port
                     + conf.api.uri + "/" + json.urlShort;
                if (err || result == {}) res.sendStatus(400);
                else res.send(json);
            });
        }
    });
}
