const User = require("../models/user");
const util = require("util");

module.exports = {
  isValidPassword: async (req, res, next) => {
    const { user } = await User.authenticate()(
      req.user.username,
      req.body.currentPassword
    );
    if (user) {
      //add user to res.locals
      res.locals.user = user;
      return next();
    }
    const msg = "Password entered does not match your current password";
    if (req.body.username) {
      res.render("profile/editUsername", {
        info_msg: msg,
      });
      return;
    }
    res.render("profile/editPassword", {
      info_msg: msg,
    });
  },
  autoLoginRedirect: async (req, res) => {
    // Use util method to login after changes
    const { user } = res.locals;
    const login = util.promisify(req.login.bind(req));
    await login(user);
    req.flash("success_msg", "Profile updated successfully.");
    res.redirect("/profile/" + user._id);
  },
};
