const express = require("express");
const router = express.Router({ mergeParams: true });
const { postRegister, postLogin, logout } = require("../controllers/index");

// AUTH ROUTES
router.get("/login", (req, res) => {
  res.render("login");
});

// POST login from conroller
router.post("/login", postLogin);

// SHOW register form
router.get("/register", (req, res) => {
  res.render("register");
});

// CREATE new user
router.post("/register", postRegister);

// Logout handler
router.get("/logout", logout);

module.exports = router;
