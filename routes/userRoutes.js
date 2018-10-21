var express = require("express"),
  passport = require('passport'),
  router = express.Router({ mergeParams: true }),
  middleware = require("../middleware"),
  multer = require("multer"),
  user__controller = require('../controllers/userController');



////////////////////////
// admin route
///////////////////////
router.get("/admin", middleware.isAdmin, user__controller.user__admin__get);

//////////////////////////////
// Edit and Update User Routes
//////////////////////////////



router.put(
  "/user/:user",
  middleware.isUser,
  multer(middleware.multerProfilePic).single("profilePic"), user__controller.user__update__post);
  


/////////////////////
// Login
////////////////////

router.get("/login", function(req, res, next) {
  console.log(req.flash("loginMessage"));
  res.render("login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  })
);

/////////////////
// signup
////////////////

router.get("/signup", function(req, res) {
  res.render("signup", { message: req.flash("signupMessage") });
});

router.post(
  "/signup",
  middleware.validify,
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

///////////////////////
// Profile section
//////////////////////

router.get("/profile", middleware.isLoggedIn, user__controller.user__profile__get);

//////////////////////
// Facebook Routes
/////////////////////

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"]
  })
);

router.get("/auth/facebook/callback", user__controller.user__facebook__callback);

////////////////////////
// Twitter Routes for future use
///////////////////////

// app.get('/auth/twitter', passport.authenticate('twitter'));

// app.get('auth/twitter/callback',
//     passport.authenticate('twitter', {
//         successRedirect: '/profile',
//         failureRedirect: '/'

// }));

///////////////////
// Google Routes
////////////////////



router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", user__controller.user__google__callback);



///////////////////////
// Logout
////////////////////////

router.get("/logout", user__controller.user__logout);


  /************ */
/* catchall   */

router.get('/*', user__controller.user__catchall);
module.exports = router;
// module.exports = app;
