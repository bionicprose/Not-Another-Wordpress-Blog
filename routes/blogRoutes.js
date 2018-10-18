
var express = require('express'),
    app     = express(),
    router  = express.Router({mergeParams:true}),
    Blog    = require('../models/blog'),
    moment  = require('moment'),
    methodOverride = require('method-override'),
    middleware = require('../middleware'),
    multer      = require('multer'),
    shell       = require('shelljs'),
    Comment     = require('../models/comments');
    // upload      = multer({ dest: '../public/uploads'},
    //                      {name: 'avatar', maxCount: 1});
// config from Jesse Lewis @ https://medium.com/@Moonstrasse/how-to-make-a-basic-html-form-file-upload-using-multer-in-an-express-node-js-app-16dac2476610
    const multerConfig = {
        limits: { fieldSize: 25 * 1024 * 1024},
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
    // get images in users directory for use in picking blog header and or inserting into content
    if(req.user) {
    let images = shell.ls('/home/zac/webdev/bionicprose/public/bionicUser/' + req.user.id);
    res.render('blogs/new', {title: 'New Blog Post on Bionic Prose', images: images, user: req.user});}
    else {
        res.render('blogs/new', {title: 'New Blog Post on Bionic Prose'});
    }
});



router.post('/blog', middleware.isBlogger, multer(multerConfig).single('image'), function(req, res) {
    // get data from form
    console.log(req.body.fontSize);
    var date = new Date();
    var title = req.body.title,
        titleSettings = {
            fontSize : req.body.fontSize,
            fontLeft : req.body.fontLeft,
            fontTop  : req.body.fontTop,
            fontColor : req.body.color
        },
        heroSettings = { 
            size :req.body.size,
            positionX : req.body.positionX,
            positionY: req.body.positionY,
            gradient: req.body.gradient },
        content = req.body.content,
        state = req.body.state,
        url = title.replace(/[^\w\s]/g, '').replace(/[\s]/g, '-'),
        date = date.toDateString(),
        // date = moment().format('MMM Do YYYY'),
        author = {
            id: req.user._id
        };
        if(req.body.tags) {
            var tags = req.body.tags.split(/[,' ']/g);
            tags = tags.filter(Boolean);
        } else {
            var tags = null;
        }
        // need to make an array of tags
        if(req.user.local.username) {
            var username = req.user.local.username;
        } else {
            var username = req.user.local.name;
        }
        if(res.req.file) { // checks for an uploaded image
            heroSettings.heroImg = '../bionicUser/'+ req.user.id + '/' + res.req.file.filename;
    var newBlog = {title: title, tags: tags, content: content, postDate: date, author : author, 'author.username': username, state: state, url: url, heroSettings: heroSettings, titleSettings: titleSettings };
        } else if (req.body.pickedImage) { // checks for a selected image alraedy uploaded
            heroSettings.heroImg = req.body.pickedImage;
    var newBlog = {title: title, tags: tags, content: content, postDate: date, author : author, 'author.username': username, state: state, url: url, heroSettings: heroSettings, titleSettings: titleSettings };     
         } else {  // skips headerImg if nothing was uploaded or selected. Still adds title settings
            var newBlog = {title: title, tags: tags, content: content, postDate: date, author : author, 'author.username': username, state: state, url: url, titleSettings: titleSettings };
         } console.log(newBlog);
    // create new blog post with data
    Blog.create(newBlog, function(err, blog){
        if(err) {
            console.log('something went wrong!');
            console.log(err);
            res.redirect('/blog/new');
        } else {
            console.log('Blog added to the database!');
            req.flash('info', 'You\'ve added a new blog!');
            if(newBlog.state === 'draft') {
                req.flash('info', 'That post has not been published yet.');
                res.redirect('/profile');
            } else {
            res.redirect('/blog/' + blog.url);
        }
    }
    });
});

// blog index route


router.get('/blog', function(req, res) {
   
    Blog.find({'state': 'publish'}).sort({createDate: 'descending'}).exec(function(err, blogs) {
      res.render('blogs/index', {blogs: blogs});
    
    });
   
        
    
  

});


//////////////////////
// //blog show route
/////////////////////

router.get('/blog/:url', function(req, res) {
    Blog.findOne({'url': req.params.url}).lean().populate('comments').exec(function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash('error', 'Sorry, that blog post doesn\'t exist!');
            res.redirect('/blog');
        } else if (foundBlog.state == 'draft') {
            req.flash('error', 'Sorry, that blog has not been published yet.');
            res.redirect('/blog');
        } else {
            if(foundBlog.comments.length >0) {
                Comment.find({'blogPost.id': foundBlog._id}).lean().exec(function(err, foundComments){
                    if(err) {
                        return Error('No comments found');
                    } else {
                        Blog.find({'state': 'publish'}).sort({createDate: 'descending'}).exec(function(err, blogs) {
                            if(err) {
                                return Error('no blog posts found for calendar');
                            } else {
                              res.render('blogs/show', {blog: foundBlog, comments: foundComments, blogs: blogs});
                            }
                });
             }
            });
         } else {
            Blog.find({'state': 'publish'}).sort({createDate: 'descending'}).exec(function(err, blogs) {
                if(err) {
                    return Error('no blog posts found for calendar');
                } else {
                res.render('blogs/show', {blog:foundBlog, blogs: blogs});
            }
        });
    
        }
    }
});
});



//////////////////////////////
// Edit and Update Blog Routes
//////////////////////////////

router.get('/blog/:url/edit', middleware.isOwner, function(req, res) {
    let images = shell.ls('/home/zac/webdev/bionicprose/public/bionicUser/' + req.user.id);
    Blog.findOne({'url': req.params.url}, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log('req.params.url ' + req.params.url);
            req.flash('error', 'Sorry, that blog post doesn\'t exist.');
            res.redirect('/blog');
    } else {
        console.log('hello?');
        newTags = foundBlog.toObject();
        console.log(newTags);
        if(newTags.tags !== null) {
        var tags = '';
        for(let i = 0; i<newTags.tags.length; i++) {
            
            tags += newTags.tags[i] + ', ';
            console.log(tags);
        }
    
    }
        res.render('blogs/edit', {blog: foundBlog, user: req.user, images: images, tags: tags});
    }
        });
});

router.put('/blog/:url', middleware.isOwner, multer(multerConfig).single('image'),  function(req, res) {
    
      if(req.body.state === 'publish-only') {
            var postDate = moment().format('MMM Do YYYY');
            Blog.find({'url': req.params.url}, function(err, foundBlog) {
                if(err) {
                    console.log('******finding the blog by title' + err + foundBlog);
                    req.flash('error', 'Sorry, that blog post doesn\'t exist.');

                } else {
                    
                   Blog.findByIdAndUpdate(foundBlog, { state: 'publish', postDate : postDate}, function(err, updatedBlog) {
                        if(err || !updatedBlog) {
                            console.log('finding and updating the blog' + err + foundBlog);
                            req.flash('error', 'Sorry, that blog post doesn\'t exist.');
                        } else {
                            req.flash('info', 'You have updated '+foundBlog.title+'.');
                            res.redirect('/profile');
                        }
                    });
                }
            }); 
    } else {
       
        Blog.find({'url': req.params.url}, function(err, foundBlog) {
            if(err) {
                console.log('finding the blog by url-title' + err + foundBlog);
                req.flash('error', 'Sorry, that blog post doesn\'t exist.');

            } else {
                console.log('finding the blog by title' + foundBlog);
                var newBlog = foundBlog;
               
        if(res.req.file) { //checking for uploaded image
            console.log('image got uploaded?' + res.req.file.filename);
            var heroImg = '../bionicUser/' + req.user.id + '/' + res.req.file.filename;
        } else if(req.body.pickedImage) { //checking for selected image
            console.log('picked image was picked ' + req.body.pickedImage);
            var  heroImg = req.body.pickedImage;
        } else { // if neither, use old image
            console.log('no picked image');
             var heroImg = req.body.currentImage;
        }
        newBlog = {
         titleSettings : {
            fontSize : req.body.fontSize,
            fontLeft : req.body.fontLeft,
            fontTop  : req.body.fontTop,
            fontColor : req.body.fontColor
        },
            content : req.body.content,
            title : req.body.title,
            url : req.body.title.replace(/[^\w\s]/g, '').replace(/[\s]/g, '-'),
            editDate : moment().format('MMM Do YYYY'),
       
         heroSettings : { 
                    heroImg : heroImg,
                    size :req.body.size,
                    positionX : req.body.positionX,
                    positionY: req.body.positionY,
                    gradient: req.body.gradient },
         };

        if (req.body.tags) {
            newBlog.tags = req.body.tags.split(/[,' ']/g);
            newBlog.tags = newBlog.tags.filter(Boolean);
        
        }
            console.log('this is the supposedly new blog: ' + newBlog);
            Blog.findByIdAndUpdate(foundBlog, newBlog, function(err, updatedBlog) {
                if(err || !updatedBlog) {
                    console.log('finding and updating the blog' + err + foundBlog);
                    req.flash('error', 'Sorry, that blog post doesn\'t exist.');
                } else {
                    req.flash('info', 'You have updated '+updatedBlog.title+'.');
                    res.redirect('/blog/' + updatedBlog.url);
        }
    });
    }
});
    }
});
/////////////////////////////////////////////////////
// Destroy route!!!
////////////////////////////////////////////////////////

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
                    req.flash('info', 'You\'ve deleted the post \''+foundBlog.title+'\'.');
                    res.redirect('back');
                }
            });
    }
    });
});

// TAGS Route

router.get('/blog/tag/:tag', function(req, res) {
    Blog.find({'tags': req.params.tag}, function(err, foundBlogs) {
        if(err || !foundBlogs) {
            req.flash('error', 'Sorry, but there are no blog posts with those tags.');
            res.redirect('back');
        } else {
            Blog.find({'state': 'publish'}).sort({createDate: 'descending'}).exec(function(err, blogs) {
                if(err) {
                    console.log(err);
                    req.flash('error', 'No published blogs found');
                    res.redirect('back');
                } else {
            res.render('blogs/tags', {tag: req.params.tag, blogs: blogs, foundBlogs: foundBlogs});
        }
    });
}

    });
});

// Middleware that might need to be removed
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
// Search Route
router.get('/blog/search', function(req, res) {
    res.render('/blog/search');
});

router.post('/blog/search', function(req, res) {
    // console.log(req.body.search);
    var searchArray = req.body.search.split(' ');
    var regexp = searchArray.map(function(x) {
        x = x.replace(/[^a-z0-9\-]/gi, '');
        var temp = new RegExp(x, 'i');
        return temp;

    });
    // var regexp = searchArray.map(function(x) {
    //     var temp = new RegExp(x, 'i');
    //     console.log(temp);
    //     return temp;
    // });
    console.log(regexp[0]);
    var testArray = ['Blecho', 'Titles'];
   
    console.log(regexp.length);
    // Blog.find({$or:[{title: {$in: regexp}}, {'author.username': regexp}]}, function(err, foundBlogs) 
    Blog.find({$or: [{title: {$in: regexp}}, {content: {$in: regexp}}, {tags: {$in: regexp}}, {'author.username': {$in: regexp}}]}, function(err, foundBlogs){
        if(err) {
            req.flash('error', 'Sorry, but your search did not find anything.');
            res.redirect('back');
        } else {
            Blog.find({'state': 'publish'}).sort({createDate: 'descending'}).exec(function(err, blogs) {
                if(err) {
                    req.flash('error', 'No blogs found for calendar');
                    return next;
                } else {
            console.log(foundBlogs.length + ' ' + blogs.length);
            res.render('blogs/search', {blog: foundBlogs, blogs: blogs, searchTerms: searchArray});
        }
    });
}
});
});



// fetch route

// router.get('/blog/:month', function(req, res) {
//     Blog.find({'postDate' : req.params.month}, function(err, foundBlogs))
// })
module.exports = router;