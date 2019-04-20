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
router.get("/:username/:reciever", async (req, res) => {
  const username = req.params.username;
  console.log(username);
  const reciever = req.params.reciever;
  console.log(reciever);

  const sql = `select username from public.user U1 where user_id in (
        select F.friend_id from public.friends F where F.user_id = (
            select U2.user_id from public.user U2 where username = '${username}'
        )
    )`;

  const sql2 = `select agency_name from public.agency`;

  try {
    const client = new Client();
    await client.connect();
    let friends = await client.query(sql);
    friends = friends.rows;
    let agencies = await client.query(sql2);
    agencies = agencies.rows;
    res.render("userInbox", {
      username: username,
      friends: friends,
      agencies: agencies
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).render("500");
  }
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
