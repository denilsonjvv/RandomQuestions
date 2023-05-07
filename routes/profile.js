const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showEditPassword,
  showEditUsername,
  updateUsername,
  updatePassword,
  showProfile,
  genRanUsername,
} = require("../controllers/profile");
const { isValidPassword, autoLoginRedirect } = require("../middleware/");
const auth = require("../config/auth");

// Generate Random Username
router.get("/usernameGen", genRanUsername);
// Profile page
router.get("/", auth.userIsLogged, showProfile);
// Edit username page
router.get("/editUsername", auth.userIsLogged, showEditUsername);
//Edit password page
router.get("/editPassword", auth.userIsLogged, showEditPassword);

// UPDATE  Profile
router.put(
  "/:id/changeUsername",
  auth.userIsLogged,
  isValidPassword,
  updateUsername,
  autoLoginRedirect
);
router.put(
  "/:id/changePassword",
  auth.userIsLogged,
  isValidPassword,
  updatePassword,
  autoLoginRedirect
);

//Global Router
module.exports = router;
