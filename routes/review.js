const express = require("express");
const router = express.Router({mergeParams : true});  // to merge the child path with parent path
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js")              //review model
const Listing =   require("../models/listing.js");           //listing model
const {  validateReview  , isLoggedIn, isReviewAuthor} = require("../middleware.js")  

const reviewController = require("../controllers/reviews.js")

//reviews - post route
router.post("/" , isLoggedIn,  validateReview, wrapAsync(reviewController.createReview));
 
 //Delete - Review Route
router.delete( "/:reviewId" ,isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyReview));

 module.exports = router;