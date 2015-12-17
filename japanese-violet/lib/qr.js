//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    qr = require('./fancyqr.js'),
    shortid = require('shortid'),
    http = require('http'),
    vCard = require('vcards-js'),
    urlencode = require('urlencode');
module.exports = {

    /**
     * Create a QR
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      errLevel: null or L or M or Q or H,
     * }
     */
    createQrOnline: function(req, res){
        //Level of error
        if (req.body.err == true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
        else ext = conf.extern.qr;

        var shortUrl_ = shortid.generate();
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_};
        //Get QR imagec
        getQr(ext + urlShortComplete, json, res);
    },
    /**
     * Create a qr with a VCARD
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      errLevel: null or L or M or Q or H,
     *      vcard {
     *          firstName: null or string,
     *          lastName: null or string,
     *          organization: null or string,
     *          photo: null or url,
     *          workPhone: null or string,
     *          birthday: null or string,
     *          title: null or string
     *      }
     * }
     */
    createQrOnlineVcard: function(req, res){
        //Level of error
        if (req.body.err == true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
        else ext = conf.extern.qr;

        var shortUrl_ = shortid.generate();
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_};
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;
        var vcard = createVcard(req.body.vcard, urlShortComplete);

        //Create qR
        getQr(ext + urlencode(vcard.getFormattedString()), json, res);
    },
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
    createQrLocal: function(req,res){
        var shortUrl_ = shortid.generate();
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_};
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;

        createQrLocal_(urlShortComplete, json, req, res);
    },
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
     *      vcard {
     *          firstName: null or string,
     *          lastName: null or string,
     *          organization: null or string,
     *          photo: null or url,
     *          workPhone: null or string,
     *          birthday: null or string,
     *          title: null or string
     *      },
     *      logo: null or buffer with logo (max 30x30 pixels)
     * }
     */
    createQrLocalVcard: function(req,res){
        var shortUrl_ = shortid.generate();
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_};
        var urlShortComplete = "http://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;

        var vcard = createVcard(req.body.vcard, urlShortComplete);

        createQrLocal(urlencode(vcard.getFormattedString()), json, req, res);
    }
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
                    json.urlqr = "http://" + conf.ip + ":" + conf.port
                        + conf.api.qr + "/" + json.urlShort;
                    json.urlShort = "http://" + conf.ip + ":" + conf.port
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
    if (req.firstName !== undefined) vcard.firstName = req.firstName;
    if (req.lastName !== undefined) vcard.lastName = req.lastName;
    if (req.organization !== undefined) vcard.organization = req.organization;
    if (req.photo !== undefined) vcard.photo.attachFromUrl(req.photo);
    if (req.workPhone !== undefined) vcard.workPhone = req.workPhone;
    if (req.birthday !== undefined) vcard.birthday = req.birthday;
    if (req.title !== undefined) vcard.title = req.title;

    vcard.url = urlShortComplete;

    return vcard;
}

//Create a qrlocal
function createQrLocal_(add, json, req, res){
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
                json.urlqr = "http://" + conf.ip + ":" + conf.port
                     + conf.api.qr + "/" + json.urlShort;
                json.urlShort = "http://" + conf.ip + ":" + conf.port
                     + conf.api.uri + "/" + json.urlShort;
                if (err || result == {}) res.sendStatus(400);
                else res.send(json);
            });
        }
    });
}
