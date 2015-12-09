//route.js
var ddbb = require('../models/shortUrlDB.js'),
    conf = require('../config/conf');

// File with only server's methods
module.exports = function(app){

    //postUrl
    app.post(conf.api.createUser, function(req, res){
        if (conf.log == true) console.log("Input Conex: " + req);
        if (req.body.rol != 'USUARIO' && req.body.rol != 'ADMIN') res.sendStatus(400);
        else{
            ddbb.addUser(req.body, function(err, result){
                if (err != null && conf.log == true) console.error("Error: " + err);
                if (err == null && result != {}) res.sendStatus(200);
                else res.sendStatus(400);
            });
        }
    })
}
