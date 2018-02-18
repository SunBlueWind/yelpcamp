var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    email: String,
    avatar: { type: String, default: "https://pixabay.com/en/photos/avatar/" },
    joinedAt: { type: Date, default: Date.now }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);