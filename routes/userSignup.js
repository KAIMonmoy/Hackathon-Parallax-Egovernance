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
function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(1)
      .required(),
    email: Joi.string()
      .email()
      .min(7)
      .required(),
    password: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    contact: Joi.string().allow(""),
    address: Joi.string().allow("")
  };

  return Joi.validate(user, schema);
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

//end point handling
router.get("/", (req, res) => {
  res.render("userSignup", {
    failedSignup: false
  });
});

// handling signup request
router.post("/", async (req, res) => {
  console.log(req.body);
  // new user schema for db
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    date_of_birth: req.body.date_of_birth,
    contact: req.body.contact,
    address: req.body.address
  };

  // validating input
  const { error } = validateUser(newUser);
  if (error) return res.status(400).send(error.details[0].message);

  const sql = `select * from "user" where "user"."email" = $1`;
  const param = [newUser.email];
  // looking for existing user with email then inserting new user
  try {
    const client = new Client();
    await client.connect();
    const existingUsersWithGivenEmail = await client.query(sql, param);
    if (existingUsersWithGivenEmail.rowCount > 0) {
      return res.status(403).send("Request Denied!");
    }

    // generating hashed password with salt
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // insert new user data into database
    const insertionSQL = `INSERT INTO "user"(
        "username", "password", "email", "contact", "address", "date_of_birth")
        VALUES ($1, $2, $3, $4, $5, $6)`;
    const params = [
      newUser.username,
      newUser.password,
      newUser.email,
      newUser.contact,
      newUser.address,
      newUser.date_of_birth
    ];
    const insertedUser = await client.query(insertionSQL, params);
    console.log(insertedUser.rowCount, insertedUser.rows);
    const token = tokenForUser(newUser);
    res.header("x-auth-token", token).send("user", {
      user: newUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("500"); //send appropriate files
  }
});

module.exports = router;
