const mongoose = require("mongoose");
const Question = require("./models/question");
const Comment = require("./models/comment");
const Updates = require("./models/updates");
const Topic = require("./models/topic");
const { ObjectID } = require("bson");

// This is the object _id of the first user in the database
const userObj = new ObjectID("618376fa3f01fc1d59f6b239");
let questionData = {
    title: "What is the largest thing on earth?",
    description: "Just a question i wanted to ask okay? :D",
    author: userObj
}
async function seedDB() {
    await Question.remove({}, (err) => {
        if (err) return console.log(err);
        console.log("removed questions!");
    })
    await Updates.remove({}, (err) => {
        if (err) return console.log(err);
        console.log("removed comments!");
    })
    await Comment.remove({}, (err) => {
        if (err) return console.log(err);
        console.log("removed updates!");
    })
    await Topic.remove({}, (err) => {
        if (err) return console.log(err);
        console.log("removed topics!");
    })
    try {
        const newQuestion = await Question.create(questionData);
        const updatesData = {
            author: questionData.author,
            question: newQuestion,
            action: "created a question",
        };
        const newUpdate = await Updates.create(updatesData);
        const commentData = {
            author: userObj,
            question: newQuestion,
            text: "Awesome questtionnnnn!"
        }
        const newComment = await Comment.create(commentData);
        const topicsData = [
            {
                title: "developers",
                questions: newQuestion
            },
            {
                title: "all",
                questions: newQuestion
            },
            {
                title: "these",
                questions: newQuestion
            },
            {
                title: "topics",
                questions: newQuestion
            }
        ]
        const newTopic = await Topic.insertMany(topicsData);
        newTopic.forEach((topic) => {
            newQuestion.topics.push(topic);
        })
        newQuestion.comments.push(newComment);
        newQuestion.updates.push(newUpdate);
        await newComment.save();
        await newUpdate.save();
        await newQuestion.save();
        console.log("Saved new updates and question, check it out below here");
    } catch (err) {
        console.log("there was an error:", err)
    }
}
module.exports = seedDB;