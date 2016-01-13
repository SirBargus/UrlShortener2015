 var conf = require('../config/conf'),
     request = require('supertest'),
     express = require('express'),
     app = require('../app'),
     ddbb = require('../models/shortUrlDB.js'),
     should = require('should');

 var urlTest = "http://google.es";
 var json = "";
 var agent = request.agent(app);
 //Statistics test
 describe('#Statistics Test', function(){
     before(function(done){
         this.timeout(3000);
         agent.post(conf.api.signup_local)
             .send({"username": "dummy", "password": "dummy", "rol": "USER"})
             .expect(302);
         agent.post(conf.api.signup_local)
             .send({"username": "dummy2", "password": "dummy2", "rol": "USER"})
             .expect(302);

         ddbb.add({"user": "dummy", "urlSource": "1", "urlShort": "2", "statistics.total":0}, function(err, res){
             if (err) throw err;
         });
         ddbb.add({"user": "dummy2", "urlSource": "3", "urlShort": "4", "statistics.date":"Tue Dec 15 2015 03:04:05 GMT+0100 (CET)"}, function (err,res){
             if (err) throw err;
             else done();
         });
     }),

     it('Check that the click count is generated to 0', function(done){
         this.timeout(30000);
         request(app)
             .get(conf.api.uriUser + "/dummy2")
             .expect(200)
             .end(function(err,res){
                 if(err) throw err;
                 if((res.body[0].statistics.total == 0)) done();
             });
     }),

     it('Check that the statistics are generated', function(done){
         this.timeout(30000);
         agent
             .get(conf.api.uri + "/6"+"?ip=83.138.246.86&browser=Chrome")
             .expect(302)
             .end(function (err1, res1){
                 agent
                     .get(conf.api.uri + "/2"+"+")
                     .end(function (err2, res2){
                         if(err2) throw err;


                 })


             })
         request(app)
             .get(conf.api.uriUser + "/dummy2")
             .expect(200)
             .end(function(err,res){
                 if(err) throw err;
                 if((res.body[0].statistics.total == 0)) done();
             });
     }),

         it('Check that the click count increase', function(done){
         this.timeout(30000);
         request(app)
             .get(conf.api.uri + "/2"+"?ip=83.138.246.86&browser=Chrome")
             .end(function(a,b){
             request(app)
                 .get(conf.api.uriUser + "/dummy")
                 .expect(200)
                 .end(function(err1,res){
                     if(err1) throw err;
                     if(res.body[0].statistics.total == 1) done();
                     else throw err;
                 });
         });
     }),



     //it('Check that the date is older and well formatted', function(done){
     //   this.timeout(30000);
     //    request(app)
     //        .get(conf.api.uriUser + "/dummy")
     //        .expect(200)
     //        .end(function(err,res){
     //            if(err) throw err;
     //            var date = new Date();
     //            var isDate = new Date(res.body[0].statistics.date);
     //            if(isDate.getTime() < date.getTime()) done();
     //            else throw err;
     //        });
     //}),

     after(function(done){

         ddbb.remove("2", function(err){
             if(err) console.error("Error delete: " + err);
         });
         ddbb.remove("4", function(err){
             if(err) console.error("Error delete: " + err);
         });
         ddbb.removeUserLocal({"username": "dummy2", "password": "dummy2"}, function(err){
             if(err) console.error("Error delete: " + err);
         });
         ddbb.removeUserLocal({"username": "dummy", "password": "dummy"}, function(err){
             if(err) console.error("Error delete: " + err);
             else done();
         });
     })
 });
