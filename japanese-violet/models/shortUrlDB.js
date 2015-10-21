
var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'urlshortener'});


exports.CreateTable = function(callback){
  cassandra.execute("CREATE TABLE tablename(
   column1 name datatype PRIMARYKEY,
   column2 name data type,
   column3 name data type.
   ");
}

exports.NewURI = function(callback) {
  var query = "INSERT INTO <tablename>
(<column1 name>, <column2 name>....)
VALUES (<value1>, <value2>....)"
  cassandra.execute(query);
}

exports.FetchURI = function(callback,shortUri) {
  cassandra.execute("Select URI from Urls WHERE %s"(shortUri));
}
