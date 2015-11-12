var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    crypto = require('crypto'),
    should = require('should'),
    qrreader = require('qrcode-reader'),
    fs = require('fs'),
    png = require('png-js');

var urlTest = "http://google.es";
var urlShort = "http://" + conf.ip + ":" + conf.port + "/" 
    + crypto.createHash('md5').update(urlTest).digest('hex');
var urlIDShort = crypto.createHash('md5').update(urlTest).digest('hex');
var json = '';
var qrUrl = '';
//Base test
describe('#QR test', function(){
    //Get QR
    it('Get Qr', function(done){
        this.timeout(30000);
        request(app)
            .put(conf.api.qr)
            .send({"urlsource": urlTest})
            .expect(200)
            .end(function(err, res){
                json = res.body;
                done();
            });
    }),
    it('Qr is correct', function(done){
        //We need save qr, qr-reader modules are a shit
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
    })
});

