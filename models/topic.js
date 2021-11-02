const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    date: {
        type: Date,
        default: Date.now,
        format: "%Y-%m-%d%",
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
    ]
});

module.exports = mongoose.model("Topic", topicSchema); // Needed evertime we require mongoose