const mongoose = require('mongoose');
//const date = new Date();
//const dateString = date.toDateString();

const noteSchema = new mongoose.Schema({
    //user_id: {String},
    id:{type: Number},
    date: {type: String, default: () => new Date().toDateString()},
    title: {type: String, default: () => ("Note - " + new Date().toDateString())}, //No Entry for title allowed but defaulted to date of note creation
    content: String //content can be empty 
});

const Note = mongoose.model("Note", noteSchema);

module.exports = {Note}; //must have curly braces