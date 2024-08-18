const express = require("express");
const router = express.Router(); 
const mongoose = require("mongoose");

//include schema
const schema = require("../models/noteSchema");
const { requiresAuth } = require("express-openid-connect");
const Note = schema.Note;

//Gets the full list of notes
router.get("/notes",requiresAuth(), async (req, res) => {
    console.log("finding notes");
    const userId = req.oidc.user.sub; // this will give you the user ID of the current user provided by Auth0
    const  notes = await Note.find({user_id: userId});

    if(notes.length > 0){
        console.log("Notes exist");
        res.status(200).json(notes);
    } else {
        console.log("empty database");
        res.status(200).send("Database is empty");
    }
})


//Creates a new note. If no title is specified, it will default to today's date. 
//Each note will include the user ID 
router.post("/note", requiresAuth(), async (req, res) => {
    const user_id = req.oidc.user.sub; //sub, short for subject, is a stnadrd OpenID Connect claim that uniquely identifies the user
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
router.delete('/notes/:id', requiresAuth(), async (req, res) => {
    const userId = req.oidc.user.sub;
    const id = parseInt(req.params.id);
    try{
        // need to check if note exists and if the note has the correct user ID 
        const note = await Note.findOne({id: id, user_id: userId});
        if(note){
            await Note.deleteOne({id});
            res.status(200).send("Note deleted successfully");
        } 
        else {
            res.status(404).send("Note not found");
        }

    } catch(err){
        res.status(500).send("Could not delete the note");
    }
})

//delete all
router.delete('/delete-notes', requiresAuth(), async (req,res) => {
    const userId = req.oidc.user.sub;
    const Notes = await Note.find({user_id: userId});
    console.log(Notes);
    try{ 
        if(Notes.length > 0 ){
            //console.log("Note not empty");
            await Note.deleteMany({user_id: userId});
            res.status(200).send("Deleted all notes");
        } else {
            res.status(404).send("No notes to delete");
        }

    } catch (err){
        res.status(500).send("Could not delete notes");
    }
});

//Update Note via note Id and User Id for authentication --- end point has two filters note-id and user-id 
router.put("/update-note/:id", requiresAuth(), async (req, res) => {
    const noteId = parseInt(req.params.id);
    const userId = req.params.user.sub; 
    //const notes = await Note.find();
 
    try{
        const updatedNote = await Note.findOneAndUpdate(
            {id: noteId, user_id: userId},
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
        //Below code does not work because it only updates the local notes array and not saving these changes to the database
        // const noteIndex = notes.findIndex((Note) => Note.id == noteId );
        // console.log("noteIndex = " + noteIndex);

        // if(noteIndex != -1) {
        //     notes[noteIndex].title = req.body.title;
        //     notes[noteIndex].content = req.body.content;
        //     res.status(200).send("Note updated successfully");
        //     console.log(notes);
        // } 
    } catch(err){
        console.error(err);
        res.status(500).send("Could not update the note");
    }

})

module.exports = router;