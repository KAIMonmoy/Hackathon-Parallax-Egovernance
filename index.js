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
const userHotels = require("./routes/userHotels");
const userRestaurants = require("./routes/userRestaurants");
const userPlaces = require("./routes/userPlaces");
const userThingsToDo = require("./routes/userThingsToDo");
const userPayingGuest = require("./routes/userPayingGuest");
const userRating = require("./routes/userRatings");

// handling routes
app.use("/user/login", userLogin);
app.use("/user/signup", userSignup);
app.use("/agency/login", agencyLogin);
app.use("/agency/signup", agencySignup);
app.use("/user/hotels", userHotels);
app.use("/user/restaurants", userRestaurants);
app.use("/user/places", userPlaces);
app.use("/user/thingsToDo", userThingsToDo);
app.use("/user/payingGuests", userPayingGuest);
app.use("/user/ratings/", userRating);

// handling home page
app.get("/", (req, res) => {
  res.render("index");
});

// starting server
const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`listening to ${port}...`);
});
