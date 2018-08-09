// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');

var configAuth = require('./auth');

module.exports = function(passport) {
console.log('passport is being used');
    ///////////////////
    // passport session setup
    /////////

    passport.serializeUser(function(user, done) {
        console.log(user + 'serializing...');
        done(null, user.id);
        console.log('user is serialized');
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log(user);
            done(err, user);
        });
    });

    /////////////////////
    // Local signup
    ////////////////////

    passport.use('local-signup', new LocalStrategy({
        //changing default from username to email
        // on profile page, user will be able to set a display name
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {

        console.log('hello');
        process.nextTick(function() {

            console.log(req.body.email);
            User.findOne({'local.email':req.body.email}, function(err, user) {
                console.log('hello2'+ user);
                if(err) {
                    console.log('findOne error?' + err);
                    return done(err);
                } else if (user) {
                    console.log('found email?');
                    return done(null, false, req.flash('error', 'That email is already taken.'));
                } else {

                    // if no user with that email
                    var newUser = new User();

                    newUser.local.email = req.body.email;
                    newUser.local.password = newUser.generateHash(req.body.password);
                    console.log(newUser.local.email);


                    //setting local credentials
                    newUser.save(function(err) {
                        if(err) {
                            console.log('something went wrong saving the user');
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
                
            });
        });
    
    }));

    //////////////////////////
    // Local Login Strat
    /////////////////////////

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {

        
        console.log('inside authenticator strat');
        User.findOne({ 'local.email': email }, function(err, user) {
            if(err)
                return done(err);

            if(!user)
                return done(null, false, req.flash('error', 'The username or password was incorrect.'));
            
            if(!user.validPassword(password))
                return done(null, false, req.flash('error', 'The username or password was incorrect.'));
            
            
            return done(null, user);
        
        });
    
    }));




//////////////////////////
// Facebook
//////////////////////////

passport.use(new FacebookStrategy({

    clientID            : configAuth.facebookAuth.clientID,
    clientSecret        : configAuth.facebookAuth.clientSecret,
    callbackURL         : configAuth.facebookAuth.callbackURL,
    profileFields       : configAuth.facebookAuth.profileFields,
    passReToCallback    : true

},

function(req, token, refreshToken, profile, done) {

    //asynchronous

    process.nextTick(function() {
        if(!req.user){

        User.findOne({'facebook.id' : profile.id}, function(err, user) {
            if(err)
                return done(err);

            if(user) {
                return done(null, user);
            } else {

                var newUser     = new User();

                newUser.facebook.id     = profile.id;
                newUser.facebook.token  = token;
                newUser.facebook.name   = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email  = profile.emails[0].value;

                newUser.save(function(err) {
                    if(err)
                        throw err;

                        return done(null, newUser);
                });
            }
            
        });
    } else {
        // user already exists and logged in, now linking accounts

        var user            = req.user;

        user.facebook.id    = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;

        // save the user

        user.save(function(err) {
            if (err)
                throw err;
            return done(null, user);
        });

    }
    });
}));

/////////////////////////////
//Twitter Strat
////////////////////////////

// passport.use(new TwitterStrategy({
//     consumeKey           : configAuth.twitterAuth.consumerKey,
//     consumerSecret       : configAuth.twitterAuth.consumerSecret,
//     callbackURL          : configAuth.twitterAuth.callbackURL,
//     passReqToCallback    : true
// },
// function(toke, tokenSecret, profile, done) {

//     // make asynchronous because User.findOne won't fire until Twitter has sent all data

//     process.nextTick(function() {
//         if(!user) {

//         User.findOne({'twitter.id': profile.id}, function(err, user) {

//             if(err)
//                 return done(err);

//             if(user) {
//                 return done(null, user);
//             } else {

//                 var newUser                 = new User();

//                 newUser.twitter.id          = profile.id;
//                 newUser.twitter.token       = token;
//                 newUser.twitter.username    = profile.username; 
//                 newUser.twitter.displayName = profile.displayName;

//                 newUser.save(function(err) {
//                     if(err)
//                         throw err;

//                     return done(null, newUser);
//                 });
//             }
//             });
//              } else {
//                     var user                    = req.user;
                    
//                     user.twitter.id             = profile.id;
//                     user.twitter.id             = token;
//                     user.twitter.username       = profile.username;
//                     user.twitter.displayName    = profile.displayName;

//                     user.save(function(err) {
//                         if(err)
//                             throw err;
                    
//                     return done(null, user);
                        
//                     });
// }
//         });
//     }));

    //////////////////
    // Google 
    ///////////////////

    passport.use(new GoogleStrategy({

        clientID            : configAuth.googleAuth.clientID,
        clientSecret        : configAuth.googleAuth.clientSecret,
        callbackURL         : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {
            if(!user) {
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if(err)
                    return done(err);

                if(user) {

                    return done(null, user);
                } else {
                    var newUser        = new User();

                    newUser.google.id   = profile.id;
                    newUser.google.token = token;
                    newUser.google.name     = profile.displayName;
                    newUser.google.email    = profile.emails[0].value; // pull the first email

                    newUser.save(function(err) {
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
                
            });
        } else {

            var user                = req.user;

            user.google.id          = profile.id;
            user.google.token       = token;
            user.google.name        = profile.displayName;
            user.google.email       = profile.emails[0].value;

            user.save(function(err) {
                if(err)
                    throw err;
                return done(null, newUser);
            });
        }
        });
    
    }));

};
