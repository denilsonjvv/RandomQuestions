let User = require("../models/user");
const randomWords = require("random-words");

module.exports = {
    genRanUsername(req, res, next) {
        var genRanUsername = randomWords({
            min: 2,
            max: 3,
            maxLength: 6,
            join: "-",
        }).toLowerCase();
        User.findById({ username: genRanUsername }, (err, foundProfile) => {
            if (foundProfile) {
                res.json(genRanUsername);
            } else {
                res.json(genRanUsername);
            }
        });
    },
    showProfile(req, res) {
        User.findById(req.params.id, function (err) {
            if (err) {
                req.flash(
                    "error_msg",
                    "The user ID you are looking for does not exist."
                );
                res.redirect("/");
            } else {
                //render show template for that blog
                res.render("profile/show");
            }
        });
    },
    showEditUsername(req, res, next) {
        User.findById(req.params.id, function (err, foundProfile) {
            if (err) {
                req.flash(
                    "error_msg",
                    "The user ID you are looking for does no exist."
                );
                res.redirect("/");
            } else {
                //render show template
                res.render("profile/editUsername", { user: foundProfile });
            }
        });
    },
    showEditPassword(req, res, next) {
        User.findById(req.params.id, function (err, foundProfile) {
            if (err) {
                req.flash(
                    "error_msg",
                    "The user ID you are looking for does no exist."
                );
                res.redirect("/");
            } else {
                //render show template
                res.render("profile/editPassword", { user: foundProfile });
            }
        });
    },
    async updateUsername(req, res, next) {
        let { username } = req.body;
        //check if usernames is same
        if (username === res.locals.user.username) {
            return res.render("profile/editUsername", {
                info_msg: "Username is already registered",
            });
        }
        const { user } = res.locals;
        if (username) user.username = username;
        await user.save();
        next();
    },
    async updatePassword(req, res, next) {
        const { newPassword, confirmPassword, currentPassword } = req.body;
        const { user } = res.locals;
        if (newPassword && currentPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                await user.setPassword(newPassword);
                await user.save();
                next();
            } else {
                req.flash("error_msg", "Passwords must match");
                res.redirect("/profile/" + user._id + "/editPassword");
            }
        } else {
            req.flash("error_msg", "Password fields missing");
            res.redirect("/profile/" + user._id + "/editPassword");
        }
    },
};
