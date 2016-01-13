var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    crypto = require('crypto'),
    should = require('should');

var urlTest = "http://google.es";
var json = "";
var agent = request.agent(app);
//Base test
describe('#Base test', function(){
    //Create a user
    before(function(done){
        this.timeout(3000);
        agent.post(conf.api.signup_local)
            .send({"username": "dummy", "password": "dummy", "rol": "USER"})
            .expect(302, done);
    }),
    //Is alive
    it('Is server alive?', function(done){
        request(app)
            .get(conf.api.up)
            .expect(200, done);
    }),
    //Create a new short url
    it('Create short uri', function(done){
        this.timeout(30000);
        agent.put(conf.api.uri)
            .send({"urlsource": urlTest})
            .expect(200)
            .end(function(err,res){
                if (err) throw err;
                json = res.body;
                done();
            })
    }),

    it('Uri is secure?', function(done){
        this.timeout(30000);
        ddbb.isSecure.secure
        .expect(true,done);
    }),
    
    it('Cant create short uri', function(done){
        this.timeout(30000);
        request(app)
            .put(conf.api.uri)
            .send({"urlsource": urlTest})
            .expect(401, done);
    }),
    //Get a short url
    it('Get short uri', function(done){
        if (json.urlShort != undefined){
            var url = json.urlShort.substring("http://".length + conf.ip.length +
                conf.port.length + 2, json.urlShort.length);
            request(app)
                .get("/" + url)
                .expect(302)
                .end(function(err, res){
                    if (err) throw err;
                    res.header['location'].should.equal(urlTest);
                    done();
                });
        }
    }),
    it('Delete Uri', function(done){
        if (json.urlShort != undefined){
            var url = json.urlShort.substring("http://".length + conf.ip.length +
                conf.port.length + 2 + conf.api.uri.length, json.urlShort.length);
            agent.delete(conf.api.uri + "/" + url)
                .expect(200, done);
        }
    }),
    //Delete database's info
    after(function(done){
        //Take id from uri
        ddbb.removeUserLocal({"username": "dummy", "password": "dummy"}, function(err, res){
            if (err) throw err;
            else done()
        });
    })
});
