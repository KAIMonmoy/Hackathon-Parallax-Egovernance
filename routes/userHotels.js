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

  res.render("userHotels", {
    username: username
  });
});

router.post("/:username", async (req, res) => {
  const username = req.params.username;
  console.log(username);

  console.log(req.body);

  const sql = `select *
  from public.hotel
  where hotel_place_id =
  (
    select place_id 
    from public.places
    where place_name = '${req.body.place}'
  )
  `;

  try {
    const client = new Client();
    await client.connect();
    let hotels = await client.query(sql);
    hotels = hotels.rows;
    console.log(hotels);
    res.render("userHotels", {
      username: username,
      hotels: hotels
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).render("500");
  }
});

module.exports = router;
