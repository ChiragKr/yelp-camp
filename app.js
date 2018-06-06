var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name : String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// {
//     name: "Granite Hill", 
//     image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c378a7e9b0b9_340.jpg",
//     description: "This is a huge Granite Hill. No bathrooms. No water. Beautiful granite!"
    
// }, function(err, campground) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//     }
// });

// ADD ROUTES BELOW

// 'LANDING' ROUTE
app.get("/", function(req,res){
    res.render("landing");
});

// 'INDEX' ROUTE
app.get("/campgrounds", function(req, res){
    // retriving all campground data from database
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("index", {campgrounds : allCampgrounds});
       }
    });
    // res.render("campgrounds", {campgrounds : campgrounds});
});

// 'CREATE' ROUTE
app.post("/campgrounds", function(req, res){
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
    //create new campground
    var newCampground = {name: name, image: image, description: desc};
    
    // add to campgrounds array
    // campgrounds.push(newCampground);
    
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

// 'NEW' ROUTE
app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

// 'SHOW' ROUTE
app.get("/campgrounds/:id", function(req, res) {
    // find camp ground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // render the show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started!");
});