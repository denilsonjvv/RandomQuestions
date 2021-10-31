const express = require("express");
const router = express.Router({ mergeParams: true });
let auth = require("../config/auth"); // connect to auth file to authorize.
//import methods from controller
const {
    showQuestion,
    createQuestion,
    showEditQuestion,
    updateQuestion,
    deleteQuestion,
    showCommentForm,
    postNewComment,
    editComment,
    updateComment,
    deleteQuestionComment
} = require("../controllers/question");

//SHOW project page
router.get("/:id", showQuestion);
//NEW Post page
router.get("/new", auth.userIsLogged, (req, res) => {
    res.render("questions/new", { user: req.user });
});
//CREATE question
router.post("/", auth.userIsLogged, createQuestion);
//EDIT question page
router.get("/:id/edit", auth.userIsLogged, auth.checkIfOwner, showEditQuestion);
//UPDATE question
router.put("/:id", auth.userIsLogged, auth.checkIfOwner, updateQuestion);
//DESTROY question
router.delete("/:id", auth.userIsLogged, auth.checkIfOwner, deleteQuestion);

//QUESTION COMMENTS ROUTES
//NEW comment page
router.get("/:id/comment/new", auth.userIsLogged, showCommentForm);
//CREATE comment
router.post("/:id/comment", auth.userIsLogged, postNewComment);
//EDIT comment page
router.get("/:id/comment/:comment_id/edit",auth.userIsLogged, auth.checkIfCommentOwner, editComment)
//UPDATE comment
router.put("/:id/comment/:comment_id", auth.userIsLogged, updateComment)
router.delete("/:id/comment/:comment_id", auth.userIsLogged, auth.checkIfCommentOwner, deleteQuestionComment);



// //Assign users to question Page
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
//         res.render("questions/assign", { project, users: foundUsers });
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
