//urlshortener.js

var shortdb = require('../models/shortUrlDB.js');

module.exports = function(app){

    //URL

    //Pedir Url
    app.get('/api/v1/URL/:shorturi', function(req, res){
    var result =  shortdb.FetchURI(shorturi);
      if (result == null){
        res.sendStatus(401);
      }else {
        res.redirect(result);
        //res.redirect(search[0].target_);
      }
    }),

    //Crear URL
    app.post('/api/v1/URL/:uri', function(req, res){
        var result = shortdb.FetchURI(uri);
        //Gatitos
    })

}
