// importing required libraries
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const path = require("path");
require("dotenv").config();

// instantiating app
const app = express();

// setting view-engine and view-folder
app.set("view engine", "pug");
const viewsPath = path.join(__dirname, "views");
app.set("views", viewsPath);

// setting middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// importing routes
const userLogin = require("./routes/userLogin");
const userSignup = require("./routes/userSignup");
const agencyLogin = require("./routes/agencyLogin");
const agencySignup = require("./routes/agencySignup");

// handling routes
app.use("/user/login", userLogin);
app.use("/user/signup", userSignup);
app.use("/agency/login", agencyLogin);
app.use("/agency/signup", agencySignup);

// handling home page
app.get("/", (req, res) => {
  res.render("index");
});

// starting server
const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`listening to ${port}...`);
});
