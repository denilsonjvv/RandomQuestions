const passport = require("passport");
const User = require("../models/user");

module.exports = {
    postLogin(req, res, next) {
        passport.authenticate("local", {
            successRedirect: req.session.returnToURL || "/",
            failureRedirect: "/user/login",
            failureFlash: true,
        })(req, res, () => {
            console.log(req.session.returnToURL);
        });
    },
    logout(req, res) {
        // Remove last session url path if logout
        req.session.returnToURL = undefined;
        req.logout();
        req.flash("success_msg", "You are logged out");
        res.redirect("/");
    },
     async postRegister(req, res) {
        const { username, profileImg, password, password2 } = req.body;
        let errors = [];
        if (!username.trim() || !password || !password2) errors.push({ msg: "Fill in all fields that apply" });
        if (password !== password2) errors.push({ msg: "Passwords do not match" });
        if (password.length < 6) errors.push({ msg: "Password should be at least 6 characters" });
        if (errors.length > 0) return res.render("register", { errors, username, password, password2 });

        const user = await User.findOne({username});
        if (user) {
            errors.push({ msg: "Username is already registered" });
            res.render("register", {
                errors,
                username,
                password,
                password2,
            });
        } else {
            try{
                const userData = {
                    username,
                    profileImg,
                };
                const registerUser = await User.register(new User(userData), password);
                req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                );
                res.redirect("login");
            }catch(err){
                errors.push({ msg: "An unexpected error occured while registering your account, try again." });
                res.render("register", {
                    errors,
                    username,
                    password,
                    password2,
                });
            }
        }
    },
};
