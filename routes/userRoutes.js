var express = require('express'),
    router  = express.Router({mergeParams:true}),
    User    = require('../models/user'),
    middleware  = require('../middleware'),
    Blog    = require('../models/blog'),
    Comment = require('../models/comments'),
    multer = require('multer'),
    shell   = require('shelljs');

// config from Jesse Lewis @ https://medium.com/@Moonstrasse/how-to-make-a-basic-html-form-file-upload-using-multer-in-an-express-node-js-app-16dac2476610
const multerConfig = {
    limits: { fieldSize: 25 * 1024 * 1024,
                fileSize: 50000},
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



////////////////////////
// admin route need to add isAdmin middleware to routes
///////////////////////
router.get('/admin', middleware.isAdmin, function(req, res) {
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

router.put('/user/:user', middleware.isUser, multer(multerConfig).single('profilePic'), function(req, res) {
    User.findOne({'_id': req.params.user}, function(err, foundUser) {
        if(err||!foundUser) {
            req.flash('error', 'There was a problem loading that user.');
            res.redirect('back');
        } else {
            var oldPic = foundUser.pic.split('/');
            shell.rm('/home/zac/webdev/bionicprose/public/bionicUser/'+foundUser._id+'/'+oldPic[3]);
            User.findByIdAndUpdate(req.params.user, {'pic': '../bionicUser/'+req.user.id+'/'+ res.req.file.filename}, function(err, updatedUser){
        if(err || !updatedUser) {
            req.flash('error', 'Sorry, that user could not be updated.');
            res.redirect('back');
        } else {
            req.flash('notify', 'You have updated ' + updatedUser.name + '.');
            res.redirect('back');
        }
    });
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