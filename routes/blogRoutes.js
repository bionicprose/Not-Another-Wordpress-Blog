var express = require('express'),
    app     = express(),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog'),
    moment  = require('moment'),
    methodOverride = require('method-override'),
    middleware = require('../middleware');

app.use(methodOverride('_method'));

////////////////////////New Blog Route


router.get('/blog/new', function(req, res) {
    res.render('blogs/new', {title: 'New Blog Post on Bionic Prose'});
});



router.post('/blog', middleware.isBlogger, function(req, res) {
    // get data from form
    console.log(req.body.content);
    var title = req.body.title,
        tags = req.body.tags.split(','),
        content = req.body.content,
        state = req.body.state,
        date = moment(),
        author = {
            id: req.user._id
        };
        // need to make an array of tags
        if(req.user.local.username) {
            var username = req.user.local.username;
        } else {
            var username = req.user.local.name;
        }
        
    var newBlog = {title: title, tags: tags, content: content, postDate: date, author : author, 'author.username': username, state: state};
    console.log(newBlog);
    // create new blog post with data
    Blog.create(newBlog, function(err, blog){
        if(err) {
            console.log('something went wrong!');
            console.log(err);
            res.redirect('/blog/new');
        } else {
            console.log('Blog added to the database!');
            req.flash('success', 'You\'ve added a new blog!');
            if(newBlog.state === 'draft') {
                req.flash('notify', 'That post has not been published yet.');
                res.redirect('/profile');
            } else {
            res.redirect('/blog/' + blog.title);
        }
    }
    });
});

// blog index route


router.get('/blog', function(req, res) {
    Blog.find({'state': 'publish'}, function(err, blogs) {
        res.render('blogs/index', {blogs: blogs});
    
    });
});





// router.post('/blog', middleware.isBlogger, function(req, res) {
//         // get data from form
//         var title = req.body.title,
//             tags = req.body.tags.split(','),
//             content = req.body.content.replace(/\r\n\r\n/gi, '<p>').replace(/\r\n/g, '').replace(/\n/g, '<p>');
//             date = moment(),
//             author = {
//                 id: req.user._id
//             };
//             // need to make an array of tags
//             if(req.user.local.username) {
//                 var username = req.user.local.username;
//             } else {
//                 var username = req.user.local.name;
//             }
            
//         var newBlog = {title: title, tags: tags, content: content, postDate: date, author : author, 'author.username': username};
//         console.log(newBlog);
//         // create new blog post with data
//         Blog.create(newBlog, function(err, blog){
//             if(err) {
//                 console.log('something went wrong!');
//                 console.log('err');
//                 res.redirect('/blog/new');
//             } else {
//                 console.log('Blog added to the database!');
//                 req.flash('success', 'You\'ve added a new blog!');
//                 res.redirect('/blog/' + blog.title);
//             }
//         });
//     });
//////////////////////
// //blog show route
/////////////////////

router.get('/blog/:title', function(req, res) {
    Blog.findOne({'title': req.params.title}).populate('comments').exec(function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog post doesn\'t exist!');
            res.redirect('/blog');
        } else if (foundBlog.state == 'draft') {
            req.flash('error', 'Sorry, that blog has not been published yet.');
            res.redirect('/blog');
        } else {
            res.render('blogs/show', {blog: foundBlog});
            console.log(foundBlog.comments);
        }
    });
});

//////////////////////////////
// Edit and Update Blog Routes
//////////////////////////////

router.get('/blog/:title/edit', middleware.isOwner, function(req, res) {
    Blog.findOne({'title': req.params.title}, function(err, foundBlog) {
        console.log(req.params.title);
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog post doesn\'t exist.');
            res.redirect('/blog');
    } else {
        res.render('blogs/edit', {blog: foundBlog});
    }
        });
});

router.put('/blog/:title', middleware.isOwner, function(req, res) {
        req.body.blog.tags = req.body.blog.tags.split(',');
        req.body.blog.editDate = moment();
    Blog.find({'title': req.params.title}, function(err, foundBlog) {
        if(err) {
            console.log('finding the blog by title' + err + foundBlog);
            req.flash('error', 'Sorry, that blog post doesn\'t exist.');
        } else {
            
            Blog.findByIdAndUpdate(foundBlog, req.body.blog, function(err, updatedBlog) {
                if(err || !updatedBlog) {
                console.log('finding and updating the blog' + err + foundBlog);
                req.flash('error', 'Sorry, that blog post doesn\'t exist.');
        } else {
            req.flash('success', 'You have updated '+foundBlog.title+'.');
            res.redirect('/blog/' + updatedBlog.title);
        }
    });
    }
});
});

// Destroy route!!!

router.delete('/blog/:title', middleware.isOwner, function(req, res){
    Blog.find({'title': req.params.title}, function(err, foundBlog){
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog does not exist!');
        } else {
            Blog.findByIdAndDelete(foundBlog, function(err) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Sorry, something went wrong!");
                } else {
                    req.flash('success', 'You\'ve deleted the post \''+req.params.title+'\'.');
                    res.redirect('/blog');
                }
            });
    }
    });
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
module.exports = router;