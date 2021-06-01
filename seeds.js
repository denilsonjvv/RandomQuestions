const mongoose = require("mongoose");
const Questions = require("./models/question");
const Comment = require("./models/comment");
const Updates = require("./models/updates");

const { Types: { ObjectId } } = mongoose;

let data = [
    // {
    //     title: "How big is the moon?",
    //     description: "the Moon could be very very large",
    //     author: new mongoose.mongo.ObjectId("5f567c4a4b2b062210af2f3f"),
    // },
    // {
    //     title: "Is maisel cute af or what?",
    //     description: "my itty itty is the bestest",
    //     author: new mongoose.mongo.ObjectId("5f567c4a4b2b062210af2f3f"),
    // },
    {
        title: "Am I a hungry hippo?",
        description: "Yes very much, im hungry rn!",
        author: {
            '_id': mongoose.Types.ObjectId("5f567c4a4b2b062210af2f3f"),
            'username': 'DeeTheDev',
            'profileImg': 'i-3.png'
        }
    }
]
async function seedDB() {
    await Questions.remove({}, (err) => {
        if(err) return console.log(err);
        console.log("removed questions!");
    })
    await Updates.remove({}, (err) => {
        if(err) return console.log(err);
        console.log("removed comments!");
    })
    await Comment.remove({}, (err) => {
        if(err) return console.log(err);
        console.log("removed updates!");
    })
    data.forEach( async (seed)=> {
        let question = await Questions.create(seed);
        if(question) {
            try{
                let commentData= [
                    {
                        author: {
                            '_id': mongoose.Types.ObjectId("5f567c4a4b2b062210af2f3f"),
                            'username': 'DeeTheDev',
                            'profileImg': 'i-3.png'
                        },
                        question: question.id,
                        text: "Blaaaaaaaaah...",
                    },
                ]
                let newComment =   Comment.create(commentData);
                
                 question.comments.push(newComment);
                 question.save();
                console.log("Created new Comment!")
            }catch(err){
                console.log(err)
            }
        }


        // await Questions.create(seed, async (err, question) => {
        //     if(err){
        //         console.log(err);
        //     } else {
        //         console.log("added question!");
        //         Comment.create(commentData,  (err, comment) => {
        //                 if (err) return console.log(err);
        //                 await question.comments.push(comment);
        //                 question.save();
        //                 console.log("Created new Comment!")
        //             }
        //         )
        //     }
        // })
    })
}
module.exports = seedDB;