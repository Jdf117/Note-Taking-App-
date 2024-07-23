//hello this is my not taking app
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 3000;

//include Schema 
const schema = require("./models/noteSchema");
const Note = schema.Note;

app.use(express.json());
app.use(bodyParser.json());
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
 
// let Notes = [
//     { title: 'Welcome to Note-it!', content: "Start adding notes today!"}
// ];

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/notes", async (req, res) => {
    console.log("finding notes");
    const  notes = await Note.find();

    if(notes.length > 0){
        console.log("Notes exist");
        res.status(200).json(notes);
    } else {
        console.log("empty database");
        res.status(200).send("Database is empty");
    }
})

app.post("/note", async (req, res) => {
    const title = req.body.title; 
    const content = req.body.content;

    try{
        const newNote = new Note({title, content});
        await newNote.save();
        res.status(201).send("Note added successfully");
    } 
    catch (err) {
        console.log(err);
    }

});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));