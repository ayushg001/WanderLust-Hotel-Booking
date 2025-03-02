const express = require("express");
const router = express.Router({mergeParams : true});  // to merge the child path with parent path
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js")              //review model
const Listing =   require("../models/listing.js");           //listing model
const {  validateReview  , isLoggedIn, isReviewAuthor} = require("../middleware.js")  


//reviews - post route
router.post("/" , isLoggedIn,  validateReview, wrapAsync( async (req,res) => {    ///listings/:id/reviews
    console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

 newReview.author = req.user._id;
 console.log(newReview)
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save(); // updating the listing
    req.flash("success" , "New Review Created!")
   res.redirect(`/listings/${listing._id}`)
 
 }));
 
 //Delete - Review Route
router.delete( "/:reviewId" ,isLoggedIn, isReviewAuthor, wrapAsync ( async (req,res) => {   ///listings/:id/reviews/:reviewId
     let { id , reviewId } = req.params;   
 
     await Listing.findByIdAndUpdate(id , { $pull : { reviews : reviewId } });
     await Review.findByIdAndDelete(reviewId);
     req.flash("success" , "Review Deleted!")
     res.redirect(`/listings/${id}`)
 }));

 module.exports = router;