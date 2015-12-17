// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var ddbb = require('../models/shortUrlDB');

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
        })
    }));
};
