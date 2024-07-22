const mongoose = require('mongoose');
const date = new Date();
const dateString = date.toDateString

const noteSchema = new mongoose.Schema({
    title: {type: String, default: dateString}, //No Entry for title allowed but defaulted to date of note creation
    content: String //content can be empty 
});

const note = mongoose.model("Note", noteSchema);

module.exports = note;