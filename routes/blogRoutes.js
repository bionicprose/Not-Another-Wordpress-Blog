var express = require('express'),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog');


// blog index route
router.get('/blog', function(req, res) {
        res.render('blogs/index');
    });



// New Blog Route

router.get('/blog/new', function(req, res) {
        res.render('blogs/new', {title: 'New Blog Post on BionicProse'});
    });


router.post('/blog', function(req, res) {
        // get data from form
        var title = req.body.title,
            tags = req.body.tags.split(','),
            content = req.body.content,
            today = new Date(),
            dd     = today.getDate(),
            mm      = today.getMonth(),
            yyyy    = today.getFullYear(),
            date    = mm+ '/'+dd+'/'+yyyy; 
            // need to make an array of tags

            
        var newBlog = {title: title, tags: tags, content: content, postDate: date};
        console.log(newBlog);
        // create new blog post with data
        Blog.create(newBlog, function(err, blog){
            if(err) {
                console.log('something went wrong!');
                console.log('err');
                res.redirect('/blog/new');
            } else {
                console.log('Blog added to the database!');
                req.flash('success', 'You\'ve added a new blog!');
                res.redirect('/blog/' + blog.title);
            }
        });
    });
// //blog show route

router.get('/blog/:title', function(req, res) {
    Blog.findOne({'title': req.params.title}, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog post doesn\'t exist!');
            res.redirect('/blog');
        } else {
            res.render('blogs/show', {blog: foundBlog});
        }
    });
});
// Edit and Update Blog Routes

router.get('/blog/:id/edit', function(req, res) {
    res.render('');
});

router.put('/blog/:id', function(req, res) {
    res.redirect('/blog/:id');
});

// Delete Blog Route

router.delete('/blog/:id', function(req, res){
    res.redirect('/blog')
});

module.exports = router;