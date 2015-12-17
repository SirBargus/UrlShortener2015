// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    ddbb = require('../models/shortUrlDB'),
    conf = require('../config/conf.json');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        ddbb.findUserById(id, function(err, user) {
            done(err, user);
        });
    });

    /*
     * Local sign-up
     */
    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        var json = {"local": {"username": username, "password": password, "rol": req.body.rol}};
        ddbb.addUser(json, function(err, res){
            if (err) throw err;
            return done(null, res);
        });
    }));

    /*
     * Local login
     */
    passport.use('local-login', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done){
        var json = {"local": {"username": username, "password": password}};
        ddbb.findUser(json, function(err, res){
            if(err || !res) done(err);
            else done(null, res);
        });
    }));

    /*
     * Login with Twitter
     */
    passport.use('twitter', new TwitterStrategy({
        consumerKey: conf.credentials.twitter.consumerKey,
        consumerSecret: conf.credentials.twitter.consumerSecret,
        callbackURL: conf.credentials.twitter.callbackURL
    }, function(token, tokenSecret, profile, done) {
        console.log("ASDFADF");
        process.nextTick(function() {
            var json = {"twitter": {"username": profile.username, "id": profile.id,
                "token": token}};
            ddbb.addUser(json, function(err, res){
                //Si la calve es repetida no lo añadimos a la bbdd
                if (err.code = 11000) done(null, res);
                else{
                    if(err || !res) done(err);
                    else done(null, res);
                }
            })
        });
    }));
};
