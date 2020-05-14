var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// USER SCHEMA SETUP
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema); // Needed evertime we require mongoose
