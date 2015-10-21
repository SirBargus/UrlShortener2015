
var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'urlshortener'});


exports.NewURI = function(callback) {
  //cassandra.execute("Select")
}

exports.FetchURI = function(callback,shortUri) {
  cassandra.execute("Select URI from Urls WHERE %s"(shortUri))
}
