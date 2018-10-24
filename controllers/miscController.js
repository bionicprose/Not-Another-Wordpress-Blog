/* Controller for misc routes */
var Blog = require('../models/blog.js');

/* about page */

exports.misc__about__get = function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
        res.render('about', {blogs: foundBlogs, title: 'About Bionic Prose & Zac Goodall'});
    });
    
}

/* projects page */

exports.misc__projects__get = function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
    res.render('projects', {blogs: foundBlogs, title: 'Projects'});
    });
}

/* contact page */
exports.misc__contact__get = function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
    res.render('contact', {blogs: foundBlogs, title: 'Contact Bionic Prose'});
    });
}

/* demo page */
exports.misc__demo__get = function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
    res.render('demo', {blogs: foundBlogs, title: 'Bionic Prose demo'});
    });
}

/* acknowledgments page */

exports.misc__acknowledgements__get = function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
        res.render('acknowledgements', {blogs: foundBlogs, title: 'Bionic Prose Acknowledgements'});
        });
}