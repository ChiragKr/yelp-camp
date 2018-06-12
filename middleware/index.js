// all middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
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

middlewareObj.checkCommentOwnership = function (req, res, next){
    // is user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
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

middlewareObj.isLoggedIn = function(req, res, next){
   if(req.isAuthenticated()) {
       return next();
   } 
   res.redirect("/login");
}

module.exports = middlewareObj