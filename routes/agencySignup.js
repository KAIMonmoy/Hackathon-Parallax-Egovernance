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

// util functions
function tokenForAgency(agency) {
  const timestamp = new Date().getTime();
  let token = jwt.sign(
    {
      agencyname: agency.agencyName,
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

//end point handling
router.get("/", (req, res) => {
  res.render("agencySignup", {
    failedSignup: false
  });
});

// handling signup request
router.post("/", async (req, res) => {
  console.log(req.body);
  // new agency schema for db
  const newAgency = {
    agencyName: req.body.agencyName,
    email: req.body.email,
    password: req.body.password,
    description: req.body.description,
    specialFeatures: req.body.specialFeatures,
    rating: req.body.rating
  };

  const sql = `select * from "agency" where "agency"."agency_email" = $1`;
  const param = [newAgency.email];
  // looking for existing agency with email then inserting new user
  try {
    const client = new Client();
    await client.connect();
    const existingAgencysWithGivenEmail = await client.query(sql, param);
    if (existingAgencysWithGivenEmail.rowCount > 0) {
      return res.status(403).send("Request Denied!");
    }

    // generating hashed password with salt
    const salt = await bcrypt.genSalt(10);
    newAgency.password = await bcrypt.hash(newAgency.password, salt);

    // insert new user data into database
    const insertionSQL = `INSERT INTO "agency"(
        "agency_name", "agency_password", "agency_email", "agency_description", "agency_specialfeatures")
        VALUES ($1, $2, $3, $4, $5)`;
    const params = [
      newAgency.agencyName,
      newAgency.password,
      newAgency.email,
      newAgency.description,
      newAgency.specialFeatures
    ];
    const insertedAgency = await client.query(insertionSQL, params);
    console.log(insertedAgency.rowCount, insertedAgency.rows);
    const token = tokenForAgency(newAgency);
    res.header("x-auth-token", token).render("agency", {
      agency: newAgency
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500");
  }
});

module.exports = router;
