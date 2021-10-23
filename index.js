const questions = [
    "favourite color",
    "favourite animal as pet",
    "favourite gadget",
    "favourite season",
    "favourite TV serial",
    "my most delicious food",
    "tea or coffee?"
];

const answers = [
    "0b",
    "1a",
    "2b",
    "3a",
    "4b",
    "5a",
    "6b",
];

let cookedQs;

const userMap = new Map();

// -----------------------------set a sample data
userMap.set('abhisek', [
    {
      question: 'favourite color of my painting book',
      option_a: 'red',
      option_b: 'pink',
      option_c: 'blue',
      option_d: 'orange',
      correctAns: 'option_a'
    }
  ]);
// -----------------------------------------------------




const { map } = require('async');
//routing part

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;


//all static work
app.use(express.static('public'))
app.use('/css',express.static(__dirname + '/public/css'));
app.use('/scripts',express.static(__dirname + '/public/scripts'));
app.use('/img',express.static(__dirname + '/public/img'));


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

app.post('/login',(req,res)=>{
    const {username, gender} = req.body;

    userMap.set(username,{});
    console.log(req.body);
    console.log(userMap);
    userMap.set(username,"2424");
    console.log(userMap);
    res.render('selectQuestions', {questions,answers, username, gender});
})

app.post('/cooked',(req,res)=>{
    const body =req.body;
    const username = body.username.valueOf();
    cookedQs = body.allCookedQuesitons.valueOf();
    // console.log(cookedQs, username);
    userMap.set(username,cookedQs);
    console.log(userMap);
    res.send('received the quesitons');
})

app.get('/play', (req, res) => {
    res.send('enter playing link or code');
    // res.render('play', {questions,answers});
});

app.get('/:id/play',(req,res)=>{
    const {id} = req.params;
    // console.log('found the set of questions');
    // console.log(userMap.get(id));
    // res.send('username is ' + id);
    // res.render('play',userMap.get(id));
    res.render('play',{id})

})

app.post('/:id/play',(req,res)=>{
    const {id} = req.params;
    console.log('found the set of questions');
    console.log(userMap.get(id));
    const {clientName} = req.body;
    console.log(req.body);
    res.render('playscreen',{quesArr: userMap.get(id), clientName, id})
})

app.post('/play',(req,res)=>{
    const {score} = req.body;
    res.render('scoreDisp',{score});
})






app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
