var Blog = require('../models/blog.js'),
    User = require('../models/user.js'),
    Comment = require('../models/comments.js'),
    validator = require('validator');
  



var middlewareObj = {};


middlewareObj.validTitle = function(req, res, next) {
    if(!validator.isAlphanumeric(req.body.title.slice(0,1))) {
        req.flash('titleErr', 'Your title must begin with a letter or a number.');
        res.render('blogs/new', {blog: req.body});
        return;
    }
    return next();
}
middlewareObj.validify = function(req, res, next) {
    if(!validator.isAlphanumeric(req.body.username)) {
        req.flash('usernameError', 'Usernames must only contain letters and numbers.');
        res.render('signup', {signin: req.body});
        return;
    } else if(!validator.isEmail(req.body.email)) {
        req.flash('emailError', 'This is not an email address');
        res.render('signup', {signin: req.body});
        return;
    } else if (!validator.isLength(req.body.password, {min:6, max: 14})) {
        req.flash('passwordError', 'Passwords must be between 6 and 14 characters long');
        res.render('signup', {signin: req.body});
       return;
    }
    if(req.body.password !== req.body.confirmPass) {
        req.flash('confirmError', 'Your confirmation password did not match.');
        res.render('signup', {signin: req.body});
        return;
    }
    return next();
    
    }


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
        Blog.findOne({'url': req.params.url}, function(err, foundBlog) {
            if(err || !foundBlog) {
                req.flash('error', 'Sorry, that request could not be completed.');
                res.redirect('/blog/'+ req.params.url);
            } else {
                console.log(foundBlog);
                User.findById(req.user._id, function(err, foundUser) {
                    console.log(foundBlog.content);
                   if(err || !foundUser) {
                        req.flash('error', 'Sorry, that request could not be completed.');
                        res.redirect('/blog/'+ req.params.url);
                } else if((foundBlog.author.id.equals(req.user._id)) || foundUser.role == 3) {
                    return next();
                } else {
                    req.flash('error', 'You do not have permission to edit this blog post.');
                    res.redirect('/blog/'+ req.params.url);
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
                res.redirect('/blog/' + req.params.url);
            } else {
                User.findById(req.user._id, function(err, foundUser) {
                   if(err || !foundUser) {
                       console.log('error at user: ' + foundUser);
                        req.flash('error', 'Sorry, that request could not be completed.');
                        res.redirect('/blog/' + req.params.url);
                } else if((foundComment.author.id.equals(req.user._id)) || foundUser.role == 3) {
                    console.log('editing?');
                    return next();
                } else {
                    req.flash('error', 'You do not have permission to edit this blog post.');
                    console.log('no permission');
                    res.redirect('/blog/' + req.params.url);
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
    res.redirect('/blog/'+req.params.url);
}


module.exports = middlewareObj;