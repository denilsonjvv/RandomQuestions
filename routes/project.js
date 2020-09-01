var express = require("express");
var router = express.Router({ mergeParams: true });

var Project = require("../models/question"),
    User = require("../models/user"),
    Task = require("../models/task"),
    Updates = require("../models/updates"),
    auth = require("../config/auth"); // connect to auth file to authorize.

//Show Post Form
router.get("/new", auth.userIsLogged, function (req, res) {
    res.render("projects/new", { user: req.user });
});
//SHOW project page
router.get("/:id", auth.userIsLogged, function (req, res) {
    Project.findById(req.params.id)
        .populate("tasks")
        .exec(function (err, foundProject) {
            if (err) {
                res.render("errors/project", { projectID: req.params.id }); // First Error Handling Page
            } else {
                res.render("projects/show", { project: foundProject });
            }
        });
});
//CREATE new project
router.post("/", auth.userIsLogged, function (req, res) {
    //req.body information from form
    let { title, description } = req.body;
    //req.user information from logged in user
    let { _id, username, profileImg } = req.user;
    const author = {
        id: _id,
        username,
        profileImg,
    };
    const infoFields = {
        title,
        description,
        author,
    };
    //Error handling
    let errors = [];
    //check required fields
    if (!title.trim() || !description.trim()) {
        errors.push({ msg: "Fill in all fields please" });
    }
    if (errors.length > 0) {
        res.render("projects/new", { errors, title, description });
    } else {
        //Create a new and save to database
        Project.create(infoFields, function (err, newQuestion) {
            if (err) {
                console.log(err);
            } else {
                let updatesInfo = {
                    id: newQuestion._id,
                    username,
                    title,
                };
                Updates.create(updatesInfo, function (err, newlyUpdated) {
                    if (err) {
                        console.log("Could not create update schema." + err);
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
});

//Edit project page
router.get("/:id/edit", auth.checkIfOwner, auth.userIsLogged, function (
    req,
    res
) {
    Project.findById(req.params.id, function (err, project) {
        if (err) {
            req.flash(
                "info_msg",
                "There was a problem accessing your project, try again."
            );
            res.redirect("/");
        } else {
            res.render("projects/edit", { project });
        }
    });
});
//UPDATE project page
router.put("/:id", auth.checkIfOwner, auth.userIsLogged, function (req, res) {
    Project.findByIdAndUpdate(req.params.id, req.body.project, function (
        err,
        project
    ) {
        if (err) {
            req.flash(
                "info_msg",
                "There was a problem updating your project, try again."
            );
            res.redirect("back");
        } else {
            req.flash(
                "success_msg",
                "Your project page has been updated successfully."
            );
            res.redirect("/p/" + project._id);
        }
    });
});
//DESTROY project page
router.delete("/:id", auth.userIsLogged, auth.checkIfOwner, function (
    req,
    res,
    next
) {
    Project.findById(req.params.id, function (err, project) {
        if (err) return next(err);
        project.delete();
        // Need to add flash message for deletion confirmation
        res.redirect("/");
    });
});

// //Assign users to project Page
// router.get("/:id/assign", auth.checkIfOwner, auth.userIsLogged, function (
//   req,
//   res
// ) {
//   Project.findById(req.params.id, function (err, project) {
//     if (err) {
//       req.flash(
//         "info_msg",
//         "There was a problem accessing your project, try again."
//       );
//       res.redirect("/");
//     } else {
//       User.find({}, function (err, foundUsers) {
//         res.render("projects/assign", { project, users: foundUsers });
//       });
//     }
//   });
// });
// //Add members to project route ** Needs Work And Attention **
// router.post("/:id/assign", auth.userIsLogged, function (req, res) {
//   var memIds = req.body.members; //array of ids
//   User.find({ _id: memIds }, function (err, usersFound) {
//     if (err) {
//       console.log(err);
//     } else {
//       Project.findByIdAndUpdate(
//         req.params.id,
//         { members: usersFound },
//         { useFindAndModify: false },
//         function (err, updated) {
//           if (err) {
//             req.flash(
//               "info_msg",
//               "There was a problem while adding members to your project, try again."
//             );
//             res.redirect("/");
//           } else {
//             req.flash("success_msg", "Congrats, your members were updated!");
//             res.redirect("/p/" + req.params.id + "/newtask");
//           }
//         }
//       );
//     }
//   });
// });

// // New task page
// router.get("/:id/newtask", auth.userIsLogged, function (req, res) {
//   Project.findById(req.params.id, function (err, foundProject) {
//     if (err) {
//       res.render("errors/project", { projectID: req.params.id });
//     } else {
//       User.find({}, function (err, foundUsers) {
//         res.render("tasks/new", { project: foundProject, user: foundUsers });
//       });
//     }
//   });
// });

// // Create new task
// router.post("/:id", auth.userIsLogged, function (req, res) {
//   var task = req.body.task;
//   var assigned = req.body.assigned;
//   var priority = req.body.priority;
//   var dueDate = req.body.dueDate;
//   var createdby = {
//     id: req.user._id,
//     name: req.user.name,
//     profileImg: req.user.profileImg,
//   };
//   var newTask = {
//     task: task,
//     assigned: assigned,
//     priority: priority,
//     dueDate: dueDate,
//     createdby: createdby,
//   };
//   Project.findById(req.params.id, function (err, foundProject) {
//     if (err) {
//       console.log("project ID not found error.");
//       res.redirect("/");
//     } else {
//       Task.create(newTask, function (err, foundTask) {
//         if (err) {
//           console.log("Task not found error.");
//         } else {
//           foundTask.save();
//           foundProject.tasks.push(foundTask);
//           foundProject.save();
//           res.redirect("/p/" + foundProject._id); //redirect back to campgrounds page
//         }
//       });
//     }
//   });
// });
// //Edit task page
// router.get("/:proj_id/:task_id/edit", function (req, res) {
//   Project.findById(req.params.proj_id, function (err, project) {
//     if (err) {
//       req.flash(
//         "info_msg",
//         "There was a problem accessing this project ID, try again."
//       );
//       res.redirect("/");
//     } else {
//       Task.findById(req.params.task_id, function (err, task) {
//         if (err) {
//         } else {
//           User.find({}, function (err, foundUsers) {
//             res.render("tasks/edit", { task, project, user: foundUsers });
//           });
//         }
//       });
//     }
//   });
// });
// //DELETE task
// router.delete("/:proj_id/:task_id", function (req, res, next) {
//   Project.findById(req.params.proj_id, function (err, foundProject) {
//     if (err) {
//       console.log("project ID not found error.");
//       res.redirect("/");
//     } else {
//       //findbyIDandRemove
//       Task.findById(req.params.task_id, function (err, foundTask) {
//         if (err) {
//           // error handler needed
//           res.redirect("back");
//         } else {
//           foundProject.tasks.remove(foundTask);
//           foundProject.save();
//           foundTask.remove();
//           res.redirect("/p/" + req.params.proj_id);
//         }
//       });
//     }
//   });
// });

//Global Router
module.exports = router;
