const Listing = require("../models/listing")
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });  // works related to geocoding

module.exports.index = async (req,res) => {
    let allListings =  await Listing.find({});
     res.render( "listings/index.ejs" , {allListings})
     };

module.exports.renderNewForm = (req,res) =>{
    
    res.render("listings/new.ejs")
}  

module.exports.showListing  = async (req,res) => {
    let { id } = req.params;
       const listing = await Listing.findById(id).populate({path :  "reviews" , populate : { path : "author"}}).populate("owner");
                //with each listing , reviews should come , with reviews their author should also come (nested populate)
       if(!listing){
        req.flash("error" , "Listing not found!")
         return res.redirect("/listings")
       }
       console.log(listing)
        res.render("listings/show.ejs" , {listing});
     };

module.exports.createListing =   async (req,res,next) =>{
     let response = await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();



    let url  = req.file.path;
    let filename = req.file.filename;
    // console.log(url , "..." , filename)
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;                     // storing the current user id in the newlisting.
    newlisting.image = {url , filename}  

      newlisting.geometry = response.body.features[0].geometry;

    let savedListing = await newlisting.save();
    console.log(savedListing)
    req.flash("success" , "New Listing Created !")
     res.redirect("/listings")
} ;

module.exports.renderEditForm =  async (req,res) =>{
    let { id } = req.params;  
    const listing  =  await Listing.findById(id)
    if(!listing){
        req.flash("error" , "Listing not found!")
        res.redirect("/listings")
       }

    let originalImageUrl =   listing.image.url;      // image url                             
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");  // it has blur image url

    res.render("listings/edit.ejs" , {listing, originalImageUrl});
};

module.exports.updateListing =  async (req,res) => {
    let response = await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    let { id } = req.params;  
    
//if don't return , the operations below will also run

    // const { title, description, image, price, country, location } = req.body;
    // const updatedListing =  await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location });
    const updatedListing  =  await Listing.findByIdAndUpdate(id ,{ ...req.body.listing} );
//     const updatedListing  =  await Listing.findByIdAndUpdate(id ,req.body.listing );
//    this  also works fine



if( typeof req.file !== "undefined"){   //if we don't add any new image file
    let url  = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url , filename};

    updatedListing.geometry = response.body.features[0].geometry;
    
    await updatedListing.save();
}
console.log(req.file)

// console.log(req.body);
// console.log(updatedListing)
req.flash("success" , "Listing Updated!")
    res.redirect(`/listings/${id}`)
};


module.exports.destroyListing =  async (req,res) => {
    let { id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted !")
    res.redirect("/listings");
};
