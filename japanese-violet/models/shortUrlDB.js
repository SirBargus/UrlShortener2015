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
            var newClick = new click(data);
            newClick.save(function(err){
                err(callback, newClick);
            });
            callback(err, res);
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
    findStats: function (callback){
        click.find({},function(err,res){
            callback(err,res)
        })
    },
    findStatsBefore: function (time,callback){
        click.find({"date":{$lt: time}},function(err,res){
            callback(err,res)
        })
    },
    findStatsAfter: function (time,callback){
        click.find({"date":{$gte:time}},function(err,res){
            callback(err,res)
        })
    },
    findStatsBetween: function (time1,time2,callback){
        click.find({"date":{$lt:time1,$gte:time2}},function(err,res){
            callback(err,res)
        })
    },
    //Devuelve estadisticas (para websockets con que tengan el patron msg)
    queryStats: function (msg,callback){
        click.find({"urlShort": /msg/ },function(err,res){
            callback(err,res)
        })
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

    checkUrl: function(url, status, code, callback){
      uri.findOne({"urlSource": url}, function(err, uri){
        uri.secure = status;
        uri.error = code;
        uri.save();
        callback(err,uri);
      });
    },

    isSecure: function(urls, callback){
      uri.findOne({"urlSource": urls}, function(err, res){
          callback(err, res);
      });
    }
};
