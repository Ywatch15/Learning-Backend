const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/dbtest'); // do not use the backticks just use the normal quotes

const userSchema = mongoose.Schema({
    // username: String, this way and the below way both are same
    username : {
        type:String
    },
    email : String,
    age: Number,
    //here we used the same declaration method using type
    posts: [ // it is an array of ObjectId references to the post model
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post' 
    }]
})

module.exports = mongoose.model('user', userSchema);