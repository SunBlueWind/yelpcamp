var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "CAMP1",
        image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
        description: "Nulla volutpat arcu vel neque dictum pulvinar. Aliquam eget suscipit ante. Sed faucibus eros mi, ac egestas nulla varius a. Aliquam varius purus sit amet odio ullamcorper tempus. Quisque sed quam lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ac eros nec metus efficitur venenatis. Integer sed vehicula quam. Ut rhoncus sed urna vitae congue. Fusce enim nisi, lobortis in placerat eu, convallis sit amet mi. Donec vel nibh diam. Donec pulvinar aliquet nibh, vel varius nibh maximus vitae. Sed volutpat hendrerit elit eget vehicula. Donec dictum eros non nunc congue vestibulum viverra nec ipsum. Maecenas dapibus mi iaculis efficitur sagittis. Donec a nibh scelerisque, vulputate arcu volutpat, finibus risus."
    },
    {
        name: "CAMP2",
        image: "https://farm3.staticflickr.com/2927/14442300701_7952568539.jpg",
        description: "Nulla volutpat arcu vel neque dictum pulvinar. Aliquam eget suscipit ante. Sed faucibus eros mi, ac egestas nulla varius a. Aliquam varius purus sit amet odio ullamcorper tempus. Quisque sed quam lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ac eros nec metus efficitur venenatis. Integer sed vehicula quam. Ut rhoncus sed urna vitae congue. Fusce enim nisi, lobortis in placerat eu, convallis sit amet mi. Donec vel nibh diam. Donec pulvinar aliquet nibh, vel varius nibh maximus vitae. Sed volutpat hendrerit elit eget vehicula. Donec dictum eros non nunc congue vestibulum viverra nec ipsum. Maecenas dapibus mi iaculis efficitur sagittis. Donec a nibh scelerisque, vulputate arcu volutpat, finibus risus."
    },
    {
        name: "CAMP3",
        image: "https://farm4.staticflickr.com/3487/3753652204_a752eb417d.jpg",
        description: "Nulla volutpat arcu vel neque dictum pulvinar. Aliquam eget suscipit ante. Sed faucibus eros mi, ac egestas nulla varius a. Aliquam varius purus sit amet odio ullamcorper tempus. Quisque sed quam lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ac eros nec metus efficitur venenatis. Integer sed vehicula quam. Ut rhoncus sed urna vitae congue. Fusce enim nisi, lobortis in placerat eu, convallis sit amet mi. Donec vel nibh diam. Donec pulvinar aliquet nibh, vel varius nibh maximus vitae. Sed volutpat hendrerit elit eget vehicula. Donec dictum eros non nunc congue vestibulum viverra nec ipsum. Maecenas dapibus mi iaculis efficitur sagittis. Donec a nibh scelerisque, vulputate arcu volutpat, finibus risus."
    }
    ];

function seedDB() {
    // Clear all old data
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("DATA CLEARED");
            // Add in some test data
            data.forEach(function(item) {
                Campground.create(item, function(err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("ADDED NEW CAMPGROUND");
                        // Add in some test comments
                        Comment.create({
                            text: "Donec condimentum purus a rhoncus aliquet. Nullam in faucibus est, eu vulputate nibh. Cras dictum ultricies ipsum, pulvinar aliquet nulla ullamcorper ac. Duis congue volutpat lorem in malesuada. Sed eget mattis sem. Duis vitae nulla fringilla, sollicitudin libero in, dignissim lectus. Integer non mauris ac augue consequat egestas a quis libero. Pellentesque accumsan quis ante vitae blandit. Integer efficitur eros nec finibus convallis. Sed a nulla vel enim aliquam cursus. Nullam a pharetra nisi, eget tempor sapien. Vestibulum at auctor nunc, eget consequat tortor.",
                            author: "Kobe Bryant"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment._id);
                                campground.save();
                                console.log("CREATED NEW COMMENTS")
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;