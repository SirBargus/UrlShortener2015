//users.js

//Modelo de la BBDD para la tabla de usuarios
var mongoose = require('mongoose'),
    conf = require('../config/conf');

//Conexion con el servidor
var db = mongoose.connection;

db.on('error', console.error);
//Modelo de la base de datos
var uriSchema = new mongoose.Schema({
    urlSource: {type: String, require: true},
    urlShort: {type: String, require: true, unique: true},
    qr: Buffer
});
var uri = mongoose.model('uri', uriSchema);

mongoose.connect('mongodb://' + conf.ddbb.url, function(err){
    if (err) throw err;
});
//Funciones de la BBDD
//Si hay problemas de rendimiento, exportar funcion a funcion
module.exports = {
    add: function(add, callback){
        var newUri = new uri(add);
        newUri.save(function(err){
            callback(err, newUri);
        });
    },
    remove: function(urlShort, callback){
        uri.remove({"urlShort": urlShort}, function(err){
            callback(err);
        });
    },
    find: function(urlShort, callback){
        uri.findOne({"urlShort": urlShort}, function(err, res){
            callback(err, res);
        });
    }
};
