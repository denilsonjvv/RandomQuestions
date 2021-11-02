// Mongodb session and core packages
const mongoose = require("mongoose"),
    session = require("express-session"),
    express = require("express"),
    app = express();
//Utilities packages
const flash = require("connect-flash"),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    Project = require("./models/question"),
    Updates = require("./models/updates"),
    Topic = require("./models/topic"),
    Seed = require("./seeds");
    // Seed();
//MONGODB Connect
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(
    MONGODB_URL,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    },
    function (err) {
        if (err) {
            console.log(err); 
        }
    }
);

//Connect flash messages
app.use(flash());
app.use(cookieParser());
//use bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
//allows express to track files as .ejs
app.set("view engine", "ejs");
//set core directory path
app.use(express.static(__dirname + "/public"));
// allows PUT and DELETE as a post request
app.use(methodOverride("_method"));

// Express session
app.use(
    session({
        secret: "The Questions",
        resave: false,
        saveUninitialized: true,
    })
);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Global vars
app.use(async function (req, res, next) {
    //check req.user is valid- checks if user is logged in
    try {
        if (req.user) {
            const project = await Project.find({ author: req.user._id });
            res.locals.currentUserProjects = project;
        }
        const globalProjects = await Project.find({});
        const globalUpdates = await Updates.find({ action: "created a question" })
            .populate("question", "_id title")
            .populate("author", "username profileImg");
        res.locals.allProjects = globalProjects;
        res.locals.globalUpdates = globalUpdates;
    } catch (err) {
        console.log(err.message);
    }
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.info_msg = req.flash("info_msg");
    res.locals.error = req.flash("error");
    next();
});
//Require routes
const indexRoutes = require("./routes/index"),
    homeRoutes = require("./routes/home"),
    profileRoutes = require("./routes/profile"),
    questionRoutes = require("./routes/question"),
    topicRoutes = require("./routes/topic");
app.use("/user", indexRoutes);
app.use(homeRoutes);
app.use("/p", questionRoutes);
app.use("/profile", profileRoutes);
app.use("/topic", topicRoutes);

// Run app server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running with port ${port}`);
});
