var express = require("express");
var router = express.Router({ mergeParams: true });
var randomWords = require("random-words");
var User = require("../models/user"),
  auth = require("../config/auth"); // check if user is logged in

//Generate Random Username
router.get("/usernameGen", function (req, res, next) {
  var genRanUsername = randomWords({ min: 2, max: 3, maxLength: 6, join: "-" });

  User.findById({ username: genRanUsername }, function (err, foundProfile) {
    if (foundProfile) {
      res.json(genRanUsername);
    } else {
      res.json(genRanUsername);
    }
  });
});

// landing page
router.get("/:id", auth.userIsLogged, function (req, res) {
  User.findById(req.params.id, function (err, foundProfile) {
    if (err) {
      req.flash("error_msg", "The user ID you are looking for does not exist.");
      res.redirect("/");
    } else {
      //render show template for that blog
      res.render("profile/show");
    }
  });
});
//Edit profile page
router.get("/:id/edit", auth.userIsLogged, function (req, res) {
  User.findById(req.params.id, function (err, foundProfile) {
    if (err) {
      req.flash("error_msg", "The user ID you are looking for does no exist.");
      res.redirect("/");
    } else {
      //render show template
      res.render("profile/edit", { user: foundProfile });
    }
  });
});

// UPDATE the Profile
router.put("/:id", auth.userIsLogged, function (req, res) {
  var username = req.body.username;
  let errors = [];
  User.findOne({ username }, function (err, user) {
    if (user) {
      //User exists
      errors.push({ msg: "Username is already registered" });
      res.render("profile/edit", { errors });
    } else {
      User.findOneAndUpdate(req.params.id, { username }, function (
        err,
        profile
      ) {
        if (err) {
          req.flash(
            "error_msg",
            "There was a problem updating your project, try again."
          );
          res.render("profile/edit");
        } else {
          //Success message handling with flash
          req.flash(
            "info_msg",
            "Username changed. Log in with updated account information."
          );
          res.redirect("/user/login");
        }
      });
    }
  });
});

//Global Router
module.exports = router;
