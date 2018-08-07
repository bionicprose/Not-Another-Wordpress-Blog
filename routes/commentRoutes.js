var express = require('express'),
    app     = express(),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog'),
    moment  = require('moment'),
    Comment = require('../models/comments'),
    methodOverride = require('method-override');



    // NEW Comment Routes

router.get('/blog/:title/comments/new', function(req, res) {
    console.log(req.params.title);
    Blog.findOne({'title': req.params.title}, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog does not exist!');
        } else {
            console.log(foundBlog);
            res.render('comments/new', {blog: foundBlog});
        }
    });
   
});

router.post('/blog/:title/comments', function(req, res) {
    Blog.findOne({'title': req.params.title}, function(err, foundBlog){
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog does not exist!');
            res.redirect('/blogs/index');
        } else {
            var date = moment();
            var newComment = {'username': req.body.name, 'content': req.body.content, 'email': req.body.email, 'blogPost': foundBlog._id, 'postDate': date};
            Comment.create(newComment, function(err, comment) {
                if(err) {
                    console.log(err);
                    req.flash('error', 'Sorry, your comment could not be created!');
                } else {
                    console.log(comment);
                    comment.save();
                    foundBlog.comments.push(comment);
                    foundBlog.save();
                    res.redirect('/blog/'+req.params.title);
                }
            } );
        }
    });
});

//////////////////
// Edit and Update Route
/////////////////

router.get('/blog/:title/comments/:comments_id/edit', function(req, res) {
    console.log(req.params.comments_id);
    Comment.findById(req.params.comments_id, function(err, foundComment) {
        if(err) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.back();
        } else {
            Blog.findById(req.params.id, function(err, foundBlog) {
                if(err || !foundBlog) {
                    console.log(err)
                    req.flash('error', 'Sorry, that blog does not exist!');
                    res.back();
                } else {
            console.log(foundBlog + 'blog');
            res.render('comments/edit', {blog: foundBlog, comment: foundComment});
        }
    });
}
});
});


module.exports = router;