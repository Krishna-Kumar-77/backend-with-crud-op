const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Please Enter Your Name']
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"]
    }
},
    {
        timestamps: true
    })

const User = mongoose.model('User', userSchema);
module.exports = User;