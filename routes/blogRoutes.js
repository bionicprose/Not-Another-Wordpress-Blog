var express = require("express"),
  app = express(),
  router = express.Router({ mergeParams: true }),
  methodOverride = require("method-override"),
  middleware = require("../middleware"),
  multer = require("multer");

// controllers
var blog__controller = require("../controllers/blogController");


app.use(methodOverride("_method"));

////////////////////////New Blog Route

router.get("/blog/new", middleware.isBlogger, blog__controller.blog__new__get);

router.post(
  "/blog",
  middleware.isBlogger,
  multer(middleware.multerConfig).single("image"),
  blog__controller.blog__new__post
);

// blog index route
router.get("/", blog__controller.blog__list);



//////////////////////
// //blog show route
/////////////////////

router.get("/blog/:url", blog__controller.blog__show);

//////////////////////////////
// Edit and Update Blog Routes
//////////////////////////////

router.get(
  "/blog/:url/edit",
  middleware.isOwner,
  blog__controller.blog__update__get
);

router.put(
  "/blog/:url",
  middleware.isOwner,
  multer(middleware.multerConfig).single("image"),
  blog__controller.blog__update__post
);

/////////////////////////////////////////////////////
// Destroy route!!!
////////////////////////////////////////////////////////

router.delete("/blog/:url", middleware.isOwner, blog__controller.blog__delete);

// TAGS Route

router.get("/blog/tag/:tag", blog__controller.blog__tags);

// Search Route
router.post("/blog/search", blog__controller.blog__search__post);

module.exports = router;
