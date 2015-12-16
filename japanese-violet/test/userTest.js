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
            .expect(302, done)
    }),
    after(function(done){
        ddbb.removeUser({"username": "dummy", "password": "dummy"}, function(err, res){
            if (err) throw err;
            else done()
        });
    })
});
