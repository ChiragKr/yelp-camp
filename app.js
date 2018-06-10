var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var Campground = require("./models/campground.js");
var Comment    = require("./models/comment.js");
var User       = require("./models/user.js");
var seedDB     = require("./seeds.js");
var methodOverride    = require("method-override");
var passport          = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose");

// REQUIRING ROUTES
var campgroundRoutes = require("./routes/campgrounds.js"),
       commentRoutes = require("./routes/comments.js"),
         indexRoutes = require("./routes/index.js");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "the ultimate truth is 72",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//app.use(middleware)
app.use(function(req, res, next){
    //adds req.user in (all) the request(s)
    //as the variable name "currentUser"
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started!");
});