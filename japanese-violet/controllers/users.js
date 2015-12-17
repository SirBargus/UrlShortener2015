//route.js
var ddbb = require('../models/shortUrlDB.js'),
    conf = require('../config/conf');

// File with only server's methods
module.exports = function(app, passport){

    /*
     * Process signup with passport-local
     */
    app.post(conf.api.signup_local, passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup'
	}));

    /*
     * Process login with passport-local
     */
    app.post(conf.api.login_local, passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    /*
     * Login with twitter
     */
    app.get(conf.api.twitter, passport.authenticate('twitter'));

    /*
     * handle the callback after twitter has authenticated the user
     */
    app.get(conf.api.twitter_callback, passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/login'
        })
    );

    /*
     * Login with google
     */
     app.get(conf.api.google, passport.authenticate('google', { scope: [
            'https://www.googleapis.com/auth/plus.login']
     }));
    /*
     * handle the callback after google has authenticated the user
     */
     app.get(conf.api.google_callback, passport.authenticate( 'google', {
     		successRedirect: '/',
     		failureRedirect: '/login'
     }));

    /*
     * Login with Facebook
     */
    app.get(conf.api.facebook, passport.authenticate('facebook', { scope : 'email' }));
    /*
     * handle the callback after facebook has authenticated the user
     */
    app.get(conf.api.facebook_callback, passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );
}
