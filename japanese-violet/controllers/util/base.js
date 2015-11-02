//base.js
var crypto = require('crypto'),
    dburi = require('../../models/shortUrlDB.js'),
    conf = require('../../config/conf');

module.exports = {
    postUrl: function(url, callback){
        var urlShort = crypto.createHash('md5').update(url).digest('hex');
        var json = {"urlShort": urlShort, "urlSource": url};
        dburi.add(json, function(err){
            if(err != null) callback(err, null);
            else callback(err, {"urlShort": "http://" + conf.ip + "/" + urlShort,
                "urlSource": url});
        });
    },

    getUrl: function(url, callback){
        dburi.find(url, function(err, res){
            if (err != null) callback(err, null);
            else callback(err, res);
        });
    }
};

