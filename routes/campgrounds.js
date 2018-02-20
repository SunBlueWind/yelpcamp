var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    geocoder   = require("geocoder");

// campgrounds index page
router.get("/", function(req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ "name": regex }, function(err, campgrounds){
            if (err) {
                req.flash("error", "Something Went Wrong");
                res.redirect("/campgrounds");
            } else if (campgrounds.length < 1) {
                res.render("campgrounds/index", {campgrounds: campgrounds, noMatch: true})
            } else {
                res.render("campgrounds/index", {campgrounds: campgrounds, noMatch: false});
            }
        });
    } else {
        Campground.find({}, function(err, campgrounds){
            if (err) {
                req.flash("error", "Something Went Wrong");
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/index", {campgrounds: campgrounds, noMatch: false});
            }
        });
    }
});

// create new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    var newCampground = req.body.campground;
    var newAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    newCampground.author = newAuthor;
    
    geocoder.geocode(req.body.location, function(err, data) {
        if (!data || data.results.length === 0) {
            req.flash("error", "Error: cannot find location");
            res.redirect("back");
            return;
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        newCampground.location = location;
        newCampground.lat = lat;
        newCampground.lng = lng;
        // Create new campground and add to DB
        Campground.create(newCampground, function(err, campground) {
            if (err) {
                req.flash("error", "Something Went Wrong");
                res.redirect("/");
            } else {
                req.flash("success", "Successfully Created New Campground");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// new campground form
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// update the edited campground
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
    geocoder.geocode(req.body.location, function(err, data) {
        console.log(data);
        if (data.results.length === 0) {
            req.flash("error", "Error: cannot find location");
            res.redirect("back");
            return;
        }
        var newCampground = req.body.campground;
        newCampground.lat = data.results[0].geometry.location.lat;
        newCampground.lng = data.results[0].geometry.location.lng;
        newCampground.location = data.results[0].formatted_address;
        
        Campground.findByIdAndUpdate(req.params.id, newCampground, function(err, campground) {
            if (err || !campground) {
                req.flash("error", "Something Went Wrong");
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Successfully Updated Campground");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    }); 
});

// destroy the campground
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully Deleted Campground");
            res.redirect("/campgrounds");
        }
    });
});

// show specific campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err || !campground) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: campground}); 
        }
    });
});

// helper to handle fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;