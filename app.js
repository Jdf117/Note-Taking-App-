//hello this is my not taking app
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require("body-parser");

//Auth0
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const PORT = 3000;

const notesRouter = require("./routes/notesRouter");


app.use(express.json());
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '')));


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


//Auth0 config 
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  clientID: 'DIhQg8ebNlcXkb22eRBgJZgRjlJ4hNP7',
  issuerBaseURL: 'https://dev-r36sqwzrgh0z56eq.ca.auth0.com',
  secret: 'LONG_RANDOM_STRING'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  if(!req.oidc.isAuthenticated()){
    res.redirect('/login');
  } else {
    res.render('index');
  }
});
 
app.get('/callback',requiresAuth(), (req, res) => {
    res.render('index');
} )

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


app.get("/", (req, res) => {
    res.render("index");
})

app.use("/", notesRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));