var mongoose = require("mongoose");
var Task = require("./task"),
    Updates = require("./updates");

//SCHEMA SETUP
var questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        default: Date.now,
        format: "%Y-%m-%d%",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Data from User model schema
    },
    //Updates
    updates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Updates",
        },
    ],
});
questionSchema.pre("remove", async function (next) {
    try {
        await Updates.deleteMany({
            _id: {
                $in: this.updates,
            },
        });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Question", questionSchema); // Needed evertime we require mongoose
