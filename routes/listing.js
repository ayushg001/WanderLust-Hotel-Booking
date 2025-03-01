const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =   require("../models/listing.js");           //listing model
const {  isLoggedIn  , isOwner , validateListing } = require("../middleware.js")         //middleware




//1. index route 
router.get( "/" , wrapAsync( async (req,res) => {
    let allListings =  await Listing.find({});
     res.render( "listings/index.ejs" , {allListings})
     
 }) 
 );
 
 //3. create(new)  route
 router.get( "/new" ,  isLoggedIn , wrapAsync( (req,res) =>{
    
     res.render("listings/new.ejs")
 } ));

 //2. show route
 router.get( "/:id" , wrapAsync( async (req,res) => {
    let { id } = req.params;
       const listing = await Listing.findById(id).populate("reviews").populate("owner");
       if(!listing){
        req.flash("error" , "Listing not found!")
        res.redirect("/listings")
       }
       console.log(listing)
        res.render("listings/show.ejs" , {listing});
    
    })
    );

    //create route
router.post( "/" ,    isLoggedIn  , validateListing , wrapAsync(  async (req,res,next) =>{
            const newlisting = new Listing(req.body.listing);
           
            newlisting.owner = req.user._id;                     // storing the current user id in the newlisting.  
            await newlisting.save();
            req.flash("success" , "New Listing Created !")
             res.redirect("/listings")
    })      
    );

    //4. edit route
router.get( "/:id/edit" , isLoggedIn , isOwner,  wrapAsync(  async (req,res) =>{
    let { id } = req.params;  
    const listing  =  await Listing.findById(id)
    if(!listing){
        req.flash("error" , "Listing not found!")
        res.redirect("/listings")
       }
    res.render("listings/edit.ejs" , {listing});
})
);

//update route
router.put ("/:id"   ,  isLoggedIn , isOwner, validateListing  , wrapAsync(  async (req,res) => {
    let { id } = req.params;  
    
//if don't return , the operations below will also run

    // const { title, description, image, price, country, location } = req.body;
    // const updatedListing =  await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location });
    const updatedListing  =  await Listing.findByIdAndUpdate(id ,{ ...req.body.listing} );
//     const updatedListing  =  await Listing.findByIdAndUpdate(id ,req.body.listing );
//    this  also works fine
console.log(req.body);
console.log(updatedListing)
req.flash("success" , "Listing Updated!")
    res.redirect(`/listings/${id}`)
})
);


//5. delete route
router.delete( "/:id" ,isLoggedIn , isOwner, wrapAsync(  async (req,res) => {
    let { id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted !")
    res.redirect("/listings");
})
);

module.exports = router