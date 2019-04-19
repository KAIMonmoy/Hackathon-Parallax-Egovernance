// necessary library files
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Client } = require("pg");
const bodyParser = require("body-parser");
require("dotenv").config();

const express = require("express");

const router = express.Router();

// middleware functions
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

// handling endpoints
router.get("/:username", async (req, res) => {
  const username = req.params.username;
  console.log(username);

  res.render("ratingAndReview", {
    username: username
  });
});

router.post("/:username", async (req, res) => {
  const username = req.params.username;
  console.log(username);

  console.log(req.body);

  //const sql = ``;

  //   try {
  //     const client = new Client();
  //     await client.connect();
  //     let place = await client.query(sql);
  //     place = place.rows[0];
  //     console.log("queried places" + place + "\n" + sql);
  //     res.render("userPlaces", {
  //       username: username,
  //       place: place,
  //       url: place.place_image
  //     });
  //   } catch (ex) {
  //     console.error(ex);
  //     res.status(500).render("500");
  //   }
});

module.exports = router;
