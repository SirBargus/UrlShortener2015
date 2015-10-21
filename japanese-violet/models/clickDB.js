//clickDB.js

//This is a simple and temporal in-memory database only for the first states of
//development

var alasql = require('alasql');
var crypto = require('crypto');

var db = new alasql.Database();

db.exec("CREATE TABLE click (hash STRING," 
    + "created DATE, referrer STRING, browser STRING, platform STRING," 
    + "ip STRING, country STRING)");

module.exports = {
    add: function(cl){
        //Create md5 hash from string
        db.exec("INSERT INTO click VALUES (?, ?, ?, ?, ?, ?, ?)", [cl.hash,
                cl.created, cl.referrer, cl.browser, cl.platform,
                cl.ip, cl.country]);
    },
    findByHash: function(hash){
        return db.exec("select * from click where hash=?",[hash]);
    },
    update: function(cl){
        db.exec("update click set hash=?, created=?, referrer=?, browser=?,"
               + "platform=?, ip=?, country=? where id=?", [cl.hash, cl.created,
               cl.referrer, cl.browser, cl.platform, cl.ip, cl.country, cl.id]);
    },
    delete_: function(id){
        db.exec("delete from click where id=?", [id]);
    },
    deleteAll: function(){
        db.exec("delete from click");
    },
    count: function(){
        return db.exec("select count(*) from click");
    },
    list: function(limit, offset){
        return db.exec("select * from click limit ? offset ?");
    },
    clicksByHash: function(hash){
        return db.exec("select count(*) from click where hash=?", [hash]);
    }
}
