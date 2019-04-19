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
router.get("/", (req, res) => {
  res.render("userLogin", {
    failedLogin: false
  });
});

router.post("/", async (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password
  };
  // const { error } = validateLogin(loginData);
  // if (error)
  //   return res.status(400).render("userLogin", {
  //     failedLogin: true
  //   });

  try {
    const sql = `SELECT * FROM "user" WHERE "email" = $1`;
    const param = [loginData.email];
    const client = new Client();
    await client.connect();
    let loggedInUser = await client.query(sql, param);
    if (loggedInUser.rowCount != 1) {
      return res.status(400).render("userLogin", {
        failedLogin: true
      });
    }
    loggedInUser = loggedInUser.rows[0];
    const validPassword = await bcrypt.compare(
      loginData.password,
      loggedInUser.password
    );
    if (!validPassword)
      return res.status(400).render("userLogin", {
        failedLogin: true
      });

    const token = tokenForUser(loggedInUser);

    const placeSQL = `select place_name,place_lat,place_long,history.place_review,history.place_rating
    from public.places join public.history
    on places.place_id = history.place_id join public.user
    on history.user_id = public.user.user_id
    and public.user.username = $1`;
    const placeParam = [loggedInUser.username];
    const placeData = await client.query(placeSQL, placeParam);

    res.header("x-auth-token", token).render("user", {
      username: loggedInUser.username,
      email: loggedInUser.email,
      places: placeData.rows
    });
  } catch (ex) {
    console.error(ex);
    return res.status(500).render("500");
  }
});

// util functions
function validateLogin(loginData) {
  const schema = {
    email: Joi.string()
      .email()
      .min(7)
      .max(30)
      .required(),
    password: Joi.string()
      .min(5)
      .max(256)
      .required()
  };

  return Joi.validate(loginData, schema);
}

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  let token = jwt.sign(
    { username: user.username, email: user.email, lastLoggedIn: timestamp },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "24h" // expires in 24 hours
    }
  );
  return token;
}

module.exports = router;
