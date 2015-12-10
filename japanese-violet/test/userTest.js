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
        ddbb.addUser({"username": "dummy4", "password": "dummy4", "rol":"USUARIO"},
            function(err, result){
                if (err) throw err;
        });
        ddbb.add({"user": "dummy4", "urlSource": "1", "urlShort": "2"}, function(err, res){
            if (err) throw err;
        });
        ddbb.add({"user": "dummy4", "urlSource": "3", "urlShort": "4"}, function(err, res){
            if (err) throw err;
            else done();
        });
    }),
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
    it('Create multiples URIs with an user', function(done){
        this.timeout(30000);
        request(app)
            .get(conf.api.uriUser + "/dummy4")
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                if ((res.body[0].urlShort == 2 || res.body[0].urlShort == 4)
                    && (res.body[1].urlShort == 2 || res.body[1].urlShort == 4))
                    done();
            });
    }),
    //Takes url from dummy user
    //Delete database's info
    after(function(done){
        ddbb.removeUser({"username": "dummy", "password": "dummy"}, function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.removeUser({"username": "dummy2", "password": "dummy2"}, function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.removeUser({"username": "dummy4", "password": "dummy4"}, function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.remove("2", function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.remove("4", function(err){
            if(err) console.error("Error delete: " + err);
            done();
        });
    })
});
