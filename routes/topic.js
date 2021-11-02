const express = require("express");
const router = express.Router({ mergeParams: true });
let Topic = require("../models/topic");

// Index topic page
router.get("/", async (req, res) => {
    try {
        const topics = await Topic.find({});
        res.render("topic/show", { topics });
    } catch (error) {
        res.status(500).send(error);
    }
});
// NEW topic page
router.get("/new", (req, res) => {
    res.render("topic/new");
})
// CREATE topic
router.post("/", async (req, res) => {
    const { title } = req.body;
    let errors = [];
    if (!title.trim()) {
        errors.push({ msg: "Please fill in all empty fields" });
    }
    if (errors.length > 0) {
        return res.render("topic/new", { errors, title });
    } else {
        try {
            const newTopic = await Topic.create({ title });
            newTopic.save();
            req.flash(
                "success_msg",
                "Your new project has been created, check it out below!"
            );
            res.redirect("/topic");
        } catch (error) {
            res.status(500).send(error);
        }
    }
})

module.exports = router;