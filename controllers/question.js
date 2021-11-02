let Question = require("../models/question");
let Updates = require("../models/updates");
let Comment = require("../models/comment");
module.exports = {
    async showQuestion(req, res) {
        try {
            const question = await Question.findById(req.params.id)
            .populate({
                path: 'author'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'User'
                }
            })
            .populate({
                path: 'updates',
                populate: 'question author'
            })
                .populate({
                    path: 'topics',
                    populate: 'title'
            });
            res.render("questions/show", { question });
        } catch (error) {
            res.render("errors/project", { projectID: req.params.id });
        }
    },
    async createQuestion(req, res) {
        const { title, description } = req.body;
        const { _id } = req.user;
        const infoFields = {
            title,
            description,
            author: _id,
        };
        let errors = [];
        if (!title.trim() || !description.trim()) {
            errors.push({ msg: "Fill in all empty fields please" });
        }
        if (errors.length > 0) {
            res.render("questions/new", { errors, title, description });
        } else {
            try {
                const newQuestion = await Question.create(infoFields);
                const updatesInfo = {
                    author: _id,
                    question: newQuestion._id,
                    action: "created a question",
                };
                const newUpdate = await Updates.create(updatesInfo);
                newUpdate.save();
                newQuestion.updates.push(newUpdate);
                newQuestion.save();
                req.flash(
                    "success_msg",
                    "Your new question has been created, check it out below!"
                );
                res.redirect("/p/" + newQuestion._id + "/"); //redirect back to show page
            } catch (error) {
                res.status(500).send(error);
            }
        }
    },
    async showEditQuestion(req, res) {
        try {
            const question = await Question.findById(req.params.id);
            res.render("questions/edit", { question });
        } catch (error) {
            req.flash(
                "info_msg",
                "There was a problem accessing your question, try again."
            );
            res.redirect("/");
        }
    },
    async updateQuestion(req, res) {
        let question = await Question.findByIdAndUpdate(req.params.id,
            req.body.question);
        if (req.body.question) {
            try{
                await question.save();
                req.flash(
                    "success_msg",
                    "Your question has been updated."
                );
                res.redirect("/p/" + question._id + "/"); //redirect back to show page
            
            }catch(err) {
                req.flash(
                    "success_msg",
                    "Your question has been updated."
                );
               res.render("questions/show")
            }
        }
    },
    deleteQuestion(req, res, next) {
        Question.findById(req.params.id, function (err, project) {
            if (err) return next(err);
            project.delete();
            req.flash("success_msg", "Your question has been deleted.");
            res.redirect("/");
        });
    },
    showCommentForm(req,res,next){
        Question.findById(req.params.id, (err, question)=> {
            if(err) return next(err);
            res.render("questions/comments/new", { question });
        })
    },
    async postNewComment(req,res){
        const { _id } = req.user;
        const { text } = req.body;
        let question = await Question.findById(req.params.id);

        const updatesBody = {
            author: _id,
            question: question.id,
            action: "commented on",
        };
        let newUpdate = await Updates.create(updatesBody);
        
        const commentBody = {
            author: _id,
            question: question.id,
            update: newUpdate.id,
            text,
        };
        let newComment = await Comment.create(commentBody);

        if(req.body){
            try{
                await question.updates.push(newUpdate);
                await question.comments.push(newComment);
                await question.save();
                //successfully added data to update
                req.flash(
                    "success_msg",
                    "Comment has been added!"
                );
                res.redirect("/p/" + question._id + "/"); //redirect back to show page
            } catch(err) {
                req.flash(
                    "error_msg",
                    err
                );
                res.redirect("/p/" + question._id + "/comment"); //redirect back to show page
            }
        }

    },
    async editComment(req,res){
        let question = await Question.findById(req.params.id);
        let comment = await Comment.findById(req.params.comment_id);

        if(question && comment) {
            res.render("questions/comments/edit", {question, comment});
        }
    },
    async updateComment(req,res){
        let comment = await Comment.findByIdAndUpdate(req.params.comment_id,
            req.body.comment);
        if (comment) {
            try{
                await comment.save();
                req.flash(
                    "success_msg",
                    "Your comment has been updated."
                );
                res.redirect("/p/" + req.params.id + "/"); //redirect back to show page
            
            }catch(err) {
                req.flash(
                    "error_msg",
                    `Error updating your comment ${err}`
                );
               res.redirect(`/p/${req.params.id}`)
            }
        }
    },
    async deleteQuestionComment(req, res, next) {
        let comment = await Comment.findByIdAndDelete(req.params.comment_id)
        if (comment) {
            try{
                await comment.delete();
                req.flash("success_msg", "Your comment has been deleted.");
                res.redirect(`/p/${req.params.id}`);
            }catch(err) {
                req.flash(
                    "error_msg",
                    "Error deleting your comment, try again"
                );
                res.render(`p/${req.params.id}`)
            }
        }
    },
};
