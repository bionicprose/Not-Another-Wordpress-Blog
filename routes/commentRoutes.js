var express = require("express"),
  app = express(),
  router = express.Router({ mergeParams: true }),
  Blog = require("../models/blog"),
  moment = require("moment"),
  Comment = require("../models/comments"),
  middleware = require("../middleware"),
  User = require("../models/user");

// NEW Comment Routes

router.get("/blog/:url/comments/new", middleware.isLoggedIn, function(
  req,
  res
) {
  Blog.findOne({ url: req.params.url }, function(err, foundBlog) {
    if (err || !foundBlog) {
      req.flash("error", "Sorry, that blog does not exist!");
    } else {
      res.render("comments/new", { blog: foundBlog });
    }
  });
});

router.post("/blog/:url/comments", middleware.isLoggedIn, function(req, res) {
  Blog.findOne({ url: req.params.url }, function(err, foundBlog) {
    if (err || !foundBlog) {
      req.flash("error", "Sorry, that blog does not exist!");
      res.redirect("/blogs/index");
    } else {
      var date = moment();
      if (req.user.local.username) {
        var username = req.user.local.username;
      } else {
        var username = req.user.local.name;
      }

      var newComment = {
        content: req.body.content,
        author: { id: req.user._id },
        "author.username": username,
        "author.pic": req.user.pic,
        blogPost: { id: foundBlog._id },
        "blogPost.url": foundBlog.url,
        "blogPost.title": foundBlog.title,
        postDate: date
      };
      Comment.create(newComment, function(err, comment) {
        if (err) {
          req.flash("error", "Sorry, your comment could not be created!");
        } else {
          comment.save();
          foundBlog.comments.push(comment);
          foundBlog.save();
          req.flash("info", "You have just added a new comment!");
          res.redirect("/blog/" + req.params.url);
        }
      });
    }
  });
});

//////////////////////////////
// new reply
/////////////////////////////

router.get(
  "/blog/:url/comments/:comment/reply",
  middleware.isLoggedIn,
  function(req, res) {
    Blog.findOne({ url: req.params.url }, function(err, foundBlog) {
      if (err || !foundBlog) {
        req.flash("error", "Sorry, that blog does not exist!");
        res.redirect("back");
      } else {
        Comment.findById(req.params.comment, function(err, foundComment) {
          if (err || !foundComment) {
            req.flash("error", "Sorry, that comment does not exist!");
            res.redirect("back");
          } else {
            res.render("comments/reply", {
              blog: foundBlog,
              comment: foundComment
            });
          }
        });
      }
    });
  }
);

router.post("/blog/:url/comments/:comment", middleware.isLoggedIn, function(
  req,
  res
) {
  Blog.findOne({ url: req.params.url }, function(err, foundBlog) {
    if (err || !foundBlog) {
      req.flash("error", "Sorry, that blog does not exist!");
      res.redirect("/blogs/:url");
    } else {
      Comment.findById(req.params.comment, function(err, foundComment) {
        if (err || !foundComment) {
          req.flash("error", "Sorry, that comment does not exist!");
          res.redirect("/blogs/:url");
        } else {
          var date = moment();
          if (req.user.local.username) {
            var username = req.user.local.username;
          } else {
            var username = req.user.local.name;
          }

          var newReply = {
            originalPost: { id: foundComment._id },
            "originalPost.author": foundComment.author.username,
            content: req.body.content,
            author: { id: req.user._id },
            "author.username": username,
            "author.pic": req.user.pic,
            blogPost: { id: foundBlog._id },
            "blogPost.title": foundBlog.title,
            postDate: date
          };
          Comment.create(newReply, function(err, reply) {
            if (err) {
              req.flash("error", "Sorry, your comment could not be created!");
            } else {
              reply.save();
              foundBlog.comments.push(reply);
              foundBlog.save();
              foundComment.replies.push(reply);
              foundComment.save();
              req.flash("info", "You have just replied to a comment!");
              res.redirect("/blog/" + req.params.url);
            }
          });
        }
      });
    }
  });
});

//////////////////
// Edit and Update Route
/////////////////

router.get(
  "/blog/:url/comments/:comments_id/edit",
  middleware.isCommenter,
  function(req, res) {
    Comment.findById(req.params.comments_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Sorry, that comment does not exist!");
        res.back();
      } else {
        Blog.findOne({ url: req.params.url }, function(err, foundBlog) {
          if (err || !foundBlog) {
            req.flash(
              "error",
              "Sorry, that blog does not exist! Comment route"
            );
            res.redirect("/blog");
          } else {
            Blog.find({ state: "publish" })
              .sort({ createDate: "descending" })
              .exec(function(err, blogs) {
                if (err) {
                } else {
                  res.render("comments/edit", {
                    blog: foundBlog,
                    comment: foundComment,
                    blogs: blogs
                  });
                }
              });
          }
        });
      }
    });
  }
);

////
//update
///

router.put("/blog/:url/comments/:comments_id", middleware.isCommenter, function(
  req,
  res
) {
  req.body.comment.editDate = moment();
  Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      req.flash("error", "Sorry, that comment could not be updated.");
      res.back();
    } else {
      req.flash(
        "info",
        "You updated your comment for the post " +
          updatedComment.blogPost.title +
          "."
      );
      res.redirect("/blog/" + req.params.url);
    }
  });
});

//////////////////
// DESTROY Route/
////////////////

router.delete(
  "/blog/:url/comments/:comments_id",
  middleware.isCommenter,
  function(req, res) {
    var deletedComment = {
      editDate: moment(),
      "author.username": "Deleted",
      content: "Deleted by Author",
      editable: false
    };
    Comment.findByIdAndUpdate(req.params.comments_id, deletedComment, function(
      err,
      updatedComment
    ) {
      if (err) {
        req.flash("error", "Sorry, that comment could not be updated.");
        res.back();
      } else {
        req.flash(
          "info",
          "You updated your comment for the post " + req.params.title + "."
        );
        res.redirect("/blog/" + req.params.url);
      }
    });
  }
);

////
//update
///

router.put("/blog/:url/comments/:comments_id", middleware.isCommenter, function(
  req,
  res
) {
  var deletedComment = {
    editDate: moment(),
    author: {
      username: "Deleted"
    },
    content: "Deleted by Author"
  };
  Comment.findByIdAndUpdate(req.params.comments_id, deletedComment, function(
    err,
    updatedComment
  ) {
    if (err) {
      req.flash("error", "Sorry, that comment could not be updated.");
      res.back();
    } else {
      req.flash(
        "info",
        "You updated your comment for the post " + req.params.title + "."
      );
      res.redirect("/blog/" + req.params.url);
    }
  });
});

module.exports = router;
