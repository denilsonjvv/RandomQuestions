var mongoose = require("mongoose");

//SCHEMA SETUP
var updatesSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Data from User model schema
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", //Data from User model schema
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", //Data from User model schema
    },
    action: String,
    lastUpdated: {
        type: Date,
        format: "%Y-%m-%d%",
        default: new Date(),
    },
    date: {
        type: Date,
        default: Date.now,
        format: "%Y-%m-%d%",
    }
});

module.exports = mongoose.model("Updates", updatesSchema); // Needed evertime we require mongoose
