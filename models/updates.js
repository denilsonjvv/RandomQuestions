var mongoose = require("mongoose");

//SCHEMA SETUP
var updatesSchema = new mongoose.Schema({
  id: String,
  username: String,
  title: String,
  lastUpdated: {
    type: Date,
    format: "%Y-%m-%d%",
    default: new Date(),
  },
});

module.exports = mongoose.model("Updates", updatesSchema); // Needed evertime we require mongoose
