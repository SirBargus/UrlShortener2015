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
    it('Create short uri with rol equal to USUARIO', function(done){
        this.timeout(30000);
        request(app)
            .post(conf.api.createUser)
            .send({"username": "dummy", "password": "dummy", "rol":"USUARIO"})
            .expect(200, done)
    }),
    //Create a new user
    it('Create short uri with rol equal to ADMIN', function(done){
        this.timeout(30000);
        request(app)
            .post(conf.api.createUser)
            .send({"username": "dummy2", "password": "dummy2", "rol":"ADMIN"})
            .expect(200, done)
    }),
    //Create a new user
    it('Create short uri with rol equal to BATMAN', function(done){
        this.timeout(30000);
        request(app)
            .post(conf.api.createUser)
            .send({"username": "dummy3", "password": "dummy3", "rol":"BATMAN"})
            .expect(400, done)
    }),
    //Delete database's info
    after(function(done){
        ddbb.removeUser({"username": "dummy", "password": "dummy"}, function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.removeUser({"username": "dummy2", "password": "dummy2"}, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    })
});
