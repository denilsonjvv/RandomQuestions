let Question = require("../models/question");
let Updates = require("../models/updates");
module.exports = {
    showQuestion(req, res, next) {
        Question.findById(req.params.id)
            .populate("author")
            .exec(function (err, foundProject) {
                if (err) {
                    res.render("errors/project", { projectID: req.params.id }); // First Error Handling Page
                } else {
                    res.render("questions/show", { project: foundProject });
                }
            });
    },
    createQuestion(req, res) {
        //req.body information from form
        let { title, description } = req.body;
        //req.user information from logged in user
        let { _id } = req.user;
        const infoFields = {
            title,
            description,
            author: _id,
        };
        //Error handling
        let errors = [];
        //check required fields
        if (!title.trim() || !description.trim()) {
            errors.push({ msg: "Fill in all fields please" });
        }
        if (errors.length > 0) {
            res.render("questions/new", { errors, title, description });
        } else {
            //Create a new and save to database
            Question.create(infoFields, function (err, newQuestion) {
                if (err) {
                    console.log(err);
                } else {
                    let updatesInfo = {
                        author: _id,
                        question: newQuestion._id,
                        action: "created a question",
                    };
                    Updates.create(updatesInfo, function (err, newlyUpdated) {
                        if (err) {
                            console.log(
                                "Could not create update schema." + err
                            );
                        } else {
                            newlyUpdated.save();
                            newQuestion.updates.push(newlyUpdated);
                            newQuestion.save();
                            //successfully added data to update
                            // NOTE: This will need to be refactored/modified for better error handling
                            req.flash(
                                "success_msg",
                                "Your new project has been created, check it out below!"
                            );
                            res.redirect("/p/" + newQuestion._id + "/"); //redirect back to show page
                        }
                    });
                }
            });
        } //End if statement
    },
    showEditQuestion(req, res, next) {
        Question.findById(req.params.id, function (err, project) {
            if (err) {
                req.flash(
                    "info_msg",
                    "There was a problem accessing your project, try again."
                );
                res.redirect("/");
            } else {
                res.render("questions/edit", { project });
            }
        });
    },
    updateQuestion(req, res) {
        Question.findByIdAndUpdate(
            req.params.id,
            req.body.project,
            (err, question) => {
                if (err) {
                    console.log("error finding question and updating", err);
                } else {
                    const updatesInfo = {
                        author: req.user._id,
                        question: question._id,
                        action: "updated a question",
                    };
                    Updates.create(updatesInfo, function (err, newlyUpdated) {
                        if (err) {
                            console.log(
                                "error at create update while saving edit",
                                err
                            );
                        } else {
                            newlyUpdated.save();
                            question.updates.push(newlyUpdated);
                            question.save();
                            //successfully added data to update
                            req.flash(
                                "success_msg",
                                "Your question has been updated."
                            );
                            res.redirect("/p/" + question._id + "/"); //redirect back to show page
                        }
                    });
                }
            }
        );
    },
    deleteQuestion(req, res, next) {
        Question.findById(req.params.id, function (err, project) {
            if (err) return next(err);
            project.delete();
            req.flash("success_msg", "Your question has been deleted.");
            res.redirect("/");
        });
    },
};
