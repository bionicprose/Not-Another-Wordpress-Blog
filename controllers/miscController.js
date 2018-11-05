/* Controller for misc routes */
var Blog = require('../models/blog.js');
const nodemailer = require('nodemailer');



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

exports.misc__contact__post = function(req, res) {

/********************* */
/* nodemailer config */
/******************** */

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });
       // setup email data with unicode symbols
       let mailOptions = {
        from: req.body.name+ ' ' + req.body.email, // sender address
        to: 'email', // list of receivers
        subject: req.body.aOfI, // Subject line
        text: 'company: ' + req.body.company + '\n' + 'role: ' + req.body.role + '\n' + req.body.message, // plain text body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
Blog.find({}, function(err, foundBlogs) {
    res.render('thankyou', {blogs:foundBlogs, title: 'Thank You'});
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