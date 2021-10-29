const mongoose = require('mongoose');

const uri1 =
    'mongodb+srv://kal:lala@cluster0.p7xal.mongodb.net/quizdb?retryWrites=true&w=majority';

mongoose.connect(uri1, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('userDB OPEN!!!');
    })
    .catch((err) => {
        console.log('ERROR CONNECTING');
        console.log(err);
    });
    
    


