let Question = require("../models/question");
let Comment = require("../models/comment");
middlewareObj = {};

middlewareObj.userIsLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("info_msg", "Please log in to view this resource");
        res.redirect("/user/login");
    }
};

middlewareObj.checkIfOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        //find the Question with ID
        Question.findById(req.params.id || req.params.proj_id)
            .populate("author", "_id")
            .exec((err, foundQuestion) => {
                if (err) {
                    res.render("errors/project", { projectID: req.params.id });
                } else {
                    if (foundQuestion.author._id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash(
                            "info_msg",
                            "You are not the authorized owner."
                        );
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("info_msg", "You must be logged in to access this page.");
        res.redirect("back");
    }
};
middlewareObj.checkIfCommentOwner = (req, res, next)  => {
    if (req.isAuthenticated()) {
        //find the Question with ID
        Comment.findById(req.params.comment_id)
            .populate("author", "_id")
            .exec((err, comment) => {
                if(err){      
                    req.flash(
                        "info_msg",
                        "There was an error finding the comment."
                        );
                    res.redirect("back");
                }else {
                    if(comment.author._id.equals(req.user._id)){
                        next();
                    }else {
                        req.flash(
                            "info_msg",
                            "You are not the authorized comment owner."
                            );
                        res.redirect("back");
                    };
                }
            });

    } else {
        req.flash("info_msg", "You must be logged in to access this page.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
