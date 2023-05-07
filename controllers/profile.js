const User = require("../models/user");
const randomWords = require("random-words");

module.exports = {
  genRanUsername(req, res, next) {
    const genRanUsername = randomWords({
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
    User.findById(req.user._id, function (err) {
      if (err) {
        req.flash(
          "error_msg",
          "The user ID you are looking for does not exist."
        );
        res.redirect("/");
        return;
      }
      res.render("profile/show");
    });
  },
  showEditUsername(req, res) {
    User.findById(req.user._id, function (err, foundProfile) {
      if (err) {
        req.flash(
          "error_msg",
          "The user ID you are looking for does no exist."
        );
        res.redirect("/");
        return;
      }
      res.render("profile/editUsername", { user: foundProfile });
    });
  },
  showEditPassword(req, res) {
    User.findById(req.user._id, function (err, foundUser) {
      if (err) {
        req.flash(
          "error_msg",
          "The user ID you are looking for does no exist."
        );
        res.redirect("/");
        return;
      }
      res.render("profile/editPassword", { user: foundUser });
    });
  },
  async updateUsername(req, res, next) {
    let { username } = req.body;
    if (username === res.locals.user.username) {
      res.render("profile/editUsername", {
        info_msg: "Username is already registered",
      });
      return;
    }
    const { user } = res.locals;
    if (username) {
      user.username = username;
    }
    await user.save();
    return next();
  },
  async updatePassword(req, res, next) {
    const { newPassword, confirmPassword, currentPassword } = req.body;
    const { user } = res.locals;
    if (newPassword && currentPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        await user.setPassword(newPassword);
        await user.save();
        return next();
      }
      req.flash("error_msg", "Passwords must match");
      res.redirect("/profile/editPassword");
      return;
    }
    req.flash("error_msg", "Password fields missing");
    res.redirect("/profile/editPassword");
  },
};
