const mongoose = require('mongoose');

// only 5 questions per quiz for now

const quizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [String],
    correctAns : Number
        
}, { collection: 'quizzes' });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
