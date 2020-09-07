const passport = require("passport");
const User = require("../models/user");

module.exports = {
    postLogin(req, res, next) {
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/user/login",
            failureFlash: true,
        })(req, res, next);
    },
    logout(req, res, next) {
        req.logout();
        req.flash("success_msg", "You are logged out");
        res.redirect("/user/login");
    },
    postRegister(req, res, next) {
        let { username, profileImg, password, password2 } = req.body;
        let errors = [];

        //check required fields
        if (!username.trim() || !password || !password2) {
            errors.push({ msg: "Fill in all fields that apply" });
        }
        //check passwords match
        if (password !== password2) {
            errors.push({ msg: "Passwords do not match" });
        }
        // Check pass length
        if (password.length < 6) {
            errors.push({ msg: "Password should be at least 6 characters" });
        }
        if (errors.length > 0) {
            res.render("register", { errors, username, password, password2 });
        } else {
            //validate passed
            User.findOne({ username }, function (err, user) {
                if (user) {
                    //User exists
                    errors.push({ msg: "Username is already registered" });
                    res.render("register", {
                        errors,
                        username,
                        password,
                        password2,
                    });
                } else {
                    var userInfo = {
                        username,
                        profileImg,
                    };
                    User.register(new User(userInfo), password, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash(
                                "success_msg",
                                "You are now registered and can log in"
                            );
                            res.redirect("login");
                        }
                    });
                }
            });
        }
    },
};
