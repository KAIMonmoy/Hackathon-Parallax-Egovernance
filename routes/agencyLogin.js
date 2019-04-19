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
  res.render("agencyLogin", {
    failedLogin: false
  });
});

router.post("/", async (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password
  };
  const { error } = validateLogin(loginData);
  if (error)
    return res.status(400).render("agencyLogin", {
      failedLogin: true
    });

  try {
    const sql = `SELECT * FROM "agency" WHERE "email" = $1`;
    const param = [loginData.email];
    const client = new Client();
    await client.connect();
    const loggedInAgency = await client.query(sql, param);
    if (loggedInAgency.rowCount != 1) {
      return res.status(400).render("agencyLogin", {
        failedLogin: true
      });
    }
    loggedInAgency = loggedInAgency.rows[0];
    const validPassword = await bcrypt.compare(
      loginData.password,
      loggedInAgency.password
    );
    if (!validPassword)
      return res.status(400).render("agencyLogin", {
        failedLogin: true
      });

    const token = tokenForUser(loggedInAgency);

    res.header("x-auth-token", token).render("user", {
      username: loggedInAgency.username,
      email: loggedInAgency.email
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

function tokenForUser(agency) {
  const timestamp = new Date().getTime();
  let token = jwt.sign(
    {
      username: agency.agencyname,
      email: agency.email,
      lastLoggedIn: timestamp
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "24h" // expires in 24 hours
    }
  );
  return token;
}

module.exports = router;
