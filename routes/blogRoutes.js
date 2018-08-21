var express = require('express'),
    app     = express(),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog'),
    moment  = require('moment'),
    methodOverride = require('method-override'),
    middleware = require('../middleware'),
    multer      = require('multer');
    // upload      = multer({ dest: '../public/uploads'},
    //                      {name: 'avatar', maxCount: 1});
// config from Jesse Lewis @ https://medium.com/@Moonstrasse/how-to-make-a-basic-html-form-file-upload-using-multer-in-an-express-node-js-app-16dac2476610
    const multerConfig = {
        storage: multer.diskStorage({

            destination: function(req, file, next) {
                next(null, '/home/zac/webdev/bionicprose/public/bionicUser/' + req.user.id);
            },

            filename: function(req, file, next) {
                console.log(file);
                const ext = file.mimetype.split('/')[1];
                next(null, file.fieldname + '-' + Date.now() + '.' + ext);
            }
        }),

        fileFilter: function(req, file, next) {
            if(!file) {
                next();
            }
            const image = file.mimetype.startsWith('image/');
            if(image){
                console.log('photo uploaded');
                next(null, true);
            } else {
                console.log('file not support');

            req.flash('error', 'You cannot upload an image of that file type.');
            return next();
            }
        }
    };

app.use(methodOverride('_method'));

////////////////////////New Blog Route


router.get('/blog/new', middleware.isBlogger, function(req, res) {
    res.render('blogs/new', {title: 'New Blog Post on Bionic Prose'});
});



router.post('/blog', middleware.isBlogger, multer(multerConfig).single('image'), function(req, res) {
    // get data from form
    console.log(req.body.content);
    
    var title = req.body.title,
        tags = req.body.tags.split(','),
        content = req.body.content,
        state = req.body.state,
        url = title.replace(/[^\w\s]/g, '').replace(/[\s]/g, '-'),
        date = moment().format('MMM Do YYYY'),
        author = {
            id: req.user._id
        };
        // need to make an array of tags
        if(req.user.local.username) {
            var username = req.user.local.username;
        } else {
            var username = req.user.local.name;
        }
        
    var newBlog = {title: title, tags: tags, content: content, postDate: date, author : author, 'author.username': username, state: state, url: url, headerImg: '../bionicUser/'+ req.user.id + '/' + res.req.file.filename};
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
            res.redirect('/blog/' + blog.url);
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

router.get('/blog/:url', function(req, res) {
    Blog.findOne({'url': req.params.url}).populate('comments').exec(function(err, foundBlog) {
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

router.get('/blog/:url/edit', middleware.isOwner, function(req, res) {
    Blog.findOne({'url': req.params.url}, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log('req.params.url ' + req.params.url);
            req.flash('error', 'Sorry, that blog post doesn\'t exist.');
            res.redirect('/blog');
    } else {
        console.log('hello?');
        res.render('blogs/edit', {blog: foundBlog});
    }
        });
});

router.put('/blog/:url', middleware.isOwner, multer(multerConfig).single('image'),  function(req, res) {
    console.log(req.body.blog);
      if(req.body.state === 'publish-only') {
            var postDate = moment().format('MMM Do YYYY');
            Blog.find({'url': req.params.url}, function(err, foundBlog) {
                if(err) {
                    console.log('finding the blog by title' + err + foundBlog);
                    req.flash('error', 'Sorry, that blog post doesn\'t exist.');

                } else {
                    
                   Blog.findByIdAndUpdate(foundBlog, { state: 'publish', postDate : postDate}, function(err, updatedBlog) {
                        if(err || !updatedBlog) {
                            console.log('finding and updating the blog' + err + foundBlog);
                            req.flash('error', 'Sorry, that blog post doesn\'t exist.');
                        } else {
                            req.flash('success', 'You have updated '+foundBlog.title+'.');
                            res.redirect('/profile');
                        }
                    });
                }
            }); 
    } else {
       
        if(res.req.file) {
            console.log('image got uploaded?' + res.req.file.filename);
            req.body.blog.headerImg = '../bionicUser/' + req.user.id + '/' + res.req.file.filename;
        }
        req.body.blog.tags = req.body.blog.tags.split(',');
        req.body.blog.url = url = req.body.blog.title.replace(/[^\w\s]/g, '').replace(/[\s]/g, '-'),
        req.body.blog.editDate = moment().format('MMM Do YYYY');
        Blog.find({'url': req.params.url}, function(err, foundBlog) {
            if(err) {
                console.log('finding the blog by title' + err + foundBlog);
                req.flash('error', 'Sorry, that blog post doesn\'t exist.');

        } else {
            
            Blog.findByIdAndUpdate(foundBlog, req.body.blog, function(err, updatedBlog) {
                if(err || !updatedBlog) {
                    console.log('finding and updating the blog' + err + foundBlog);
                    req.flash('error', 'Sorry, that blog post doesn\'t exist.');
                } else {
                    req.flash('notify', 'You have updated '+foundBlog.title+'.');
                    res.redirect('/blog/' + updatedBlog.url);
        }
    });
    }
});
    }
});

// Destroy route!!!

router.delete('/blog/:url', middleware.isOwner, function(req, res){
    Blog.find({'url': req.params.url}, function(err, foundBlog){
        if(err || !foundBlog) {
            console.log(err + 'foundblog ' + foundBlog);
            req.flash('error', 'Sorry, that blog does not exist!');
        } else {
            Blog.findByIdAndDelete(foundBlog, function(err) {
                if(err) {
                    console.log(err + 'finding and deleting by id');
                    req.flash("error", "Sorry, something went wrong!");
                } else {
                    console.log('success but not really?');
                    req.flash('success', 'You\'ve deleted the post \''+req.params.title+'\'.');
                    res.redirect('back');
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