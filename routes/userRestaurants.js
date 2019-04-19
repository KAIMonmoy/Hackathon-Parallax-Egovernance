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

  res.render("userRestaurants", {
    username: username
  });
});

router.post("/:username", async (req, res) => {
  let username = req.params.username;

  let sql = `select * from public.restaurant where 1 = 1`;
  let params = [];
  if (req.body.place != "Place") {
    // params.push(`'` + req.body.place + `'`);
    sql +=
      ` and rest_place_id = (select place_id from public.places where place_name = '` +
      req.body.place +
      `')`;
  }
  if (req.body.cuisine != "Cuisine") {
    // params.push(`'` + req.body.cuisine + `'`);
    sql += ` and "rest_cuisineType" = '` + req.body.cuisine + `'`;
  }
  if (req.body.price != "Price") {
    // params.push(`'` + req.body.price + `'`);
    sql += ` and "rest_priceRange" = '` + req.body.price + `'`;
  }

  console.log(sql, params);

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
