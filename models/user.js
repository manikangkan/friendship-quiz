const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    cookedQs : {
        type: []
    },
    gender : String,
    date : Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
