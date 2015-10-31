//users.js

//Modelo de la BBDD para la tabla de usuarios
var mongoose = require('mongoose'),
    conf = require('../config/conf');

//Conexion con el servidor
var db = mongoose.connection;

db.on('error', console.error);
//Modelo de la base de datos
var uriSchema = new mongoose.Schema({
    urlShort: {type: String, require: true, unique: true},
    urlSource: {type: String, require: true}
});
var uri = mongoose.model('uri', uriSchema);

mongoose.connect('mongodb://' + conf.ddbb.url);
//Funciones de la BBDD
module.exports = {
    add: function(add, callback){
        var newUri = new uri(add);
        newUri.save(function(err){
            callback(err);
        });
    },
    remove: function(urlShort, callback){
        uri.remove({"urlShort": urlShort}, function(err){
            callback(err);
        });
    }
};
