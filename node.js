//hello this is my not taking app
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const PORT = 3000;

app.use(express.json());
app.set('view engine', 'ejs');

//Mongo Database connection setup
const MONGO_URI = "mongodb://localhost:27017/DooliNoteIt"

//Connecting to MongoDB -- Written as Async function 
async function connectToMongo() { 
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch(err){
        console.log(err);
    }
}
connectToMongo();//run function to connect
 

app.get("/", (req, res) => {
    res.render("index");
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));