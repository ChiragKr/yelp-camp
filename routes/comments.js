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

// 'CREATE' ROUTE (comments)
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
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
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

// 'EDIT' ROUTE (comments)
router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit",{campground_id : req.params.id, comment: foundComment});
        }
    })
});

// 'UPDATE' ROUTE (comments)
router.put("/:comment_id", function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// 'DESTROY' ROUTE (comments)
router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds/"+ req.params.id);
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
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