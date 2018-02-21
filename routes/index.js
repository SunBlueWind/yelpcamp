var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// sign up page
router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    if (req.body.password !== req.body.passwordConfirm) {
        return res.render("register", {error: "Passwords Do Not Match"});
    }
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar
    });
    // set default avatar
    if (req.body.avatar === "") {
        newUser.avatar = "http://cdn.onlinewebfonts.com/svg/img_181369.png";
    }
    if (req.body.adminCode === process.env.ADMINCODE) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up. Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// login page
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Welcome Back",
    failureFlash: "Failed to Login"
}));

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully Logged Out");
    res.redirect("/campgrounds");
});

// user profile route
router.get("/user/:id", function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err || !user) {
            req.flash("error", "Cannot Find This User");
            res.redirect("back");
        } else {
            Campground.find().where("author.id").equals(user.id).exec(function(err, campgrounds) {
                if (err) {
                    req.flash("error", "Cannot Find This User's Campgrounds");
                }
                res.render("user/show", {user: user, campgrounds: campgrounds});
            });
        }
    });
});

router.get("/user/:id/edit", middleware.checkUser, function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err || !user) {
            req.flash("error", "Something Went Wrong");
            res.redirect("back");
        } else {
            res.render("user/edit", {user: user});
        }
    })
});

// update user profile
router.put("/user/:id", middleware.checkUser, function(req, res) {
    if (req.body.password !== req.body.passwordConfirm) {
        req.flash("error", "Passwords Do Not Match");
        return res.redirect("back");
    }
    User.findById(req.params.id, function(err, user) {
        if (err || !user) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        } else {
            user.email = req.body.email;
            
            if (req.body.avatar === "") {
                user.avatar = "http://cdn.onlinewebfonts.com/svg/img_181369.png";
            } else {
                user.avatar = req.body.avatar;
            }
            
            if (req.body.adminCode === process.env.ADMINCODE) {
                user.isAdmin = true;
            } else {
                user.isAdmin = false;
            }
            
            user.setPassword(req.body.password, function(err, user) {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("/campgrounds");
                } else {
                    user.save(function(err) {
                        if (err) {
                            req.flash("error", err.message);
                            res.redirect("/campgrounds");
                        } else {
                            res.redirect("/user/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;