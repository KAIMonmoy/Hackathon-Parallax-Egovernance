const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function authUser(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).render("index");

  try {
    const decodedPayload = jwt.decode(token, process.env.JWT_PRIVATE_KEY);
    req.user = decodedPayload;
    next();
  } catch (ex) {
    res.status(400).render("userLogin");
  }
};
