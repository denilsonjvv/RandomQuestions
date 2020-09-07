var Project = require("../models/question");
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
        //find the Project with ID
        Project.findById(req.params.id || req.params.proj_id)
            .populate("author", "_id")
            .exec((err, foundProject) => {
                if (err) {
                    res.render("errors/project", { projectID: req.params.id });
                } else {
                    if (foundProject.author._id.equals(req.user._id)) {
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

module.exports = middlewareObj;
