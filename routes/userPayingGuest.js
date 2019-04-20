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
router.get("/:username", (req, res) => {
  let username = req.params.username;
  console.log(username);

  res.render("userPayingGuest", {
    username: username
  });
});

router.post("/:username", async (req, res) => {
  let username = req.params.username;

  console.log(req.body);

  const sql = `SELECT * FROM public.pg WHERE pg_place_id = (
    SELECT place_id
    FROM public.places
    WHERE place_name = '${req.body.place}')`;

  try {
    let client = new Client();
    await client.connect();
    let pgs = await client.query(sql);
    res.render("userPayingGuest", {
      username: username,
      pgs: pgs.rows
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).render("500");
  }
});

module.exports = router;
