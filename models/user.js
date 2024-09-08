const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost:27017/Pinterest");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,
       trim:true
    },
    dp: {
        type: String, // Assuming the dp is stored as a URL or a path to the image
        default: ''   // Default is an empty string if no dp is provided
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);

