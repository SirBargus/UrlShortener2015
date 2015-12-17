//route.js
var ddbb = require('../models/shortUrlDB.js'),
    conf = require('../config/conf');

// File with only server's methods
module.exports = function(app, passport){

    /*
     * Process signup with passport-local
     */
    app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup'
	})),
    /*
     * Process login with passport-local
     */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    app.get('/login/twitter',  
        passport.authenticate('twitter')
    );

    // handle the callback after facebook has authenticated the user
    app.get('/login/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/twitter',
            failureRedirect : '/'
        })
    );
}
