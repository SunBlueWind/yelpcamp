var Campground = require("../models/campground");
var Comment    = require("../models/comment");

var middleware = {};

middleware.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
};

middleware.checkCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if (err || !campground) {
                req.flash("error", "Something Went Wrong");
                res.redirect("/campgrounds");
            } else if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You Don't Have Permission To Do That");
                res.redirect("/campgrounds");
            }
        });
    } else {
        req.flash("error", "Please Login First");
        res.redirect("/login");
    }
};

middleware.checkCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err || !comment) {
                req.flash("error", "Something Went Wrong");
                res.redirect("/campgrounds");
            } else if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You Don't Have Permission To Do That");
                res.redirect("/campgrounds");
            }
        })
    } else {
        req.flash("error", "Please Login First");
        res.redirect("/login");
    }
};

module.exports = middleware;