let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Data from User model schema
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", //Data from User model schema
    },
    text: String,
    date: {
        type: Date,
        default: Date.now,
        format: "%Y-%m-%d%",
    },
})

module.exports = mongoose.model("Comment", commentSchema);