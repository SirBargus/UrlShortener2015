//shortUrlDB.js

//shortUrl Database

var alasql = require('alasql');

var db = new alasql.Database();

db.exec("CREATE TABLE shorturl (hash STRING, target_ STRING, sponsor STRING," 
    + "created DATE, owner STRING, mode INT, safe BOOLEAN, ip STRING," 
    + "country STRING)");

module.exports = {
    add: function(su){
        //Create md5 hash from string
        db.exec("INSERT INTO shorturl VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [su.hash,
                su.target, su.sponsor, su.created, su.owner, su.momde, su.safe,
                su.ip, su.country]);
        return su.hash;
    },
    findByHash: function(hash){
        return db.exec("select * from shorturl where hash=?",[hash]);
    },
    update: function(su){
        db.exec("update shorturl set target_=?, sponsor=?, created=?, owner=?," 
                + "mode=?, safe=?, ip=?, country=? where hash=?", [su.target, 
                su.sponsor, su.created, su.owner, su.momde, su.safe,
                su.ip, su.countryi, su.hash]);
    },
    delete_: function(hash){
        db.exec("delete from shorturl where hash=?", [hash]);
    },
    deleteAll: function(){
        db.exec("delete from shorturl");
    },
    count: function(){
        return db.exec("select count(*) from shorturl");
    },
    list: function(limit, offset){
        return db.exec("select * from shorturl limit ? offset ?");
    },
    clicksByHash: function(target){
        return db.exec("select count(*) from shorturl where target_=?", [target]);
    },
    mark: function(su, safeness){
        db.exec("update shorturl set safe=? where hash=?", [safeness, su.hash]);
    }
}
