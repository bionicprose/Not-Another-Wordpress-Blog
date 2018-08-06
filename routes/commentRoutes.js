var express = require('express'),
    app     = express(),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog'),
    moment  = require('moment'),
    Comment = require('../models/comments'),
    methodOverride = require('method-override');



    // NEW Comment Routes

router.get('/blog/:title/comments/new', function(req, res) {
    Blog.find({'title': req.params.title}, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog does not exist!');
        } else {
            res.render('comments/new', {blog: foundBlog});
        }
    });
   
});

router.post('/blog/:title/comments', function(req, res) {
    Comment.create(new )
})
module.exports = router;