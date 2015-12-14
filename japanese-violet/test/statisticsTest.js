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
    before(function(done){
        ddbb.addUser({"username": "dummy", "password": "dummy", "rol":"USUARIO"},
            function(err, result){
                if (err) throw err;
            });
        ddbb.add({"user": "dummy", "urlSource": "1", "urlShort": "2", "statistics.click.count":0}, function(err, res){
            if (err) throw err;
        });
    }),

    it('Check that the click count increase', function(done){
        this.timeout(30000);
        request(app)
            .get(conf.api.uriUser + "/dummy")
            .expect(200)
            .end(function(err,res){
                if(err) throw err;
                if((res.body.statistics.click.count == 1)) done();
            });
    }),

    after(function(done){
        ddbb.removeUser({"username": "dummy", "password": "dummy"}, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    })
});
