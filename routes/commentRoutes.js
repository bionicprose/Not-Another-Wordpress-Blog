var express = require("express"),
  router = express.Router({ mergeParams: true }),
  middleware = require("../middleware");


  // comment controller

  var comment__controller = require('../controllers/commentController');
// NEW Comment Routes -- no get routes for new comments or replies because
//                        comment forms are generated in DOM on blog posts



router.post("/blog/:url/comments", middleware.isLoggedIn, comment__controller.comment__new__post);

//////////////////////////////
// new reply
/////////////////////////////

router.post("/blog/:url/comments/:comment", middleware.isLoggedIn, comment__controller.comment__reply__post);
//////////////////
// Edit 
/////////////////

router.get(
  "/blog/:url/comments/:comments_id/edit", middleware.isCommenter, comment__controller.comment__edit__get);
  middleware.isCommenter,
  

////
//update
///

router.put("/blog/:url/comments/:comments_id", middleware.isCommenter, comment__controller.comment__edit__post);

//////////////////
// DESTROY Route/
////////////////

router.delete(
  "/blog/:url/comments/:comments_id",
  middleware.isCommenter, comment__controller.comment__delete);
  

module.exports = router;
