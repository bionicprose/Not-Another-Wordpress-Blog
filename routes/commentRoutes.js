var express = require('express'),
    app     = express(),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog'),
    moment  = require('moment'),
    Comment = require('../models/comments'),
    methodOverride = require('method-override'),
    middleware  = require('../middleware'),
    User    = require('../models/user');



    // NEW Comment Routes

router.get('/blog/:url/comments/new', middleware.isLoggedIn, function(req, res) {
    console.log(req.params.title);
    Blog.findOne({'url': req.params.url}, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog does not exist!');
        } else {
            console.log(foundBlog);
            res.render('comments/new', {blog: foundBlog});
        }
    });
   
});

router.post('/blog/:url/comments', middleware.isLoggedIn, function(req, res) {
    Blog.findOne({'url': req.params.url}, function(err, foundBlog){
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog does not exist!');
            res.redirect('/blogs/index');
        } else {
            var date = moment();
            if (req.user.local.username) {
                var username = req.user.local.username;
            } else {
                var username = req.user.local.name;
            }
            console.log('req.user.local.name: ' + req.user.local.name);
            var newComment = {'content': req.body.content, 'author': {'id': req.user._id}, 'author.username' : username, 'blogPost': {'id': foundBlog._id}, 'blogPost.url': req.params.url, 'postDate': date};
            Comment.create(newComment, function(err, comment) {
                if(err) {
                    console.log(err);
                    req.flash('error', 'Sorry, your comment could not be created!');
                } else {
                    console.log(comment);
                    comment.save();
                    foundBlog.comments.push(comment);
                    foundBlog.save();
                    res.redirect('/blog/'+req.params.url);
                }
            } );
        }
    });
});

//////////////////
// Edit and Update Route
/////////////////

router.get('/blog/:url/comments/:comments_id/edit', middleware.isCommenter, function(req, res) {
    console.log(req.params.comments_id);
    Comment.findById(req.params.comments_id, function(err, foundComment) {
        if(err) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.back();
        } else {
            console.log(req.params.id);
            Blog.findOne({'url': req.params.url}, function(err, foundBlog) {
                if(err || !foundBlog) {
                    console.log(err)
                    req.flash('error', 'Sorry, that blog does not exist!');
                    res.redirect('/blog')
                } else {
            console.log(foundBlog + 'blog');
            res.render('comments/edit', {blog: foundBlog, comment: foundComment});
        }
    });
}
});
});

////
//update
///

router.put('/blog/:url/comments/:comments_id', middleware.isCommenter, function(req, res) {
    req.body.comment.editDate = moment();
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            console.log(err);
            req.flash('error', 'Sorry, that comment could not be updated.');
            res.back();
        } else {
            req.flash('success', 'You updated your comment for the post ' +req.params.title+'.');
            res.redirect('/blog/'+req.params.url);
        }

    });
});


//////////////////
// DESTROY Route/
////////////////

router.delete('/blog/:url/comments/:comments_id', middleware.isCommenter, function(req, res) {
    Comment.findByIdAndDelete(req.params.comments_id, function(err) {
        if(err) {
            console.log(err);
            req.flash('error', 'Sorry, there was a problem deleting this comment.');
            res.back();
        } else {
            Blog.findOne({'url': req.params.url}, function(err, foundBlog) {
                if(err) {
                    console.log(err);
                    req.flash('error', 'Sorry, that blog post could not be found.');
                    res.back();
                } else {
                    var delId = foundBlog.comments.indexOf(req.params.comments_id);
                    foundBlog.comments.splice(delId, delId+1);
                    foundBlog.save();
                    req.flash('success', 'You have deleted a comment for the blog post '+req.params.title+'.');
                    // res.redirect('/blog/'+req.params.title);
                    res.redirect('back');
        }
    });
}
});
});

module.exports = router;