// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');

var configAuth = require('./auth');
var shell = require('shelljs');

module.exports = function(passport) {
console.log('passport is being used');
    ///////////////////
    // passport session setup
    /////////

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {

            done(err, user);
        });
    });

    /////////////////////
    // Local signup
    ////////////////////

    passport.use('local-signup', new LocalStrategy({
        //changing default from username to email
        // on profile page, user will be able to set a display name
        // had to change node_modules/passport-local/lib/strategy.js to get this to work
        // see: https://github.com/jaredhanson/passport/issues/421

        usernameField: 'username',
        emailField:     'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, email, done) {

    console.log('password:' + password);
        process.nextTick(function() {

        
            User.findOne({'local.email':email}, function(err, user) {
              
                if(err) {
                  
                    return done(err);
                } else if (user) {
                   
                    return done(null, false, req.flash('error', 'That email is already registered.'));
                } else {
                    User.findOne({'local.username': username}, function(err, user) {
                        if(err) {
                            return done(err);
                        } else if (user){
                            return done(null, false, req.flash('error', 'That username is already in use.'));


                        } else if (!req.user) {
                     // if no user with that email or username
                            var newUser = new User();

                            newUser.role = 1;
                            newUser.local.email = email;
                            newUser.local.username  = username;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.pic = '/img/oliver.jpg';
                            shell.mkdir('-p', '/home/zac/webdev/bionicprose/public/bionicUser/' + newUser.id);
                            //setting local credentials
                            newUser.save(function(err) {
                                if(err) {
                                   throw err;
                                }
                                return done(null, newUser);
                            }); 

                } else {
                    var newUser = req.user;
                    
                    newUser.local.email = email;
                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.pic = ('/img/oliver.jpg');
                    
                    newUser.save(function(err) {
                               if(err) {
                                   throw err;
                                       }
                                
                                return done(null, newUser);
                                    });
                                
                                }
                            }); 
                        }
                        });  
                        });
                    }));
                    
              
        

    //////////////////////////
    // Local Login Strat
    /////////////////////////

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        emailField: 'email',
        passReqToCallback: true
    },
    function(req, username, password, email, done) {
        console.log(req.body.login);

        if(username.includes('@')) {

              
            User.findOne({ 'local.email': username }, function(err, user) {
                if(err)
                    return done(err);

                if(!user)
                    return done(null, false, req.flash('error', 'The username or password was incorrect.'));
            
                if(!user.validPassword(password))
                    return done(null, false, req.flash('error', 'The password was incorrect.'));
            
            
                return done(null, user, req.flash('notify', 'You are now logged in!'));
        
                });
            } else {
                User.findOne({ 'local.username': username }, function(err, user) {
                    if(err)
                        return done(err);
    
                    if(!user)
                        return done(null, false, req.flash('error', 'The username or password was incorrect.'));
                
                    if(!user.validPassword(password))
                        return done(null, false, req.flash('error', 'The password was incorrect.'));
                
                
                    return done(null, user, req.flash('notify', 'You are now logged in!'));
            
                    });
                
            }
    
    }));




//////////////////////////
// Facebook
//////////////////////////

passport.use(new FacebookStrategy({

    clientID            : configAuth.facebookAuth.clientID,
    clientSecret        : configAuth.facebookAuth.clientSecret,
    callbackURL         : configAuth.facebookAuth.callbackURL,
    profileFields       : configAuth.facebookAuth.profileFields,
    passReqToCallback    : true
   
},

function(req, token, refreshToken, profile, done) {

    //asynchronous

    process.nextTick(function() {
        
        if(!req.user){
            console.log('no req.user');
        User.findOne({'facebook.id' : profile.id}, function(err, user) {
            if(err)
                return done(err);

            if(user) {
                return done(null, user);
            } else {
                console.log('no user found in mongo, so should create new folder');
                var newUser     = new User();
                newUser.role = 1;
                newUser.facebook.id     = profile.id;
                newUser.facebook.token  = token;
                newUser.local.name   = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.local.email  = profile.emails[0].value;
                if('https://graph.facebook.com/' + profile.id + '/picture?width=200&height=200') {
                    newUser.pic.push('https://graph.facebook.com/' + profile.id + '/picture?width=200&height=200');
                } else {
                    newUser.pic =  '/img/oliver.jpg';
                }
                newUser.facebook.name   = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email  = profile.emails[0].value;
                shell.mkdir('-p', '/home/zac/webdev/bionicprose/public/bionicUser/' + newUser.id);
                newUser.save(function(err) {
                    if(err)
                        throw err;

                        return done(null, newUser);
                });
            }
            
        });
    } else {
        // user already exists and logged in, now linking accounts

        User.findOne({'facebook.id' : profile.id}, function(err, user) {
            if(err)
                return done(err);

            console.log('facebook profile.id: ' + profile.id + ' and user: ' + user + ' and req.user: '+req.user);
            if(user) {
                console.log('logging into other account maybe?');
                return done(null, req.flash('error', 'This Facebook account has already been linked to a user.'));
            } else {

        var user            = req.user;

        user.facebook.id    = profile.id;
        user.facebook.token = token;
        if(!req.user.local.email) {
            user.local.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.local.email = profile.emails[0].value;
        }
        user.facebook.name   = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email  = profile.emails[0].value;
        if (!user.pic && 'https://graph.facebook.com/' + profile.id + '/picture?width=200&height=200' ) {
            user.pic = ('https://graph.facebook.com/' + profile.id + '/picture?width=200&height=200');
    }

        // save the user

        user.save(function(err) {
            if (err)
                throw err;
            return done(null, user);
        });
    
    }
    });
}
}
)}));

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
        passReqToCallback    : true

    },
    function(req, token, refreshToken, profile, done) {

        process.nextTick(function() {
            if(!req.user) {
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if(err)
                    return done(err);

                if(user) {

                    return done(null, user);
                } else {
                    var newUser        = new User();
                    
                    newUser.role        = 1;
                    newUser.google.id   = profile.id;
                    newUser.google.token = token;
                    newUser.google.name    = profile.displayName;
                    newUser.local.name     = profile.displayName;
                    newUser.local.email    = profile.emails[0].value; // pull the first email
                    newUser.google.email   = profile.emails[0].value;
                    newUser.pic            = '/img/olilver.jpg';
                    shell.mkdir('-p', '/home/zac/webdev/bionicprose/public/bionicUser/' + newUser.id);
                    newUser.save(function(err) {
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
                
            });
        } else {
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if(err)
                    return done(err);

                if(user) {
                    return done(null, req.flash('error', 'That Google account has already been linked to another user.'));
                } else {

            var user                = req.user;

            user.google.id          = profile.id;
            user.google.token       = token;
            if(!req.user.local.email){
                user.local.name        = profile.displayName;
                user.local.email       = profile.emails[0].value;
            }
            user.google.name           = profile.displayName;
            user.google.email          = profile.emails[0].value;
            if(!user.pic) {
                user.pic = '/img/oliver.jpg';
            }
            user.save(function(err) {
                if(err)
                    throw err;
                return done(null, user);
            });
        }
        });
    }
    })}));

};
