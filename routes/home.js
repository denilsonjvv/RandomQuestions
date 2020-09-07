var express = require("express");
var router = express.Router({ mergeParams: true });

var Question = require("../models/question"),
    auth = require("../config/auth"); // connect to auth file to authorize.

// Landing page
router.get("/", auth.userIsLogged, async (req, res) => {
    try {
        Question.find()
            .populate("author", "username profileImg")
            .exec(async (err, questions) => {
                if (err) {
                    console.log("Landing page error");
                } else {
                    res.render("index", {
                        questions,
                    });
                }
            });
    } catch (err) {
        res.redirect("back");
    }
});

//Global Router
module.exports = router;
