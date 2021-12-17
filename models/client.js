const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: false,
    },
    answerSheet: {
        '0' : String,
        '1' : String,
        '2' : String,
        '3' : String,
        '4' : String,
        '5' : String,
        '6' : String,
        '7' : String,
        '8' : String,
        '9' : String,
        '10' : String,
        '11' : String,
        '12' : String,
        '13' : String,
        '14' : String,
        '15' : String,
        
    },
    score: Number,
    max: Number,
    date: Date,
    avatarCode: String,
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
