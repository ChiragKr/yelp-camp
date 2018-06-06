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
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Loard Hill", 
//         image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c378a7e9b0b9_340.jpg"
        
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     });

// var campgrounds = [
//         {name: "Salmon Creek", image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439df2c079a3e8b4_340.jpg"},
//         {name: "Loard Hill", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c378a7e9b0b9_340.jpg"},
//         {name: "Pitts Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
//         {name: "Collin Woods", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"},
//         {name: "Pitts Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
//         {name: "Salmon Creek", image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439df2c079a3e8b4_340.jpg"},
//         {name: "Collin Woods", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"},
//         {name: "Loard Hill", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c378a7e9b0b9_340.jpg"}
//     ];

// add routes below
app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // retriving all campground data from database
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds", {campgrounds : allCampgrounds});
       }
    });
    // res.render("campgrounds", {campgrounds : campgrounds});
});

app.post("/campgrounds", function(req, res){
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    
    //create new campground
    var newCampground = {name: name, image: image};
    
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

app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started!");
});