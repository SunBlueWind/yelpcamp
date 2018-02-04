var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

// new comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// create new comment for a campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err || !comment) {
                    req.flash("error", "Something Went Wrong");
                    res.redirect("/campgrounds");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success", "Successfully Created New Comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// edit a comment
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err || !comment) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/edit", {campgroundId: req.params.id, comment: comment});
        }
    });
});

// update a comment
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if (err || !comment) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Succesfully Updated Comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy a comment
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully Deleted Comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;