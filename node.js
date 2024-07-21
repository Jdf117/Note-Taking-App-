//hello this is my not taking app
const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index");
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));