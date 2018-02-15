var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

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
    var newUser = new User({username: req.body.username});
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

module.exports = router;