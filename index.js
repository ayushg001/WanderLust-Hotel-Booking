const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing =   require("./models/listing.js");
const Path = require("path")
const methodoverride = require("method-override")
const ejsMate = require("ejs-Mate");

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

//1. index route 
app.get( "/listings" , async (req,res) => {
   let allListings =  await Listing.find({});
    res.render( "listings/index.ejs" , {allListings})
    
});

//3. create route
app.get( "/listings/new" , (req,res) =>{
    res.render("listings/new.ejs")
} )

app.post( "/listings" , async (req,res) =>{
   const newlisting = new Listing(req.body.listing);
   await newlisting.save();
    res.redirect("/listings")
});

//4. edit route
app.get( "/listings/:id/edit" , async (req,res) =>{
    let { id } = req.params;  
    const listing  =  await Listing.findById(id)
    res.render("listings/edit.ejs" , {listing});
});

app.put ("/listings/:id" , async (req,res) => {
    let { id } = req.params;  
    const updatedListing  =  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
//     const updatedListing  =  await Listing.findByIdAndUpdate(id ,req.body.listing );
//    this  also works fine
    res.redirect(`/listings/${id}`)
});

//5. delete route
app.delete( "/listings/:id" , async (req,res) => {
    let { id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//2. show route
app.get( "/listings/:id" , async (req,res) => {
let { id } = req.params;
   const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});

});
    


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

app.listen( 8080 , () => {
    console.log("server is listening");
});