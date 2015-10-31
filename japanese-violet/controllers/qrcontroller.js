var http = require('http'),
    apiUrl = require('../config/apiUrl.json');

var json = { "shortUrl": "google" };

http.get(apiUrl.qr.url + apiUrl.qr.opt + json.shortUrl, function(res){
    console.log(res);
});
