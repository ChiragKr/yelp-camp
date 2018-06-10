var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//=======================================================
//                   COMMENT ROUTES
//=======================================================

// 'NEW' ROUTE (comments)
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
});

// 'POST' ROUTE (comments)
router.post("/", isLoggedIn, function(req, res){
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

// middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()) {
       return next();
   } 
   res.redirect("/login");
}

module.exports = router;