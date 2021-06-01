let mongoose = require("mongoose");
const Updates = require("./updates");
let commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Data from User model schema
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", //Data from User model schema
    },
    update: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Updates", //Data from User model schema
    },
    text: String,
    date: {
        type: Date,
        default: Date.now,
        format: "%Y-%m-%d%",
    },
})
commentSchema.pre("remove", async function (next) {
    try {
        await Updates.deleteOne({
            _id: {
                $in: this.update,
            },
        });

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Comment", commentSchema);