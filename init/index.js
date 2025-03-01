const mongoose =require("mongoose");
const initData = require("./data.js"); //sample data
const Listing = require("../models/listing.js");// model (collection)
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

const initDB = async () =>{
    await Listing.deleteMany({}) // this will empty the database
    initData.data =     initData.data.map((obj) => ({...obj , owner : "67bf50dbdbce5b57b669f8ad"}))
    await Listing.insertMany(initData.data);
    
    console.log("data is inserted")
};
initDB();