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
    user: {type: String},
    statistics:{
        click:{
            count:  {type: Number, default:0},
            date:   {type: String, default:"0"},
            browser:{type: String},
            ip:     {type: String}
        },
        created:{type: String, default:"0"},
        browser:{type: String},
        ip:     {type: String}
    }
});
var userSchema = new mongoose.Schema({
    local: {
        username: {type: String, unique: true},
        password: String,
        rol: String
    }
});

var uri = mongoose.model('uri', uriSchema);
var user = mongoose.model('user',userSchema);

mongoose.connect('mongodb://' + conf.ddbb.url, function(err){
    if (err) throw err;
});
//Funciones de la BBDD
//Si hay problemas de rendimiento, exportar funcion a funcion
module.exports = {
    /****   URI SCHEMA  ****/
    //Crea URI
    /** Eliminar error de  pass **/
    add: function(add, callback){
        var newUri = new uri(add);
        newUri.save(function(err){
            callback(err, newUri);
        });
    },
    //Borra URI
    remove: function(urlShort, callback){
        uri.remove({"urlShort": urlShort}, function(err){
            callback(err);
        });
    },
    //Busca por URI
    find: function(urlShort, callback){
        uri.findOne({"urlShort": urlShort}, function(err, res){
            callback(err, res);
        });
    },
    //Busca por usuario
    findByUser: function(users, callback){
        uri.find({"user": users}, function(err, res){
            callback(err, res);
        });
    },
    //Incrementa en uno el nº de clicks
    /***  añadir ip y navegador   ***/
    increase: function(click,callback){
        uri.findOne({"urlShort": click.urlShort},function(err, res){
            res.statistics.click.count = res.statistics.click.count + 1;
            res.statistics.save();
            callback(err, res);
        });
    },

    /****  USER SCHEMA  ****/
    //Añadir usuario
    addUser : function(add, callback){
        var newUser = new user(add);
        newUser.save(function(err){
            callback(err, newUser);
        });
    },
    //Eliminar usuario
    removeUser: function(user_, callback){
        user.remove({"username": user_.username, "password": user_.password}, function(err){
            callback(err);
        });
    },
    //Buscar  usuario
    findUser: function(user_, callback){
        user.findOne({"username": user_.username, "password": user_.password}, function(err, res){
            callback(err, res);
        });
    }
};
