var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    io = require('socket.io-client')
    ddbb = require('../models/shortUrlDB.js'),
    should = require('should');

var urlTest = "http://google.es";
var options = {traansports:['websocket'],'force new connection': true};
var agent = request.agent(app);
//var agent2 = request.agent(app);
//Statistics test
describe('#Statistics Test', function(){
    before(function(done){
        this.timeout(3000);
        agent.post(conf.api.signup_local)
            .send({"username": "dummy", "password": "dummy", "rol": "USER"})
            .expect(302, done);
    }),

    it('Check that the statistics are generated', function(done){
        this.timeout(30000);
        agent
            .put(conf.api.uri)
            .send({"urlSource":urlTest,"statistics":{"ip":"83.138.246.86"}})
            .end(function(err, res) {
                if(err) throw err;
                if (res.body.statistics.ip=="undefined") done();
            });
        }),

    it('Open websocket', function(done){
        this.timeout(2000);
        //Connect to server
        var client = io.connect("http://localhost:8080", options);
        var i = 0;
        client.on('connection', function(msg){
            i++;
            if (i == 1) done();
        });
    }),

    after(function(done){
        ddbb.removeUserLocal({"username": "dummy", "password": "dummy"}, function(err){
            if(err) console.error("Error delete: " + err);
        });
        ddbb.remove({}, function(err){
            if(err) console.error("Error delete: " + err);
            else done();
        });
    })
});
