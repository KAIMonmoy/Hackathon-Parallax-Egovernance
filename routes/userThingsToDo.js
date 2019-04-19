// necessary library files
let Joi = require("joi");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
let { Client } = require("pg");
let bodyParser = require("body-parser");
require("dotenv").config();

let express = require("express");

let router = express.Router();

// middleware functions
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

// handling endpoints
router.get("/:username", async (req, res) => {
  let username = req.params.username;
  console.log(username);

  res.render("userThingsToDo", {
    username: username
  });
});

router.post("/:username", async (req, res) => {
  let username = req.params.username;

  const sql = ``;

  try {
    let client = new Client();
    await client.connect();
    resturs = await client.query(sql, params);
    res.render("userRestaurants", {
      username: username,
      restaurants: resturs.rows,
      count: resturs.rowcount
    });
  } catch (ex) {
    console.error(ex);
    req.status(500).render("500");
  }
});

module.exports = router;
