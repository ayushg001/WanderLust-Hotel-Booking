const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =   require("../models/listing.js");           //listing model
const {  isLoggedIn  , isOwner , validateListing } = require("../middleware.js")         //middleware

const listingController = require("../controllers/listings.js")


//1. index route 
router.get( "/" , wrapAsync(listingController.index) );
 
 //3. create(new)  route
 router.get( "/new" ,  isLoggedIn , wrapAsync( listingController.renderNewForm ));

 //2. show route
 router.get( "/:id" , wrapAsync(listingController.showListing ));

 //create route
router.post( "/" ,    isLoggedIn  , validateListing , wrapAsync(listingController.createListing));

 //4. edit route
router.get( "/:id/edit" , isLoggedIn , isOwner,  wrapAsync(listingController.renderEditForm )
);

//update route
router.put ("/:id"   ,  isLoggedIn , isOwner, validateListing  , wrapAsync( listingController.updateListing )
);


//5. delete route
router.delete( "/:id" ,isLoggedIn , isOwner, wrapAsync( listingController.destroyListing));

module.exports = router