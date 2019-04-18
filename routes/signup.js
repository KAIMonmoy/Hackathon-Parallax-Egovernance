const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Client } = require("pg");
require("dotenv").config();

const express = require("express");

const router = express.Router();

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(1)
      .required(),
    email: Joi.email()
      .min(7)
      .require(),
    password: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    contact: Joi.string().allow(""),
    address: Joi.string().allow("")
  };

  return Joi.validate(user, schema);
}

router.get("/", (req, res) => {});

// handling signup request
router.post("/", async (req, res) => {
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
    const salt = await bcrypt.genSalt(process.env.SALT_KEY);
    newUser.password = await bcrypt.hash(user.password, salt);

    // insert new user data into database
    const insertionSQL = `INSERT INTO "user"(
        "username", "password", "email", "contact", "address", "date_of_birth")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      newUser.username,
      newUser.password,
      newUser.email,
      newUser.contact,
      newUser.address,
      newUser.date_of_birth
    ];
  } catch (err) {
    console.error(err.message);
    res.status(500).render("500");
  }
});
