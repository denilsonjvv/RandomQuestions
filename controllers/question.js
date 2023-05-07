const Question = require("../models/question");
const Updates = require("../models/updates");
const Comment = require("../models/comment");
module.exports = {
  async showQuestion(req, res, next) {
    const question = await Question.findById(req.params.id)
      .populate({
        path: "author",
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .populate({
        path: "updates",
        populate: "question author",
      });
    Promise.resolve(question).catch(next);
    if (!question) {
      await res.render("errors/project", { projectID: req.params.id }); // First Error Handling Page
      return;
    }
    await res.render("questions/show", { question });
  },
  createQuestion(req, res) {
    const { title, description } = req.body;
    const { _id } = req.user;
    const infoFields = {
      title,
      description,
      author: _id,
    };
    let errors = [];
    if (!title.trim() || !description.trim()) {
      errors.push({ msg: "Fill in all fields please" });
    }
    if (errors.length > 0) {
      res.render("questions/new", { errors, title, description });
      return;
    }
    //Create a new and save to database
    Question.create(infoFields, function (err, newQuestion) {
      if (err) {
        console.log(err);
        return;
      }
      const updatesInfo = {
        author: _id,
        question: newQuestion._id,
        action: "created a question",
      };
      Updates.create(updatesInfo, function (err, newlyUpdated) {
        if (err) {
          console.log("Could not create update schema." + err);
          return;
        }
        newlyUpdated.save();
        newQuestion.updates.push(newlyUpdated);
        newQuestion.save();
        //successfully added data to update
        // TODO: This will need to be refactored/modified for better error handling
        req.flash(
          "success_msg",
          "Your new project has been created, check it out below!"
        );
        res.redirect("/p/" + newQuestion._id + "/"); //redirect back to show page
      });
    });
  },
  showEditQuestion(req, res) {
    Question.findById(req.params.id, function (err, project) {
      if (err) {
        req.flash(
          "info_msg",
          "There was a problem accessing your project, try again."
        );
        res.redirect("/");
        return;
      }
      res.render("questions/edit", { project });
    });
  },
  async updateQuestion(req, res) {
    let question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body.project
    );
    if (req.body.project) {
      try {
        await question.save();
        req.flash("success_msg", "Your question has been updated.");
        res.redirect("/p/" + question._id + "/"); //redirect back to show page
      } catch (err) {
        req.flash("success_msg", "Your question has been updated.");
        res.render("questions/show");
      }
    }
    // Question.findByIdAndUpdate(
    //     req.params.id,
    //     req.body.project,
    //     (err, question) => {
    //         if (err) {
    //             console.log("error finding question and updating", err);
    //         } else {
    //             const updatesInfo = {
    //                 author: req.user._id,
    //                 question: question._id,
    //                 action: "updated a question",
    //             };
    //             Updates.create(updatesInfo, function (err, newlyUpdated) {
    //                 if (err) {
    //                     console.log(
    //                         "error at create update while saving edit",
    //                         err
    //                     );
    //                 } else {
    //                     newlyUpdated.save();
    //                     question.updates.push(newlyUpdated);
    //                     question.save();
    //                     //successfully added data to update
    //                     req.flash(
    //                         "success_msg",
    //                         "Your question has been updated."
    //                     );
    //                     res.redirect("/p/" + question._id + "/"); //redirect back to show page
    //                 }
    //             });
    //         }
    //     }
    // );
  },
  deleteQuestion(req, res, next) {
    Question.findById(req.params.id, function (err, project) {
      if (err) return next(err);
      project.delete();
      req.flash("success_msg", "Your question has been deleted.");
      res.redirect("/");
    });
  },
  showCommentForm(req, res, next) {
    Question.findById(req.params.id, (err, question) => {
      if (err) {
        return next(err);
      }
      res.render("questions/newComment", { question });
    });
  },
  async postNewComment(req, res) {
    const { _id } = req.user;
    const { text } = req.body;
    let question = await Question.findById(req.params.id);

    const updatesBody = {
      author: _id,
      question: question.id,
      action: "commented on",
    };
    const newUpdate = await Updates.create(updatesBody);

    const commentBody = {
      author: _id,
      question: question.id,
      update: newUpdate.id,
      text,
    };
    const newComment = await Comment.create(commentBody);
    if (req.body) {
      try {
        await question.updates.push(newUpdate);
        await question.comments.push(newComment);
        await question.save();
        //successfully added data to update
        req.flash("success_msg", "Comment has been added!");
        res.redirect("/p/" + question._id + "/"); //redirect back to show page
      } catch (err) {
        req.flash("error_msg", err);
        res.redirect("/p/" + question._id + "/comment"); //redirect back to show page
      }
    }
  },
  async editComment(req, res) {
    const question = await Question.findById(req.params.id);
    const comment = await Comment.findById(req.params.comment_id);

    if (question && comment) {
      res.render("questions/comments/edit", { question, comment });
    }
  },
  async updateComment(req, res) {
    let comment = await Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment
    );
    if (comment) {
      try {
        await comment.save();
        req.flash("success_msg", "Your comment has been updated.");
        res.redirect("/p/" + req.params.id + "/"); //redirect back to show page
      } catch (err) {
        req.flash("error_msg", `Error updating your comment ${err}`);
        res.redirect(`/p/${req.params.id}`);
      }
    }
  },
  async deleteQuestionComment(req, res, next) {
    let comment = await Comment.findByIdAndDelete(req.params.comment_id);
    if (comment) {
      try {
        await comment.delete();
        req.flash("success_msg", "Your comment has been deleted.");
        res.redirect(`/p/${req.params.id}`);
      } catch (err) {
        req.flash("error_msg", "Error deleting your comment, try again");
        res.render(`p/${req.params.id}`);
      }
    }
  },
};
