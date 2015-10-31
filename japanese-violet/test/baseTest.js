var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    confUrl = require('../config/confUrl');

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
            .send({"urlsource": "google.es"})
            .expect(200, done);
    })
});

