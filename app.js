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

//Gets the full list of notes
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


//Creates a new note. If no title is specified, it will default to today's date
app.post("/note", async (req, res) => {
    const title = req.body.title; 
    const content = req.body.content;
    const  notes = await Note.find();
    const id = notes.length + 1;
    console.log("Note ID: " +  id);
    try{
        const newNote = new Note({id, title, content});
        console.log(newNote);
        await newNote.save();
        res.status(201).send("Note added successfully");
    } 
    catch (err) {
        console.log("Could not add Note");
    }
});

//Delete note via ID 
app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id;
    try{
        // need to check if note exists 
        const note = await Note.findById(id);
        if(note){
            await Note.deleteOne({_id: new mongoose.Types.ObjectId(id)});
            res.status(200).send("Note deleted successfully");
        } else {
            res.status(404).send("Note not found");
        }

    } catch(err){
        res.send("Could not delete the note");
    }
})
//delete all
app.delete('/delete-notes', async (req,res) => {
    try{
        if(!Note.length() == 0 ){
            await Note.deleteMany({});
            res.status(200).send("Deleted all notes");
        } 

    } catch (err){
        res.send("Could not delete notes");
    }
});

//Update Note via ID 
app.put("/update-note/:id", (req, res) => {
    const id = req.params.id;
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));