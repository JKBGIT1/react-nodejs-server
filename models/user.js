const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    userName: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
    },
    favoriteRestaurants: {
        type: Array,
        default: null,
    }
});

module.exports = mongoose.model("User", UserSchema);
