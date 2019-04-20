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

  try {
    const client = new Client();
    await client.connect();

    const hotelSQL = `SELECT hotel_name FROM public.hotel`;
    const hotels = await client.query(hotelSQL);

    const agencySQL = `SELECT agency_name FROM public.agency`;
    const agencies = await client.query(agencySQL);

    const placeSQL = `SELECT place_name FROM public.places`;
    const places = await client.query(placeSQL);

    // console.log(hotels.rows, agencies.rows, places.rows);

    res.render("ratingAndReview", {
      username: username,
      hotels: hotels.rows,
      agencies: agencies.rows,
      places: places.rows
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).render("500");
  }
});

router.post("/:username/:type", async (req, res) => {
  const username = req.params.username;
  console.log(username);
  const type = req.params.type;
  console.log(type);

  console.log(req.body);
  console.log(Object.keys(req.body));

  const InsertionSQL = `INSERT INTO public.review(
	reviewer_name, reviewee_name, review_type, review_text, rating)
    VALUES ($2, $3, $1, $5, $4);`;

  const params = [type, username];

  if (type == "place") {
    params.push(req.body.placeReview[0]);
    params.push(Object.keys(req.body)[0]);
    params.push(req.body.placeReview[1]);
  } else if (type == "agency") {
    params.push(req.body.agencyReview[0]);
    params.push(Object.keys(req.body)[0]);
    params.push(req.body.agencyReview[1]);
  } else {
    params.push(req.body.hotelReview[0]);
    params.push(Object.keys(req.body)[0]);
    params.push(req.body.hotelReview[1]);
  }
  try {
    const client = new Client();
    await client.connect();
    let review = await client.query(InsertionSQL, params);
    const placeSQL = `select place_name,place_lat,place_long,history.review,history.rating
    from public.places join public.history
    on places.place_id = history.place_id join public.user
    on history.user_id = public.user.user_id
    and public.user.username = $1`;
    const placeParam = [username];
    const placeData = await client.query(placeSQL, placeParam);

    res.render("user", {
      username: username,
      places: placeData.rows
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).render("500");
  }
});

module.exports = router;
