var express = require('express'),
    router  = express.Router({mergeParams:true}),
    User    = require('../models/user');


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
    res.redirect('/user/show');
});


//////////////////////////////
//Destroy User Routes
/////////////////////////////
router.delete('/user/:user', function(res, req) {
    res.render('user/index');
});


module.exports = router;