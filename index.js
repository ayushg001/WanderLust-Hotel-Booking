const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 
const Path = require("path")
const methodoverride = require("method-override")
const ejsMate = require("ejs-Mate");
const ExpressError = require("./utils/ExpressError.js")       

const  session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 *   60   *  60  * 1000,
                        //7 days , hrs , mins , sec , millisec  
        maxAge :   7 * 24 *   60   *  60  * 1000,
        httpsOnly : true,                           // to prevent from cross-scripting attacks          
    }
};

app.get("/" , (req,res) =>{
    res.send("hi");
});


app.use(session(sessionOptions));
app.use(flash())                      //use flash before the routes

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success)
    next();    //use next if not wanted to stuck in this middleware
})

// app.get("/demouser" ,  async (req,res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "sigma-student"
//     });

//     let registerUser = await User.register(fakeUser , "helloworld");

//     res.send(registerUser)
// })

app.use("/listings" , listingRouter)
app.use("/listings/:id/reviews" , reviewRouter)
app.use("/" , userRouter)


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