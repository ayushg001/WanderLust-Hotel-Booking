const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =   require("../models/listing.js");           //listing model
const {  isLoggedIn  , isOwner , validateListing } = require("../middleware.js")         //middleware
const listingController = require("../controllers/listings.js")
const multer = require("multer");                               //to parse the form data
const {storage} = require("../cloudConfig.js");
const upload = multer( { storage });                   //multer will extract the files from form , and save the files into
                                                                //upload folder


router.route("/")
//1. index route 
.get( wrapAsync(listingController.index) )

 //create route
.post(    isLoggedIn  ,upload.single("listing[image]") ,  validateListing , wrapAsync(listingController.createListing));
                               //multer will process the image-data, send it to req.file 




//3. create(new)  route   //put this before :id route
router.get( "/new" ,  isLoggedIn , wrapAsync( listingController.renderNewForm ));



router.route("/:id")
 //2. show route
.get(  wrapAsync(listingController.showListing ))

//update route
.put (  isLoggedIn , isOwner,  upload.single("listing[image]") ,  validateListing  , wrapAsync( listingController.updateListing ))

//5. delete route
.delete( isLoggedIn , isOwner, wrapAsync( listingController.destroyListing));

 



 //4. edit route
router.get( "/:id/edit" , isLoggedIn , isOwner,  wrapAsync(listingController.renderEditForm )
);


module.exports = router