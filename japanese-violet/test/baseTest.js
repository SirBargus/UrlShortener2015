var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    confUrl = require('../config/confUrl'),
    ddbb = require('../models/shortUrlDB.js'),
    crypto = require('crypto'),
    should = require('should');

var urlTest = "http://google.es";
var urlShort = crypto.createHash('md5').update(urlTest).digest('hex');
//Base test
describe('#Base test', function(){
    //Is alive
    it('Is server alive?', function(done){
        request(app)
            .get(confUrl.base.up)
            .expect(200, done);
    }),
    //Create a new short url
    it('Create short uri', function(done){
        request(app)
            .post(confUrl.base.createUri)
            .send({"urlsource": urlTest})
            .expect(200, done);
    }),
    it('Get short uri', function(done){
        request(app)
            .get(confUrl.base.getUri.url + urlShort)
            .expect(302)
            .end(function(err, res){
                if (err) throw err;
                res.header['location'].should.equal(urlTest);
                done();
            });
    }),
    //Delete database's info
    after(function(done){
        ddbb.remove(urlShort, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    })
});
