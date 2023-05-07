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
  Seed = require("./seeds");
// Seed();
//MONGODB Connect
const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:127.0.0.1/questions";
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
  if (req.user) {
    try {
      const project = await Project.find({ author: req.user._id });
      const globalProjects = await Project.find({});
      const globalUpdates = await Updates.find({ action: "created a question" })
        .populate("question", "_id title")
        .populate("author", "username profileImg");
      res.locals.currentUserProjects = project;
      res.locals.allProjects = globalProjects;
      res.locals.globalUpdates = globalUpdates;
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
//Require routes
const indexRoutes = require("./routes/index"),
  homeRoutes = require("./routes/home"),
  profileRoutes = require("./routes/profile"),
  questionRoutes = require("./routes/question");
//Locate Routes
app.use("/user", indexRoutes); //login and register
app.use(homeRoutes); //  "/"
app.use("/p", questionRoutes);
app.use("/profile", profileRoutes);

//-----------------LISTENING TO APP SERVER
const hostname = "127.0.0.1";
const port = 4040;
app.listen(port, hostname, () => {
  console.log(`Server running: http://${hostname}:${port}/`);
});
