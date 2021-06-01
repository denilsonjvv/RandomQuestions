// var LocalStrategy = require("passport-local").Strategy;
// var bcrypt = require("bcryptjs");

// //Load user Model to passport
// var User = require("../models/user");

// module.exports = function(passport) {
//     //LocalStrategy param1: options , param2, creds to verify
//     passport.use(
//         new LocalStrategy(
//             { usernameField: "username" },
//             (username, password, done) => {
//                 console.log("hit passportMiddleware!!");
                
//                 User.findOne({ username: username })
//                     .then((user) => {
//                         if (!user){
//                             return done(null, false, {
//                                 message: "Username or password incorrect"
//                             });
//                         }
//                         console.log("password", password);
//                         console.log("user.password", user.password);
//                         bcrypt.compare(
//                             password,
//                             user.password,
//                             (err, isMatch) => {
//                                 if (isMatch) {
//                                     return done(null, user);
//                                 } else {
//                                     return done(null, false, {
//                                         message:
//                                             "Username or password incorrect",
//                                     });
//                                 }
//                             }
//                         );
                        
//                         // return done(null, user);
//                     })
//                     .catch((err) => console.log(err));
//             }
//         )
//     );

//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });
//     passport.deserializeUser((id, done) => {
//         User.findById(id, (err, user) => {
//             done(err, user);
//         });
//     });
// };
