var Blog = require('../models/blog.js'),
    User = require('../models/user.js'),
    Comment = require('../models/comments.js');

var middlewareObj = {};

middlewareObj.isBlogger = function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.back();
    } else {
        User.findById(req.user.id, function(err, foundUser) {
            if(err || !foundUser) {
                req.flash('error', 'Sorry, that request could not be completed.');
                res.back();
            } else if (foundUser.role >= 2) {
                return next();
            } else {
                req.flash('error', 'Sorry, you do not have permission to do that.');
                res.back();
            }

    //     } else {
    //     console.log('no permission');
    //     req.flash('error', 'You do not have permission to do that.');
    //     res.back();
    // }
    });
    }
}

middlewareObj.isOwner = function(req, res, next) {
    if(req.isAuthenticated()) {
        Blog.findOne({'title': req.params.title}, function(err, foundBlog) {
            if(err || !foundBlog) {
                req.flash('error', 'Sorry, that request could not be completed.');
                res.redirect('/blog/'+ req.params.title);
            } else {
                console.log(foundBlog);
                User.findById(req.user._id, function(err, foundUser) {
                    console.log(foundBlog.content);
                   if(err || !foundUser) {
                        req.flash('error', 'Sorry, that request could not be completed.');
                        res.redirect('/blog/'+ req.params.title);
                } else if((foundBlog.author.id.equals(req.user._id)) || foundUser.role == 3) {
                    return next();
                } else {
                    req.flash('error', 'You do not have permission to edit this blog post.');
                    res.redirect('/blog/'+ req.params.title);
            }
            
            });
    }
    });
} else {
            req.flash('error', 'You need to be logged in to do that.');
            res.redirect('/login');
}

}

middlewareObj.isCommenter = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comments_id, function(err, foundComment) {
            if(err || !foundComment) {
                console.log('error at comment: ' + req.params.comments_id);
                req.flash('error', 'Sorry, that request could not be completed.');
                res.redirect('/blog/' + req.params.title);
            } else {
                User.findById(req.user._id, function(err, foundUser) {
                   if(err || !foundUser) {
                       console.log('error at user: ' + foundUser);
                        req.flash('error', 'Sorry, that request could not be completed.');
                        res.redirect('/blog/' + req.params.title);
                } else if((foundComment.author.id.equals(req.user._id)) || foundUser.role == 3) {
                    console.log('editing?');
                    return next();
                } else {
                    req.flash('error', 'You do not have permission to edit this blog post.');
                    console.log('no permission');
                    res.redirect('/blog/' + req.params.title);
            }
            
            });
    }
    });
} else {
            req.flash('error', 'You need to be logged in to do that.');
            res.redirect('/login');
}

}


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {

        return next();
    }
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('/blog/'+req.params.title);
}


module.exports = middlewareObj;