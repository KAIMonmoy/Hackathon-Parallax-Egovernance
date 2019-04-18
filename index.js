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

// handling routes

// handling home page
app.get("/", (req, res) => {});

const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`listening to ${port}...`);
});
