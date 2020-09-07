const express = require("express");
const router = express.Router({ mergeParams: true });
const { postRegister, postLogin, logout } = require("../controllers/index");

// AUTH ROUTES
router.get("/login", (req, res) => {
    res.render("login");
});
//Post login from conroller
router.post("/login", postLogin);

//Show register form
router.get("/register", (req, res) => {
    res.render("register");
});

//Create new user
router.post("/register", postRegister);

//Logout Handler
router.get("/logout", logout);

//Global Router
module.exports = router;
