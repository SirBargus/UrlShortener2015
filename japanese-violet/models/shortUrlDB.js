
var cassandra = require('cassandra-driver');
var async = require('async');
var conf = require('../config/conf');

var client = new cassandra.Client({contactPoints: [conf.database.url], keyspace: 'urlshortener'});

exports.CreateKeySpace = function(){
  var query = "CREATE KEYSPACE urlshortener WITH REPLICATION - {'class' : 'SimpleStrategy', 'replication_factor' : 3};";
  cassandra.execute(query);
}

exports.CreateTable = function(){
  var query = "CREATE TABLE shortUrl(id int PRIMARYKEY, short-url text, complete-url text"; //Tabla URLS
  cassandra.execute(query,[],function(err,result){
    if (err){
      return null;
    }else{
      return result;
    }
  });
}

exports.NewURI = function(idUri,shortUri,longUri) {
  var query = "INSERT INTO shortUrl (id, short-url, complete-url) VALUES (?,?,?)"
  cassandra.execute(query,[idUri,shortUri,longUri],function(err,result){
    if (err){
      return null;
    }else{
      return result;
    }
  });
}


exports.FetchURI = function(shortUri) {
  var query ="Select complete-url from shortUrl WHERE short-url = ?";
  cassandra.execute(query,[shortUri],function(err,result){
    if (err){
      return null;
    }else{
      return result;
    }
  });
}
