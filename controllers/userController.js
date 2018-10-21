var passport = require("passport"),
  User = require("../models/user"),
  Blog = require("../models/blog"),
  Comment = require("../models/comments"),
  shell     = require('shelljs');


// admin GET route

exports.user__admin__get = function(req, res) {
    Blog.find({}, function(err, foundBlog) {
      User.find({}, function(err, foundUser) {
        Comment.find({}, function(err, foundComment) {
          res.render("admin/admin", {
            blogs: foundBlog,
            users: foundUser,
            comments: foundComment
          });
        });
      });
    });
  };

// profile GET
exports.user__profile__get = function(req, res) {
    Blog.find({ "author.id": req.user._id }, function(err, foundBlogs) {
      Comment.find({ "author.id": req.user._id }, function(err, foundComments) {
        res.render("profile", {
          user: req.user,
          blogs: foundBlogs,
          comments: foundComments,
          title: 'Bionic Prose Proflie Page'
        });
      });
    });
  };


  // user update routes on POST

  exports.user__update__post = function(req, res) {
    User.findOne({ _id: req.params.user }, function(err, foundUser) {
      if (err || !foundUser) {
        req.flash("error", "There was a problem loading that user.");
        res.redirect("back");
      } else {
        if (res.req.file) {
          
          var oldPic = foundUser.pic.split("/");
          console.log('wtf is oldpic ' + oldPic[3]);
          if(oldPic[3] !== 'undefined') {
          shell.rm(
            "/home/zac/webdev/bionicprose/public/bionicUser/" +
              foundUser._id +
              "/" +
              oldPic[3]);
          }
          User.findByIdAndUpdate(req.params.user,
            {
              'pic': "../bionicUser/" + req.user.id + "/" + res.req.file.filename
            },
            function(err, updatedUser) {
              if (err || !updatedUser) {
                req.flash("error", "Sorry, that user could not be updated.");
                res.redirect("back");
              } else {
                console.log(res.req.file.filename);
                req.flash("info", "You have updated " + updatedUser.name + ".");
                res.redirect("back");
              }
            }
          );
        } else {
          User.findByIdAndUpdate(
            req.params.user,
            {
              "local.name": req.body.name,
              "local.email": req.body.email,
              "local.username": req.body.username,
              role: req.body.role
            },
            function(err, updatedUser) {
              if (err || !updatedUser) {
                req.flash(
                  "error",
                  "Sorry, that user could not be updated. " + err
                );
                console.log(err);
                res.redirect("back");
              } else {
                req.flash(
                  "info",
                  "You have updated" + updatedUser.username + "."
                );
                res.redirect("back");
              }
            }
          );
        }
      }
    });
  };
  // facebook authentication GET callback

  exports.user__facebook__callback = function(req, res, next) {
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
  };

  // Google authentication GET callback

  exports.user__google__callback = function(req, res, next) {
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
  };

 
// logout GET

exports.user__logout = function(req, res) {
    req.logout();
    req.session = null;
    req.flash("info", "You have logged out!");
    res.redirect("/");
    
  };
  //catchall GET route

  exports.user__catchall = function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
        res.render("404.pug", {
          blogs: foundBlogs,
        
      });
    });
  };