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
const auth = require("../config/auth"); // check if user is logged in
//Generate Random Username
router.get("/usernameGen", genRanUsername);

// landing page
router.get("/:id", auth.userIsLogged, showProfile);
//Edit username page
router.get("/:id/editUsername", auth.userIsLogged, showEditUsername);
//Edit password page
router.get("/:id/editPassword", auth.userIsLogged, showEditPassword);

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
