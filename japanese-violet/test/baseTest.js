// var conf = require('../config/conf'),
//     request = require('supertest'),
//     express = require('express'),
//     app = require('../app'),
//     ddbb = require('../models/shortUrlDB.js'),
//     crypto = require('crypto'),
//     should = require('should');
//
// var urlTest = "http://google.es";
// var json = "";
// //Base test
// describe('#Base test', function(){
//     //Is alive
//     it('Is server alive?', function(done){
//         request(app)
//             .get(conf.api.up)
//             .expect(200, done);
//     }),
//     //Create a new short url
//     it('Create short uri', function(done){
//         this.timeout(30000);
//         request(app)
//             .put(conf.api.uri)
//             .send({"urlsource": urlTest})
//             .expect(200)
//             .end(function(err,res){
//                 if (err) throw err;
//                 json = res.body;
//                 done();
//             })
//     }),
//     it('Get short uri', function(done){
//         if (json.urlShort != undefined){
//             var url = json.urlShort.substring("http://".length + conf.ip.length +
//                 conf.port.length + 2, json.urlShort.length);
//             request(app)
//                 .get("/" + url)
//                 .expect(302)
//                 .end(function(err, res){
//                     if (err) throw err;
//                     res.header['location'].should.equal(urlTest);
//                     done();
//                 });
//         }
//     })
//     //Delete database's info
//     after(function(done){
//         //Take id from uri
//         var id = json.urlShort.substring("http://".length + conf.ip.length +
//             conf.port.length + conf.api.uri.length + 2, json.urlShort.length);
//         ddbb.remove(id, function(err){
//             if(err) console.error("Error delete: " + err);
//             else done();
//         });
//     })
// });
