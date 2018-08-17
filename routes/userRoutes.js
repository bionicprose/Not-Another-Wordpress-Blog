var express = require('express'),
    router  = express.Router({mergeParams:true}),
    User    = require('../models/user'),
    middleware  = require('../middleware'),
    Blog    = require('../models/blog'),
    Comment = require('../models/comments');




////////////////////////
// admin route need to add isAdmin middleware to routes
///////////////////////
router.get('/admin', function(req, res) {
    Blog.find({}, function(err, foundBlog) {
        User.find({}, function(err, foundUser) {
            Comment.find({}, function(err, foundComment) {
                res.render('admin/admin', {blogs: foundBlog, users: foundUser, comments: foundComment});

            });
        });

        });
    });

//////////////////////////////
//Index Route /writers only
//////////////////////////////

router.get('/user', function(req, res) {
    res.render('user/index');
});

//////////////////////////////
// New User Routes
/////////////////////////////

router.get('/user/new', function(req, res) {
    res.render('user/new');
});

router.post('/user', function(req, res) {
    
});

//////////////////////////////////////////////
// User Show Route / to see other user profiles
///////////////////////////////////////////////
router.get('/user/:user', function(req, res) {
    res.render('user/show');
});


//////////////////////////////
// Edit and Update User Routes
//////////////////////////////

router.get('/user/:user/edit', function(req, res) {
    res.render('user/edit');
});

router.put('/user/:user', function(req, res) {
    User.findByIdAndUpdate(req.params.user, req.body.user, function(err, updatedUser){
        if(err || !updatedUser) {
            req.flash('error', 'Sorry, that user could not be updated.');
        } else {
            req.flash('notify', 'You have updated ' + updatedUser.name + '.');
            res.redirect('/admin');
        }
    });
});


//////////////////////////////
//Destroy User Routes
/////////////////////////////
router.delete('/user/:user', function(res, req) {
    res.render('user/index');
});


module.exports = router;