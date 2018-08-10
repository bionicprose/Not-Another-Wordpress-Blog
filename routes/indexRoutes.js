var express = require('express'),
    app = express(),
    passport = require('passport'),
    router  = express.Router({mergeParams:true}),
    User    = require('../models/user');

// module.exports = function(app, passport) {

//////////////////
// homepage
////////////////////////

app.get('/', function(req, res) {
    res.render('index');
});




/////////////////////
// Login
////////////////////

app.get('/login', function(req, res, next) {
    console.log(req.flash('loginMessage'));
    res.render('login', {message: req.flash('loginMessage')});

});


app.post('/login', passport.authenticate('local-login', {

     successRedirect : '/profile', 
     failureRedirect: '/login',
     failureFlash: true
 }));

// app.post('/login', function(req, res, next) {
//     passport.authenticate('local-login', function(err, user, info) {
//     // if (err) {
//     //     req.flash('error', 'You could not be logged in with those credentials');
//     //     res.redirect('/login');
//     // } else if(!user) {
//     //     req.flash('error', 'That account does not exist.');
//     //     return res.back();
//     // }
//     req.logIn(user, function(err) {
//         if(err) {return next(err); }
//         req.flash('success', 'You\'re now logged in!');
//         return res.redirect('/profile');
//     });
// });
// });

//     successRedirect : '/profile', 
//     failureRedirect: '/login',
//     failureFlash: true
// }));

//     passport.authenticate('local-login', function(err, user, info) {
//         if(err) {
//             return next(err);
//         }
//         if(!user) {
//             return res.send(401, { success: false, message: 'authentication failed' });
//         }
//         req.login(user, function(err){
//             if(err) {
//                 return next(err);
//             }
//         req.flash('success', 'You are now logged in!');
//             return res.back();
//         });
//     });
// });


/////////////////
// signup
////////////////

app.get('/signup', function(req, res) {

    res.render('signup', { message: req.flash('signupMessage')});
});

app.post('/signup', passport.authenticate('local-signup', {
     successRedirect: '/profile',
     failureRedirect: '/signup',
     failureFlash: true
}));

// app.get('/signup-part-2', isLoggedIn(), function(req, res) {
//     res.render('signup2');
// });



///////////////////////
// Profile section
//////////////////////

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user: req.user
    });
});


//////////////////////
// Facebook Routes
/////////////////////

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope : ['public_profile', 'email']
}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

////////////////////////
// Twitter Routes
///////////////////////




// app.get('/auth/twitter', passport.authenticate('twitter'));

// app.get('auth/twitter/callback', 
//     passport.authenticate('twitter', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
        
// }));

///////////////////
// Google Routes
////////////////////

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

///////////////////////
// Logout
////////////////////////

app.get('/logout', function(req, res) {
    req.logout();
    req.flash('notify', 'You have logged out!');
    res.redirect('/');
});



/////////////////////
// Authorize Routes, linking social accounts
/////////////////////////////////

/////////////
// Local
/////////////

app.get('/connect/local', function(req, res) {
    res.render('connect-local');
});

app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/connect/local',
    failureFlash : true
}));

////////////////////
// Facebook
///////////////////

app.get('/connect/facebook', passport.authorize('facebook', {
    scope : ['public_profile', 'email']
}));

app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

////////////////
// Twitter
////////////////

// app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

// app.get('/connect/twitter/callback',
//     passport.authorize('twitter', {
//         successRedirect : '/profile',
//         failureRedirect : '/'
//     }));

//////////////////
// Google
/////////////////

app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

app.get('/connect/google/callback',
    passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
/////////////////////
// Unlink accounts
////////////////////

app.get('/unlink/local', function(req, res) {
    var user    = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
        res.redirect('/profile');
    });
});

//////////////////
// unlink facebook
/////////////////

app.get('/unlink/facebook', function(req, res) {
    var user        = req.user;
    user.facebook.token = undefined;
    user.facebook.name  = undefined;
    user.facebook.email = undefined;
    user.facebook.id    = undefined;
    user.save(function(err) {
        res.redirect('/profile');

    });
});

///////////////
// unlink twitter
//////////////

app.get('/unlink/twitter', function(req, res) {
    var user        = req.user;
    user.twitter.id             = undefined;
    user.twitter.id             = undefined;
    user.twitter.username       = undefined;
    user.twitter.displayName    = undefined;
    user.save(function(err) {
        res.redirect('/profile');

    });
});

/////////////////
// unlink Google
////////////////

app.get('/unlink/google', function(req, res) {
    var user            = req.user;
    user.google.token   = undefined;
    user.google.id          = undefined;
    user.google.name        = undefined;
    user.google.email       = undefined;
    user.save(function(err) {
        res.redirect('/profile');
    });
});

// };
///////////////
// middleware
//////////////

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


module.exports = app;

