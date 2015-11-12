var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    crypto = require('crypto'),
    should = require('should');

var urlTest = "http://google.es";
var urlShort = crypto.createHash('md5').update(urlTest).digest('hex');
//Base test
describe('#Base test', function(){
    //Get QR
    it('Get Qr', function(done){
        request(app)
            .post(conf.api.createQr)
            .send({"urlsource": urlTest})
            .expect(200, done);
        done();
    }),
    //Delete database's info
    after(function(done){
        ddbb.remove(urlShort, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    })
});

