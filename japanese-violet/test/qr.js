var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    crypto = require('crypto'),
    should = require('should'),
    qrreader = require('qrcode-reader'),
    fs = require('fs'),
    png = require('png-js'),
    vcardparse = require('vcard');

var urlTest = "http://www.nyan.cat";
var urlShort = "http://" + conf.ip + ":" + conf.port + "/"
    + crypto.createHash('md5').update(urlTest).digest('hex');
var urlIDShort = crypto.createHash('md5').update(urlTest).digest('hex');
var json = '';
var qrUrl = '';
var jsonVcard = {"firstName": "dummy","middleName": "dummy","lastName": "dummy",
    "organization": "dummy","photo": "https://pbs.twimg.com/profile_images/1620149654/avatar.jpg",
    "workPhone": "123","birthday":new Date("14-03-1994"),"title":"dummy","urlsource":urlTest};
//Base test
describe('#QR test', function(){
    //Get QR
    it('Get Qr', function(done){
        request(app)
            .put(conf.api.qr)
            .send({"urlsource": urlTest, "qrErr": true })
            .expect(200)
            .end(function(err, res){
                json = res.body;
                done();
            });
    }),
    it('Qr is correct', function(done){
        //We need save qr, qr-reader modules are shit
        fs.writeFileSync('test.png', json.qr, 'binary');
        c = fs.readFileSync('test.png');
        var p = new png(c);
        p.decode(function(data){
            var qrr = new qrreader();
            qrr.callback = function(result){
                //url short redirect to urlsource, test in base.js
                qrUrl = result;
                result.should.equal(urlShort);
            }
            qrr.decode(p, data);
            fs.unlinkSync('test.png');
            done();
        });
    }),
    it('QR Url is correct', function(done){
        request(app)
            .get(conf.api.uri + '/' + urlIDShort)
            .expect(302)
            .end(function(err, res){
                if(err) throw err;
                res.header['location'].should.equal(urlTest);
                done();
            });
    }),
    //Delete database's info
    after(function(done){
        ddbb.remove(urlIDShort, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    }),
    it('Get Qr with error_correction_level', function(done){
        request(app)
            .put(conf.api.qr)
            .send({"urlsource": urlTest, "qrErr": true, "errLevel": "H" })
            .expect(200)
            .end(function(err, res){
                json = res.body;
                done();
            });
    }),
    it('Qr with errors is correct', function(done){
        //We need save qr, qr-reader modules are a shit
        var c = fs.readFileSync('./test/qr-error.png');
        var p = new png(c);
        p.decode(function(data){
            var qrr = new qrreader();
            qrr.callback = function(result){
                //url short redirect to urlsource, test in base.js
                result.should.equal(urlShort);
                done();
            }
            qrr.decode(p, data);
        });
    }),
    //Delete database's info
    after(function(done){
        ddbb.remove(urlIDShort, function(err){
            if (err) console.error("Error delete: " + err);
            else done();
        });
    }),
    it('Get Qr with vcard', function(done){
        request(app)
            .put(conf.api.vcard)
            .send(jsonVcard)
            .expect(200)
            .end(function(err, res){
                json = res.body;
                done();
            });
    }),
    after(function(done){
        ddbb.remove(urlIDShort, function(err){
            if (err) console.error("Error delete: " + err);
            else done();
        });
    })
});
