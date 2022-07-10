//external imports
const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect(){
    mongoose.connect(
    //using mongoose to connect this app to mongo db database
    process.env.CONNECTION_STRING)
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
        console.error("Unable to connect to MongoDB Atlas!");
        console.error(error);
    });
    
}

module.exports = dbConnect;