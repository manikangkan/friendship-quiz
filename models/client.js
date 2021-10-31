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
        
    },
    score: Number,
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
