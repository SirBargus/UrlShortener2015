//route.js
var ddbbUri = require('../models/shortUrlDB.js'),
    conf = require('../config/conf'),
    qr = require('../lib/qr.js'),
    shortid = require('shortid');

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
    /*
     * Get all uris create by an User
     */
    app.get(conf.api.uriUser + "/:user", function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        ddbbUri.findByUser(req.params.user, function(err, result){
            if (err != null && con.log == true) console.error("Error: " + err);
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
        //Generate id rom a shortUrl
        var shortUrl_ = shortid.generate();
        if (req.body.urlsource === undefined) return res.sendStatus(401);

        //Crea el la url
        var json = {"urlSource": req.body.urlsource, "urlShort": shortUrl_};

        //Qr request for local
        if (req.body.local === "true"){
            //Qr local without vcard
            if (req.body.vcard === undefined) qr.createQrLocal(req, res);
            else qr.createQrLocalVcard(req, res);
        } else{
            if (req.body.vcard === undefined) qr.createQrOnline(req, res);
            else qr.createQrOnlineVcard(req, res);
        }
    })
}
