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
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    Project = require("./models/question");
//Require routes
const indexRoutes = require("./routes/index"),
    homeRoutes = require("./routes/home"),
    profileRoutes = require("./routes/profile"),
    projectRoutes = require("./routes/project");
//Environment Variables
require("dotenv").config();

//MONGODB Connect + Environment Variable
// ** CONFIGURE MONGODB VARIABLE TO YOUR CONFIGURATIONS
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

//allows express to track files as .ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); // allows PUT and DELETE as a post request

// Express session
app.use(
    session({
        secret: "The Questions",
        resave: true,
        saveUninitialized: true,
    })
);
//Connect flash messages
app.use(flash());
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Global vars
app.use(async function (req, res, next) {
    if (req.user) {
        try {
            let project = await Project.find({ "author.id": req.user._id });
            let globalProjects = await Project.find({});
            res.locals.allProjects = globalProjects;
            res.locals.currentUserProjects = project;
        } catch (err) {
            console.log(err.message);
        }
    }
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.info_msg = req.flash("info_msg");
    res.locals.error = req.flash("error");
    next();
});
//Locate Routes
app.use("/user", indexRoutes); //login and register
app.use(homeRoutes); //  "/"
app.use("/p", projectRoutes);
app.use("/profile", profileRoutes);

//-----------------LISTENING TO APP SERVER
const hostname = "127.0.0.1";
const port = 4040;
app.listen(port, hostname, () => {
    console.log(`Server running: http://${hostname}:${port}/`);
});
