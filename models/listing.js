const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        filename : {
            type : String,
            default : "defaultimage"
        },
        url : {
            type : String,
            default : "https://media.istockphoto.com/id/472899538/photo/downtown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg?s=612x612&w=0&k=20&c=rz-WSe_6gKfkID6EL9yxCdN_UIMkXUBsr67884j-X9o=",
            set : (v) => v=== "" ? 
           "https://media.istockphoto.com/id/472899538/photo/downtown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg?s=612x612&w=0&k=20&c=rz-WSe_6gKfkID6EL9yxCdN_UIMkXUBsr67884j-X9o=" : v },
         //img does not exist / undefined / null /  ( this is when there is no option for img , means for testing)
        
        //img is present but link is empty  ( this condition is for client )
    },
   
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing" , listingSchema); 
module.exports = Listing;   // exporting the model (collection)