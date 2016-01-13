//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    shortid = require('shortid'),
    qr = require('../lib/fancyqr.js'),
    http = require('http'),
    vCard = require('vcards-js'),
    urlencode = require('urlencode'),
    geoip = require('geoip-lite');

// File with only server's methods
module.exports = function(app, passport){

    //A simple method to test if server is alive
    app.get(conf.api.up, function(req, res){
        res.sendStatus(200);
    }),
    /**
     * Redirect from :shortUrl to source url
     */
    app.get(conf.api.uri + "/:shortUrl", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        //geoip is synchronous
        var geo = geoip.lookup(req.query.ip);
        if (geo != null){
            var json = {"urlShort": req.params.shortUrl, "date": new Date(),
                "browser": req.query.browser, "ip": req.query.ip, "country": geo.country.toString(),
                "city": geo.city.toString()};
            //req.param is deprecated, cant use string to access information
            ddbbUri.click(req.params.shortUrl,json,function(err, result){
                if (err != null && conf.log == true) console.error("Error: " + err);
                if (err == null && result != null){
                    res.redirect(result.urlSource);
                }
                else res.sendStatus(401);
            });
        }else{
            res.sendStatus(401);
        }

    }),
    /*
     * Get all uris create by an User
     */
    app.get(conf.api.uriUser + "/:user", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        ddbbUri.findByUser(req.params.user, function(err, result){
            if (err != null && conf.log == true) console.error("Error: " + err);
            if (err == null && result != []){
                return res.send(result);
            }
            else return res.sendStatus(401);
        });
    }),
    /**
     * Create a short url
     * Format of body:
     * {
     *      urlSource: string,
     *      err: true or false,
     *      local: true or false(also null),
     *      errLevel: null or L or M or Q or H,
     *      color: {
     *          r: red color,
     *          g: green color,
     *          b: blue color
     *      },
     *      vcard: {
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
    app.put(conf.api.uri, function(req, res){
        if (conf.log === true) console.log("Input Conex: " + req);
        //Check user is authenticated
        if (req.user === undefined) return res.sendStatus(401);
        qr_(req, res);
    }),
    /*
     * Get the shorturi and return a qr
     */
    app.get(conf.api.qr + '/:id', function(req, res_){
        if (conf.log === true) console.log("Input Conex: " + req);
        ddbbUri.find(req.params.id, function(err, result){
            if (err != null && conf.log == true) console.error("Error: " + err);
            if (err == null && result != null){
                //Send image to show into an user
                res_.writeHead(200, {'Content-Type': 'image/png' });
                res_.end(result.qr, 'binary');
                //ddbbUri.increase(json,function(err, result){}); //Cambiar por una al probar
            }
            else return res_.sendStatus(401);
        });
    }),
    /*
     * Delete a URI
     */
    app.delete(conf.api.uri + '/:id', function(req, res){
        if (conf.log === true) console.log("Input Conex: " + req);
        if (req.user === undefined) return res.sendStatus(401);
        if (req.user.rol === "ADMIN"){
            ddbbUri.remove(req.params.id, function(err){
                if (err) return res.sendStatus(401);
                else return res.sendStatus(200);
            });
        } else {
            ddbbUri.removeByUser({"urlShort": req.params.id, "user": req.user.id_}, function(err){
                if (err) return res.sendStatus(401);
                else return res.sendStatus(200);
            });
        }
    });
}


function qr_(req, res){
    //Level of error
    if (req.body.err === true) ext = conf.exter.qrErr + req.body.errLevel + "&chl=";
    else ext = conf.extern.qr;
    var geo = geoip.lookup(req.body.ip);
    if (geo == null){
        req.body.ip="undefined";
        req.body.country="undefined";
        req.body.city="undefined";
    }else{
        req.body.country = geo.country;
        req.body.city = geo.city;
    }
    var shortUrl_ = shortid.generate();
    var urlShortComplete = "http://" + conf.ip + ":" + conf.port + conf.api.uri + "/" + shortUrl_;
    var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_, "user": req.user.id_,"statistics":{"date":new Date(),
        "ip":req.body.ip, "country":req.body.country, "city":req.body.city, "browser":req.body.browser}};
    if (req.body.local === "true"){
        if (req.body.vcard === undefined) createQrLocal_(urlShortComplete, json, req, res);
        else{
            var vcard = createVcard(req.body.vcard, urlShortComplete);
            createQrLocal(urlencode(vcard.getFormattedString()), json, req, res);
        }
    } else{
        if (req.body.vcard === undefined) getQr(ext + urlShortComplete, json, res);
        else {
            var vcard = createVcard(req.body.vcard, urlShortComplete);
            //Create qR
            getQr(ext + urlencode(vcard.getFormattedString()), json, res);
        }
    }
}

//Get qr from google service
function getQr(url, json, res){
    http.get(url, function(response){
       if (response.statusCode === 200){
           var img = '';
           response.setEncoding('binary');
           //Get the image
           response.on('data', function(chunk){img += chunk;});
           //Finish img
           response.on('end', function(){
               //We transform png to buffer to save, mongo doesn't do it well
               json.qr = new Buffer(img, 'binary');
               ddbbUri.add(json, function(err, result){
                    json.urlqr = "http://" + conf.ip + ":" + conf.port
                        + conf.api.qr + "/" + json.urlShort;
                    json.urlShort = "http://" + conf.ip + ":" + conf.port
                        + conf.api.uri + "/" + json.urlShort;
                    if (err || result == {}) return res.sendStatus(400);
                    else return res.send(json);
               });
           });
       } else {
           if (conf.log === true) console.error("Error get to google api for qr");
           return res.sendStatus(400);
       }

    }).on('error', function(e){
        if (conf.log === true) console.error("Got error: " + e.message);
        return res.sendStatus(400);
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
    if (req.body.color !== undefined){
        if (req.body.color.r !== undefined) opt.r = req.body.color.r;
        if (req.body.color.g !== undefined) opt.g = req.body.color.g;
        if (req.body.color.b !== undefined) opt.b = req.body.color.b;
    }
    if (req.body.errLevel !== undefined) opt.err = errLevel[req.body.errLevel];
    //Logo from compani
    if(req.body.logo !== undefined) opt.logo = new Buffer(req.body.logo);

    qr.save(add, opt, function(err, buf){
        if (err) res.sendStatus(400);
        else {
            //We transform png to buffer to save, mongo doesn't do it well
            json.qr = new Buffer(buf);
            ddbbUri.add(json, function(err, result){
                json.urlqr = "http://" + conf.ip + ":" + conf.port
                     + conf.api.qr + "/" + json.urlShort;
                json.urlShort = "http://" + conf.ip + ":" + conf.port
                     + conf.api.uri + "/" + json.urlShort;
                if (err || result === {}) return res.sendStatus(400);
                else return res.send(json);
            });
        }
    });
}
