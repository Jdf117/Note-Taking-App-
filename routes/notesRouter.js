const express = require("express");
const router = express.Router(); 
const mongoose = require("mongoose");

//include schema
const schema = require("../models/noteSchema");
const { requiresAuth } = require("express-openid-connect");
const Note = schema.Note;

//Gets the full list of notes
router.get("/notes", async (req, res) => {
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
router.post("/note", async (req, res) => {
    const user_id = req.oidc.user;
    const title = req.body.title; 
    const content = req.body.content;
    const  notes = await Note.find();
    const id = notes.length + 1;
    console.log("Note ID: " +  id);
    try{
        const newNote = new Note({ user_id, id, title, content});
        console.log(newNote);
        await newNote.save();
        res.status(201).send("Note added successfully");
    } 
    catch (err) {
        console.log("Could not add Note");
    }
});

//Delete note via ID 
router.delete('/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        // need to check if note exists 
        const note = await Note.findOne({id});
        if(note){
            await Note.deleteOne({id});
            res.status(200).send("Note deleted successfully");
        } 

    } catch(err){
        res.status(404).send("Could not delete the note");
    }
})
//delete all
router.delete('/delete-notes', async (req,res) => {
    const Notes = await Note.find();
    console.log(Notes);
    try{
        
        if(!Notes.length == 0 ){
            console.log("Note not empty");
            await Note.deleteMany();
            res.status(200).send("Deleted all notes");
        } 

    } catch (err){
        res.status(404).send("Could not delete notes");
    }
});

//Update Note via ID 
router.put("/update-note/:id", async (req, res) => {
    const noteId = parseInt(req.params.id);

 
    try{
        const updatedNote = await Note.findOneAndUpdate(
            {id: noteId},
            {
                title: req.body.title, 
                content:req.body.content
            },
            {new: true}//option used to return the modified document 
        );

        if(updatedNote){
            res.status(200).send("Note updated successfully");
            console.log(updatedNote);
        } else {
            res.status(404).send("Note not found");
        }
    } catch(err){
        console.error(err);
        res.status(500).send("Could not update the note");
    }

})

module.exports = router;