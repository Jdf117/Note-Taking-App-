//hello this is my not taking app
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const  passport = require("./config/auth");
const authRoutes = require("./routes/authRoutes");

//auth0 
// const session = require("express-session");
// const passport = require("passport");
// const Auth0Strategy = require("passport-auth0");

const PORT = 3000;

const notesRouter = require("./routes/notesRouter");
const User = require("./models/userSchema");

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

//session configuration
app.use(session({
    secret: 'YOUR_SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Should be true in production
}));

app.use(passport.initialize());
app.use(passport.session());
 
// let Notes = [
//     { title: 'Welcome to Note-it!', content: "Start adding notes today!"}
// ];
// //Auth0 Configuration
// const auth0Strategy = new Auth0Strategy({
//     domain: 'dev-r36sqwzrgh0z56eq.ca.auth0.com',
//     clientID: 'DIhQg8ebNlcXkb22eRBgJZgRjlJ4hNP7',
//     clientSecret: `M5mOYRVna6vW_psTTiIglyU7KLX0jtVVwK4thjgPssg7MIlyjDLelXVdaWFZwsjc`

// })

app.get("/", (req, res) => {
    res.render("index",{user: req.user});
})

app.use(authRoutes);
app.use("/", notesRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));