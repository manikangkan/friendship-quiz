const port = 3000;


const questions = [
    'favourite color',
    'favourite animal as pet',
    'favourite smartphone brand',
    'favourite season',
    'favourite TV serial',
    'my most delicious food',
    'tea or coffee?',
];

const answers = [
    ['orange', 'pink', 'yellow', 'blue'],
    ['cat', 'rat', 'bat', 'ant'],
    ['chinese', 'samsung', 'iPhone', 'oneplus'],
    ['spring', 'summer', 'winter', 'autumn'],
    ['Crime Patrol', 'CID', 'Cartoon', 'Saas Bahu Beti'],
    ['Aloo paratha', 'South Indian', 'Pizza', 'Chinese'],
    ['Bolo Zuba Kesari', 'cappuchino', 'BRU Gold', 'Taj Mahal'],
];

const userMap = new Map();
const answerMap = new Map();

// -----------------------------set a sample QUestionSheet
userMap.set('abhisek', [
    {
        question: 'test 1',
        option_a: '1redA',
        option_b: '1pinkB',
        option_c: '1blueC',
        option_d: '1orangeD',
        correctAns: 'option_b',
    },
    {
        question: 'test 2',
        option_a: '2redA',
        option_b: '2pinkB',
        option_c: '2blueC',
        option_d: '2orangeD',
        correctAns: 'option_a',
    },
    {
        question: 'test_3',
        option_a: '3redA',
        option_b: '3pinkB',
        option_c: '3blueC',
        option_d: '3orangeD',
        correctAns: 'option_b',
    },
    {
        question: 'test_4',
        option_a: '4redA',
        option_b: '4pinkB',
        option_c: '4blueC',
        option_d: '4orangeD',
        correctAns: 'option_a',
    },
    {
        question: 'test_5',
        option_a: '5redA',
        option_b: '5pinkB',
        option_c: '5blueC',
        option_d: '5orangeD',
        correctAns: 'option_b',
    },
]);

//--------------------------set a sample ANSWERSHEET
answerMap.set('roku', {
    answerSheet: {
        0: 'option_c',
        1: 'option_a',
        2: 'option_c',
        3: 'option_a',
        4: 'option_b',
    },
    clientName: 'roku',
    username: 'abhisek',
    score: 4,
});
// -----------------------------------------------------

// DB PART
require('./db/connect');
const User = require('./models/user');
const Client = require('./models/client');

//routing part

const express = require('express');
const app = express();
const path = require('path');


//all static work
app.use(express.static('public'));
// app.use('/css', express.static(__dirname + '/public/css'));
app.use(express.static('public/css'));
app.use(express.static('public/wow'));
app.use(express.static('public/assets'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/img', express.static(__dirname + '/public/img'));

//ejs and REST part
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//url handler

app.get('', (req, res) => {
    res.render('index');
});

app.get('/new_client_or_user', (req, res) => {
    res.render('new_client_or_user');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, gender } = req.body;
    userMap.set(username, 'empty_ques_set');
    res.render('selectQuestions', { questions, answers, username, gender });
});

app.post('/cooked', async (req, res) => {
    const body = req.body;
    const username = body.username.valueOf();
    const cookedQs = body.allCookedQuesitons.valueOf();
    userMap.set(username, cookedQs);
    // console.log(userMap);

    const filter = { username};
    const update = {username, cookedQs : userMap.get(username)};

    let doc = await User.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
    })
        .then(() => console.log('successfully Uploaded User QuestionSet'))
        .catch((e) => console.log(e));


    res.send('received the quesitons');
});

app.get('/:id/cooked/share', (req, res) => {
    const { id } = req.params;
    // res.send(req.path);
    res.render('share', { id });
});



app.get('/:id/play', (req, res) => {
    const { id } = req.params;
    res.render('play', { id });
});

app.post('/:id/play', async (req, res) => {
    const { id } = req.params;
    console.log('found the user from the DB');

    //-----------------------> begin updating the usermap
    const temp = await User.findOne({ username: id });
    userMap.set(id, temp.cookedQs);
    //-----------------------> end updating usermap

    // console.log('found the set of questions');
    // console.log(userMap.get(id));
    const { clientName } = req.body;
    res.render('playscreen', { quesArr: userMap.get(id), clientName, id });
});

app.post('/:id/playscreen', async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    console.log('received answersheet');
    answerMap.set(body.clientName, body);

    const filter = { clientName: body.clientName };
    const update = answerMap.get(body.clientName);

    let doc = await Client.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
    })
        .then(() => console.log('successfully saved'))
        .catch((e) => console.log(e));
    res.send({ message: 'we received your response' });
});

app.get('/:id/score', (req, res) => {
    const { id } = req.params;
    const { clientName } = req.query;
    const username = answerMap.get(clientName).username;
    res.render('scoreDisp', {
        userName: id,
        clientName,
        score: answerMap.get(clientName).score,
    });
});



app.get('/:id/scoresheet', (req, res) => {
    const { id } = req.params;
    const { clientName } = req.query;
    const username = answerMap.get(clientName).username;
    res.render('scoreSheet', {
        userName: id,
        clientName,
        quesSheet_objs_arr: userMap.get(username),
        answerSheet: answerMap.get(clientName).answerSheet,
        score: answerMap.get(clientName).score,
    });
});



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
