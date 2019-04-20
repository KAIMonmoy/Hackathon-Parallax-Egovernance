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

  res.render("userThingsToDo", {
    username: username
  });
});

router.post("/:username", async (req, res) => {
  let username = req.params.username;

  const sql = `select P.place_name, T.todo_task
  from public.things_to_do T join public.places P
  on P.place_id = T.todo_place_id and P.place_name = '${req.body.place}'
  `;

  console.log(req.body);

  try {
    let client = new Client();
    await client.connect();
    result = await client.query(sql);
    res.render("userThingsToDo", {
      username: username,
      place_name: result.rows[0].place_name,
      todo_task: result.rows[0].todo_task
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).render("500");
  }
});

module.exports = router;
