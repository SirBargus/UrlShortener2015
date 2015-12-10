//users.js

//Modelo de la BBDD para la tabla de usuarios
var mongoose = require('mongoose'),
    conf = require('../config/conf');

//Conexion con el servidor
var db = mongoose.connection;

db.on('error', console.error);
//Modelo de la base de datos
var uriSchema = new mongoose.Schema({
    urlSource:  {type: String, require: true},
    urlShort:   {type: String, require: true, unique: true},
    qr: Buffer,
    user: {type: String, require: true},
    analitycs:{
        created:{type: String},
        mode:   {type: Number},
        safe:   {type: Boolean},
        ip:     {type: String},
        country:{type: String},
    }
});
var userSchema = new mongoose.Schema({
    username:   {type: String, require: true, unique: true},
    password:   {type: String, require: true },
    rol: {type: String, require: true}
});

var uri = mongoose.model('uri', uriSchema);
var user = mongoose.model('user',userSchema);

mongoose.connect('mongodb://' + conf.ddbb.url, function(err){
    if (err) throw err;
});
//Funciones de la BBDD
//Si hay problemas de rendimiento, exportar funcion a funcion
module.exports = {
    add: function(add, callback){
        user.findOne({"username": add.user, "password": add.pass},
                function(err, result){
            if (err != null || result == {}) callback("Error");
            var newUri = new uri(add);
            newUri.save(function(err){
                callback(err, newUri);
            });
        })
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
    },
    findByUser: function(users, callback){
        uri.find({"user": users}, function(err, res){
            callback(err, res);
        });
    },
    addUser : function(add, callback){
        var newUser = new user(add);
        newUser.save(function(err){
            callback(err, newUser);
        });
    },
    removeUser: function(user_, callback){
        user.remove({"username": user_.username, "password": user_.password}, function(err){
            callback(err);
        });
    },
    findUser: function(user_, callback){
        user.findOne({"username": user_.username, "password": user_.password}, function(err, res){
            callback(err, res);
        });
    }
};
