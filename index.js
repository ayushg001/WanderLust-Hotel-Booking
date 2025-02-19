const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing =   require("./models/listing.js");
const Path = require("path")
const methodoverride = require("method-override")
const ejsMate = require("ejs-Mate");
const { nextTick } = require("process");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js")


main()
.then(  (res) => {
    console.log("Db is connected");
})
.catch( (err) => {
    console.log("err")
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine" , "ejs");
app.set("views" , Path.join(__dirname , "views") );
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs" , ejsMate ); 
app.use(express.static(Path.join(__dirname, "/public")));

app.get("/" , (req,res) =>{
    res.send("hi");
});

const validateListing = (req,res,next) => {
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map( (el) => 
        el.message).join(",");
      throw new ExpressError(400 , errMsg);
    } else{
        next();
    }
}


//1. index route 
app.get( "/listings" , wrapAsync( async (req,res) => {
   let allListings =  await Listing.find({});
    res.render( "listings/index.ejs" , {allListings})
    
}) 
);

//3. create route
app.get( "/listings/new" , wrapAsync(  (req,res) =>{
    res.render("listings/new.ejs")
} )
);

app.post( "/listings" , validateListing , wrapAsync(  async (req,res,next) =>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
         res.redirect("/listings")
})      
);

//4. edit route
app.get( "/listings/:id/edit" , wrapAsync(  async (req,res) =>{
    let { id } = req.params;  
    const listing  =  await Listing.findById(id)
    res.render("listings/edit.ejs" , {listing});
})
);

//update route
app.put ("/listings/:id"   , validateListing  , wrapAsync(  async (req,res) => {
    let { id } = req.params;  
    const { title, description, image, price, country, location } = req.body;
    const updatedListing =  await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location });
    // const updatedListing  =  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
    // const updatedListing  =  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
//     const updatedListing  =  await Listing.findByIdAndUpdate(id ,req.body.listing );
//    this  also works fine
console.log(req.body);
console.log(updatedListing)
    res.redirect(`/listings/${id}`)
})
);

//5. delete route
app.delete( "/listings/:id" , wrapAsync(  async (req,res) => {
    let { id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
);

//2. show route
app.get( "/listings/:id" , wrapAsync( async (req,res) => {
let { id } = req.params;
   const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});

})
);
    


// app.get("/testlisting" , async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 200000,
//         location : "Calangute , Goa",
//         country : "INDIA"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("testing succesfull")
// })

app.all("*" , (req,res,next) => {
    next(new ExpressError(404 , "Page not found"))
})

app.use((err,req,res,next) => {    
    let { statusCode=500 , message ="Something went wrong!"} = err;   // this will catch the code ,message
   res.status(statusCode).render("listings/error.ejs", {message})
    // res.status(statusCode).send(message);
});

app.listen( 8080 , () => {
    console.log("server is listening");
});