var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var Campground = require("./models/campground.js");
var Comment    = require("./models/comment.js");
var seedDB     = require("./seeds.js");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();
app.use(express.static(__dirname + "/public"));

//=======================================================
//                  CAMPGROUND ROUTES
//=======================================================

// 'LANDING' ROUTE
app.get("/", function(req,res){
    res.render("landing");
});

// 'INDEX' ROUTE (campgrounds)
app.get("/campgrounds", function(req, res){
    // retriving all campground data from database
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
       }
    });
    // res.render("campgrounds", {campgrounds : campgrounds});
});

// 'CREATE' ROUTE (campgrounds)
app.post("/campgrounds", function(req, res){
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
    //create new campground
    var newCampground = {name: name, image: image, description: desc};

    // add newCampground to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log("NEWLY CREATED CAMPGROUND: ");
            console.log(newlyCreated);
            
             // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// 'NEW' ROUTE (campgrounds)
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new"); 
});

// 'SHOW' ROUTE (campgrounds)
app.get("/campgrounds/:id", function(req, res) {
    // find camp ground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//=======================================================
//                  COMMENT ROUTES
//=======================================================

// 'NEW' ROUTE (comments)
app.get("/campgrounds/:id/comments/new",function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
});

// 'POST' ROUTE (comments)
app.post("/campgrounds/:id/comments",function(req, res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campground");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect somewhere (campground show page)
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started!");
});