var conf = require('../config/conf'),
    request = require('supertest'),
    express = require('express'),
    app = require('../app'),
    ddbb = require('../models/shortUrlDB.js'),
    should = require('should'),
    qrreader = require('qrcode-reader'),
    fs = require('fs'),
    png = require('png-js'),
    vcardparse = require('vcardparser'),
    http = require('http');

var urlTest = "http://www.20minutos.es/";
var json = '';
var jsonVcard = {"vcard": {"firstName": "dummy","middleName": "dummy","lastName": "dummy",
    "organization": "dummy","photo": "https://pbs.twimg.com/profile_images/1620149654/avatar.jpg",
    "workPhone": "123", "birthday":new Date("14-03-1994"), "title":"dummy"},
    "urlsource": urlTest};
var idDelete = [];
var agent = request.agent(app);
//Base test
describe('#QR test', function(){
    before(function(done){
        this.timeout(3000);
        agent.post('/signup')
            .send({"username": "dummy", "password": "dummy", "rol": "USER"})
            .expect(302, done);
    }),
    //Get QR
    it('Get Qr', function(done){
        agent.put(conf.api.uri)
            .send({"urlsource": urlTest})
            .expect(200)
            .end(function(err, res){
                json = res.body;
                //Add id to delete after all test
                idDelete.push(json.urlShort.substring("http://".length + conf.ip.length +
                    conf.port.length + conf.api.uri.length + 1, json.urlShort.length));
                done();
            });
    }),
    it('Qr is correct', function(done){
        this.timeout(30000);
        if (json !== undefined){
            http.get(json.urlqr, function(res){
                var img = '';
                res.setEncoding('binary');

                res.on('data', function(chunk){
                    img += chunk;
                });
                res.on('end', function(){
                    fs.writeFileSync('test.png', img, 'binary');
                    c = fs.readFileSync('test.png');
                    var p = new png(c);
                    p.decode(function(data){
                        var qrr = new qrreader();
                        qrr.callback = function(result){
                            result.should.equal(json.urlShort);
                        }
                        qrr.decode(p, data);
                        fs.unlinkSync('test.png');
                        done();
                    });
                });
            });
        }
    }),
    it('QR Url is correct', function(done){
        //UrlShort id
        var id = json.urlShort.substring("http://".length + conf.ip.length +
            conf.port.length + conf.api.uri.length + 1, json.urlShort.length);
        request(app)
            .get(conf.api.uri + id)
            .expect(302)
            .end(function(err, res){
                if(err) throw err;
                res.header['location'].should.equal(urlTest);
                done();
            });
    })
    it('Get Qr with error_correction_level', function(done){
        json = '';
        agent.put(conf.api.uri)
            .send({"urlsource": urlTest, "qrErr": true, "errLevel": "H"})
            .expect(200)
            .end(function(err, res){
                json = res.body;
                //Add id to delete after all test
                idDelete.push(json.urlShort.substring("http://".length + conf.ip.length +
                    conf.port.length + conf.api.uri.length + 1, json.urlShort.length));
                done();
            });
    }),
    it('Get Qr with vcard', function(done){
        agent.put(conf.api.uri)
            .send(jsonVcard)
            .expect(200)
            .end(function(err, res){
                json = res.body;
                //Add id to delete after all test
                idDelete.push(json.urlShort.substring("http://".length + conf.ip.length +
                    conf.port.length + conf.api.uri.length + 1, json.urlShort.length));
                done();
            });
    }),
    it('vCard is correct', function(done){
        if (json !== undefined){
            http.get(json.urlqr, function(res){
                var img = '';
                res.setEncoding('binary');

                res.on('data', function(chunk){
                    img += chunk;
                });
                res.on('end', function(){
                    fs.writeFileSync('test.png', img, 'binary');
                    c = fs.readFileSync('test.png');
                    var p = new png(c);
                    p.decode(function(data){
                        var qrr = new qrreader();
                        qrr.callback = function(result){
                            vcardparse.parseString(result, function(err, json_){
                                if (err === null){
                                    json_.n.first.should.equal(jsonVcard.vcard.firstName);
                                    json_.n.last.should.equal(jsonVcard.vcard.lastName);
                                    json_.photo.value.should.equal(jsonVcard.vcard.photo);
                                    json_.tel[0].value.should.equal(jsonVcard.vcard.workPhone);
                                    json_.title.should.equal(jsonVcard.vcard.title);
                                    json_.org.name.should.equal(jsonVcard.vcard.organization);
                                    json_.url[0].value.should.equal(json.urlShort);
                                }
                            });
                        }
                        qrr.decode(p, data);
                        fs.unlinkSync('test.png');
                        done();
                    });
                });
            });
        }
    }),
    it('Get QrLocal', function(done){
        this.timeout(30000);
        var img = fs.readFileSync('./test/img/logo.png');
        var jsonlocal = {"urlsource": urlTest, "color":{"r": 137, "g": 127, "b": 38 },
            "logo": img, "local": "true"};
        agent.put(conf.api.uri)
            .send(jsonlocal)
            .expect(200)
            .end(function(err, res){
                json = '';
                json = res.body;
                //Add id to delete after all test
                idDelete.push(json.urlShort.substring("http://".length + conf.ip.length +
                    conf.port.length + conf.api.uri.length + 1, json.urlShort.length));
                done();
            });
    }),
    it('Qr local is correct', function(done){
        this.timeout(30000);
        if (json !== undefined){
            http.get(json.urlqr, function(res){
                var img = '';
                res.setEncoding('binary');

                res.on('data', function(chunk){
                    img += chunk;
                });
                res.on('end', function(){
                    fs.writeFileSync('test.png', img, 'binary');
                    c = fs.readFileSync('test.png');
                    var p = new png(c);
                    p.decode(function(data){
                        var qrr = new qrreader();
                        qrr.callback = function(result){
                            result.should.equal(json.urlShort);
                        }
                        qrr.decode(p, data);
                        fs.unlinkSync('test.png');
                        done();
                    });
                });
            });
        }
    }),
    it('Get QrLocal with vcard', function(done){
        this.timeout(30000);
        agent.put(conf.api.uri)
            .send(jsonVcard)
            .expect(200)
            .end(function(err, res){
                json = '';
                json = res.body;
                //Add id to delete after all test
                idDelete.push(json.urlShort.substring("http://".length + conf.ip.length +
                    conf.port.length + conf.api.uri.length + 1, json.urlShort.length));
                done();
            });
    }),
    it('vCard local is correct', function(done){
        if (json != undefined){
            //Transform the json.qr to buffer
            var img = new Buffer(json.qr);
            //We need save qr, qr-reader modules are shit
            fs.writeFileSync('test.png', img, 'binary');
            var c = fs.readFileSync('test.png');
            var p = new png(c);
            p.decode(function(data){
                var qrr = new qrreader();
                qrr.callback = function(result){
                    vcardparse.parseString(result, function(err, json_){
                        if (err === null){
                            json_.n.first.should.equal(jsonVcard.vcard.firstName);
                            json_.n.last.should.equal(jsonVcard.vcard.lastName);
                            json_.photo.value.should.equal(jsonVcard.vcard.photo);
                            json_.tel[0].value.should.equal(jsonVcard.vcard.workPhone);
                            json_.title.should.equal(jsonVcard.vcard.title);
                            json_.org.name.should.equal(jsonVcard.vcard.organization);
                            json_.url[0].value.should.equal(json.urlShort);
                        }
                    });
                }
                qrr.decode(p, data);
                fs.unlinkSync('test.png');
                done();
            });
        }
    }),
    after(function(done){
        for(var i in idDelete){
            ddbb.remove(idDelete[i], function(err){
                if(err) console.error("Error delete: " + err);
            });
        }
        ddbb.removeUserLocal({"username": "dummy", "password": "dummy"}, function(err, res){
            if (err) throw err;
            else done()
        });
    })
});
