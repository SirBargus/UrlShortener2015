var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    should = require('should');

var urlTest = "http://google.es";
var json = "";
//Base test
describe('#Statistics Test', function(){
    before(function(done){
        ddbb.addUser({"username": "dummy", "password": "dummy", "rol":"USUARIO"},
            function(err, result){
                if (err) throw err;
            });
        ddbb.add({"user": "dummy", "urlSource": "1", "urlShort": "2", "statistics.click.count":0}, function(err, res){
            if (err) throw err;
        });
        ddbb.add({"user": "dummy", "urlSource": "3", "urlShort": "4", "statistics.created":"Tue Dec 15 2015 03:04:05 GMT+0100 (CET)"}, function (err,res){
            if (err) throw err;
            else done();
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

    it('Check that the date is older and well formatted', function(done){
       this.timmeout(30000);
        request(app)
            .get(conf.api.uriUser + "/dummy")
            .expect(200)
            .end(function(err,res){
                if(err) throw err;
                var date = new Date();
                if(res.body.statistics.created.getTime()<date.getTime) done();
            });
    }),

    after(function(done){

        ddbb.remove("2", function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.remove("4", function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.removeUser({"username": "dummy", "password": "dummy"}, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    })
});
