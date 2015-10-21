//urlshortener.js

var shortdb = require('../models/shortUrlDB.js');

module.exports = function(app){

    //URL

    //Pedir Url
    app.get('/api/v1/URL/', function(req, res){
      shortdb.FetchURI();
      //res.redirect(search[0].target_);
      res.sendStatus(404);
    }),

    //Crear URL
    app.post('/api/v1/URL/', function(req, res){
        shortdb.FetchURI();
        res.sendStatus(404);
    })

}
