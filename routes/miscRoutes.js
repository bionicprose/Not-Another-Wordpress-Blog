var express = require("express"),
  passport = require('passport'),
  router = express.Router({ mergeParams: true }),
  misc__controller = require('../controllers/miscController');


  /* About page */

router.get('/about', misc__controller.misc__about__get);

/* Projects page */

router.get('/projects', misc__controller.misc__projects__get);

/* Contact page */

router.get('/contact', misc__controller.misc__contact__get);

/* Demo page -- I might put this in blog routes*/

router.get('/demo', misc__controller.misc__demo__get);



/* acknowlegement page */

router.get('/acknowledgements', misc__controller.misc__acknowledgements__get);

module.exports = router;