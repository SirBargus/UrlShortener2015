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
    secure: {type: Boolean},
    error: {type: String},
    statistics:{
        total:  {type: Number, default:0},
        //Datos del usuario que la crea
        date:{type: String, default:"0"},
        browser:{type: String},
        ip:     {type: String},
        country:{type: String},
        city:   {type: String}
    }
});

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    id_: {type: String, unique: true, require: true},
    rol: String,
    token: String
});

var clickSchema = new mongoose.Schema({
    urlShort: {type: String, require: true},
    date:{type: String, default:"0"},
    browser:{type: String},
    ip:     {type: String},
    country:{type: String},
    city:   {type: String}
});

var uri = mongoose.model('uri', uriSchema);
var user = mongoose.model('user',userSchema);
var click = mongoose.model('click',clickSchema);

mongoose.connect('mongodb://' + conf.ddbb.url, function(err){
    if (err) throw err;
});
//Funciones de la BBDD
//Si hay problemas de rendimiento, exportar funcion a funcion
module.exports = {
    /****   URI SCHEMA ****/
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
    //Borra por usuario
    removeByUser: function(id, callback){
        uri.remove({"urlShort": id.urlShort, "user": id.user}, function(err){
            callback(err);
        });
    },
    //Encuentra y añade estadisticas
    click: function(urlShort,data, callback){
        uri.findOne({"urlShort": urlShort}, function(err, res){
            res.statistics.total= res.statistics.total + 1;
            res.statistics.save();
            callback(err, res);
        });
        var newClick = new click(data);
        newClick.save(function(err){
            err(callback, newClick)
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
    /****  USER SCHEMA  ****/
    //Añadir usuario
    addUser: function(add, callback){
        var newUser = new user(add);
        newUser.save(function(err){
            callback(err, newUser);
        });
    },
    //Eliminar usuario
    removeUserLocal: function(user_, callback){
        user.remove({"username": user_.username, "password": user_.password}, function(err){
            callback(err);
        });
    },
    //Buscar  usuario
    findUser: function(user_, callback){
        user.findOne({"username": user_.username,
                     "password": user_.password}, function(err, res){
            callback(err, res);
        });
    },
    findUserById: function(id, callback){
        user.findById(id, function(err, user) {
            callback(err, user);
        });
    },

    checkUrl: function(url,status,code, callback){
      uri.update({"urlSource": url},{"secure":status, "error":code}, function(err, res){
        console.log(res);
          callback(err, res);
      });
    },

    isSecure: function(url, callback){
      uri.findOne({"urlSource": url}, function(err, res){
        console.log(res);
          callback(err, res);
      });
    }
};
