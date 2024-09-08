const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true,
        trim: true
    },
    image:{
        type:String
    } ,
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    } ,
    user:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User"
    }
});

module.exports =  mongoose.model('Post', postSchema);
