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

function push_to_db(usr) {
    if (userMap.has(usr)) {
        User.findOne({ username: usr }).then(data =>{
            console.log(data);
            if(data == null){
                const newUser = new User({
                    username: usr,
                    cookedQs: userMap.get(usr),
                });
    
                var newRoomId = "";
    
                newUser.save()
                .then(()=>console.log("successfully saved"))
                .catch((e)=>console.log(e));
                
                // .then(()=>console.log('suyccef'))
                // .catch(err=>console.log(err));
                
                console.log(newUser);
                return newRoomId;
            }
               
        }).catch((e)=>console.log(e));
        const { _id } =  User.findOne({ username: usr });
        if (_id != null) {
            
            console.log('sorry account exists already try another name');
            return 0;
        } 
        else {
            
        }
    }
    

    return 0;
}

//routing part

const express = require('express');
const app = express();
const path = require('path');
const port = 3000 || 3001;

//all static work
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
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

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, gender } = req.body;

    userMap.set(username, {});
    console.log(req.body);
    console.log(userMap);
    console.log(userMap);
    res.render('selectQuestions', { questions, answers, username, gender });
});

app.post('/cooked', async (req, res) => {
    const body = req.body;
    const username = body.username.valueOf();
    const cookedQs = body.allCookedQuesitons.valueOf();

    const user = await User.findOne({username});
    console.log(user);
    const newUser = new User({
        username,
        cookedQs: userMap.get(username),
    });

    newUser.save()
                .then(()=>console.log("successfully saved"))
                .catch((e)=>console.log(e));
    // if(_id == null){
    //     async
    //     console.log("success account does not exist");
    //     const newUser = new User({username,cookedQs});
    //     await newUser.save();
    // }
    // else console.log("sorry account exists please try another name")


    // console.log(cookedQs, username);
    userMap.set(username, cookedQs);
    console.log('received ques set');
    console.log(userMap);
    const pushStatus =  push_to_db(username);
    console.log("pushstatus" + pushStatus);
    res.send('received the quesitons');
});

app.get('/:id/cooked/share', (req, res) => {
    const { id } = req.params;
    // res.send(req.path);
    res.render('share', { id });
});

app.get('/play', (req, res) => {
    res.send('enter playing link or code');
    // res.render('play', {questions,answers});
});

app.get('/:id/play', async (req, res) => {
    const { id } = req.params;
    // console.log('found the set of questions');
    // console.log(userMap.get(id));
    // res.send('username is ' + id);
    // res.render('play',userMap.get(id));
    const user = await User.findById(id);
    res.render('play', { id });
});

app.post('/:id/play', (req, res) => {
    const { id } = req.params;
    console.log('found the set of questions');
    console.log(userMap.get(id));
    const { clientName } = req.body;
    console.log(req.body);
    res.render('playscreen', { quesArr: userMap.get(id), clientName, id });
});

app.post('/:id/playscreen', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    // answersheetMap.set(username,cookedQs);

    console.log('received answersheet');
    //  console.log(body);
    answerMap.set(body.clientName, body);
    console.log(answerMap);
    res.send({ message: 'we received your response' });
});

app.get('/:id/score', (req, res) => {
    const { id } = req.params;
    const { clientName } = req.query;
    console.log(clientName);
    console.log(answerMap.get(clientName).username);
    const username = answerMap.get(clientName).username;
    console.log(userMap.get(username));
    console.log(answerMap.get(clientName));
    res.render('scoreSheet', {
        userName: id,
        clientName,
        quesSheet_objs_arr: userMap.get(username),
        answerSheet: answerMap.get(clientName).answerSheet,
        score: answerMap.get(clientName).score,
    });
});

app.post('/play', (req, res) => {
    const { score } = req.body;
    res.render('scoreDisp', { score });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
