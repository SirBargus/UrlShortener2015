var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    should = require('should');

var urlTest = "http://google.es";
var json = "";
//Base test
describe('#User Test', function(){
    //Create a new user
    it('Create user', function(done){
        this.timeout(30000);
        request(app)
            .post('/signup')
            .send({"username": "dummy", "password": "dummy", "rol": "USER"})
            .expect(302)
            .end(function(err, res){
                res.header['location'].should.equal('/');
                done();
            });
    }),
    //Login user
    it('Login user', function(done){
        this.timeout(30000);
        request(app)
            .post('/login')
            .send({"username": "dummy", "password": "dummy"})
            .expect(302)
            .end(function(err, res){
                res.header['location'].should.equal('/');
                done();
            });
    }),
    after(function(done){
        ddbb.removeUserLocal({"username": "dummy", "password": "dummy"}, function(err, res){
            if (err) throw err;
            else done()
        });
    })
});
