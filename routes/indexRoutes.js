var express = require("express"),
  app = express(),
  passport = require("passport"),
  router = express.Router({ mergeParams: true }),
  User = require("../models/user"),
  Blog = require("../models/blog"),
  Comment = require("../models/comments"),
  middleware = require("../middleware");

// module.exports = function(app, passport) {

//////////////////
// homepage
////////////////////////

app.get("/", function(req, res) {
  res.render("index");
});

/////////////////////
// Login
////////////////////

app.get("/login", function(req, res, next) {
  console.log(req.flash("loginMessage"));
  res.render("login", { message: req.flash("loginMessage") });
});

app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  })
);

/////////////////
// signup
////////////////

app.get("/signup", function(req, res) {
  res.render("signup", { message: req.flash("signupMessage") });
});

app.post(
  "/signup",
  middleware.validify,
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

///////////////////////
// Profile section
//////////////////////

app.get("/profile", middleware.isLoggedIn, function(req, res) {
  Blog.find({ "author.id": req.user._id }, function(err, foundBlogs) {
    Comment.find({ "author.id": req.user._id }, function(err, foundComments) {
      res.render("profile", {
        user: req.user,
        blogs: foundBlogs,
        comments: foundComments
      });
    });
  });
});

//////////////////////
// Facebook Routes
/////////////////////

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"]
  })
);

app.get("/auth/facebook/callback", function(req, res, next) {
  passport.authenticate("facebook", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log(req.session.id);
      if (req.session.url) {
        req.flash("info", "You are now logged in!");
        return res.render("loading", { session: req.session });
      } else {
        req.flash("info", "You are now logged in !");
        return res.redirect("/profile");
      }
    });
  })(req, res, next);
});

////////////////////////
// Twitter Routes for future use
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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", function(req, res, next) {
  passport.authenticate("google", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log(req.session.id);
      if (req.session.url) {
        req.flash("info", "You are now logged in!");
        return res.render("loading", { session: req.session });
      } else {
        req.flash("info", "You are now logged in!");
        return res.redirect("/profile");
      }
    });
  })(req, res, next);
});

///////////////////////
// Logout
////////////////////////

app.get("/logout", function(req, res) {
  req.logout();
  
  req.flash("info", "You have logged out!");
  res.redirect("/");
  req.session.destroy();
});

/////////////////////
// Authorize Routes, linking social accounts
/////////////////////////////////

/////////////
// Local
/////////////

app.get("/connect/local", function(req, res) {
  res.render("connect-local");
});

app.post(
  "/connect/local",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/connect/local",
    failureFlash: true
  })
);

////////////////////
// Facebook
///////////////////

app.get(
  "/connect/facebook",
  passport.authorize("facebook", {
    scope: ["public_profile", "email"]
  })
);

app.get(
  "/connect/facebook/callback",
  passport.authorize("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/"
  })
);

////////////////
// Twitter for future use
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

app.get(
  "/connect/google",
  passport.authorize("google", { scope: ["profile", "email"] })
);

app.get(
  "/connect/google/callback",
  passport.authorize("google", {
    successRedirect: "/profile",
    failureRedirect: "back"
  })
);
/////////////////////
// Unlink accounts
////////////////////

app.get("/unlink/local", function(req, res) {
  var user = req.user;
  user.local.email = undefined;
  user.local.password = undefined;
  user.save(function(err) {
    res.redirect("/profile");
  });
});

//////////////////
// unlink facebook
/////////////////

app.get("/unlink/facebook", function(req, res) {
  var user = req.user;
  user.facebook.token = undefined;
  user.facebook.name = undefined;
  user.facebook.email = undefined;
  user.facebook.id = undefined;
  user.save(function(err) {
    res.redirect("/profile");
  });
});

///////////////
// unlink twitter
//////////////

app.get("/unlink/twitter", function(req, res) {
  var user = req.user;
  user.twitter.id = undefined;
  user.twitter.id = undefined;
  user.twitter.username = undefined;
  user.twitter.displayName = undefined;
  user.save(function(err) {
    res.redirect("/profile");
  });
});

/////////////////
// unlink Google
////////////////

app.get("/unlink/google", function(req, res) {
  var user = req.user;
  user.google.token = undefined;
  user.google.id = undefined;
  user.google.name = undefined;
  user.google.email = undefined;
  user.save(function(err) {
    res.redirect("/profile");
  });
});

/************ */
/* catchall   */
app.get('/*', function(req, res) {
  Blog.find({}, function(err, foundBlogs) {
      res.render("404.pug", {
        blogs: foundBlogs,
      
    });
  });
});
module.exports = app;
