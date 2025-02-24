const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing =   require("../models/listing.js");           //listing model


const validateListing = (req,res,next) => {
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map( (el) => 
        el.message).join(",");
      throw new ExpressError(400 , errMsg);
    } else{
        next();
    }
};


//1. index route 
router.get( "/" , wrapAsync( async (req,res) => {
    let allListings =  await Listing.find({});
     res.render( "listings/index.ejs" , {allListings})
     
 }) 
 );
 
 //3. create(new)  route
 router.get( "/new" , wrapAsync(  (req,res) =>{
     res.render("listings/new.ejs")
 } )
 );

 //2. show route
 router.get( "/:id" , wrapAsync( async (req,res) => {
    let { id } = req.params;
       const listing = await Listing.findById(id).populate("reviews");
       if(!listing){
        req.flash("error" , "Listing not found!")
        res.redirect("/listings")
       }
        res.render("listings/show.ejs" , {listing});
    
    })
    );

    //create route
router.post( "/" , validateListing , wrapAsync(  async (req,res,next) =>{
            const newlisting = new Listing(req.body.listing);
            await newlisting.save();
            req.flash("success" , "New Listing Created !")
             res.redirect("/listings")
    })      
    );

    //4. edit route
router.get( "/:id/edit" , wrapAsync(  async (req,res) =>{
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
router.put ("/:id"   , validateListing  , wrapAsync(  async (req,res) => {
    let { id } = req.params;  
    const { title, description, image, price, country, location } = req.body;
    const updatedListing =  await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location });
    // const updatedListing  =  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
    // const updatedListing  =  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
//     const updatedListing  =  await Listing.findByIdAndUpdate(id ,req.body.listing );
//    this  also works fine
console.log(req.body);
console.log(updatedListing)
req.flash("success" , "Listing Updated!")
    res.redirect(`/listings/${id}`)
})
);


//5. delete route
router.delete( "/:id" , wrapAsync(  async (req,res) => {
    let { id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted !")
    res.redirect("/listings");
})
);

module.exports = router