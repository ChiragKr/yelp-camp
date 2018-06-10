var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");

//=======================================================
//                  CAMPGROUND ROUTES
//=======================================================

// 'INDEX' ROUTE (campgrounds)
router.get("/", function(req, res){
    // retriving all campground data from database
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            //using middleware we didn't have to send "req.user" in every route like we did below
            res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user});
       }
    });
    // res.render("campgrounds", {campgrounds : campgrounds});
});

// 'CREATE' ROUTE (campgrounds)
router.post("/", isLoggedIn, function(req, res){
    // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username: req.user.username
    }
    
    //create new campground
    var newCampground = {name: name, image: image, description: desc, author:author};

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
router.get("/new", isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// 'SHOW' ROUTE (campgrounds)
router.get("/:id", function(req, res) {
    // find camp ground with provided ID
    (Campground.findById(req.params.id).populate("comments")).exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// 'EDIT' ROUTE (campgrounds)
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground : foundCampground});
    });
});

// 'UPDATE' ROUTE (campgrounds)
router.put("/:id", checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// 'DESTROY' ROUTE (campgrounds)
router.delete("/:id", checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()) {
       return next();
   } 
   res.redirect("/login");
}

function checkCampgroundOwnership (req, res, next){
    // is user logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                // otherwise, redirect
                else {
                    res.redirect("back");
                }
            }
        });
    }
    // if not, redirect
    else {
        res.redirect("back");
    } 
}

module.exports = router;