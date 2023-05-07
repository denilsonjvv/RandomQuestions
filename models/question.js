const mongoose = require("mongoose");
const Updates = require("./updates"),
  Comments = require("./comment");

const questionSchema = new mongoose.Schema({
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
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
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
    await Comments.deleteMany({
      _id: {
        $in: this.comments,
      },
    });

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Question", questionSchema); // Needed evertime we require mongoose
