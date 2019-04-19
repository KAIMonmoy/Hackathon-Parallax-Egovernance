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

  res.render("userHotels", {
    username: username
  });
});

module.exports = router;
