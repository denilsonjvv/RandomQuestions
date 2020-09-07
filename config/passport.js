var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");

//Load user Model to passport
var User = require("../models/user");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "username" },
            (username, password, done) => {
                // Match User
                User.findOne(username, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: "Username or password incorrect",
                        });
                    }
                    bcrypt.compare(password, user.password, function (
                        err,
                        isMatch
                    ) {
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: "Username or password incorrect",
                            });
                        }
                    });
                    return done(null, user);
                });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};
