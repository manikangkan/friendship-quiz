const port = 3001;
const moment = require('moment');

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
	res.render('home');
});

app.get('/start', (req, res) => {
	res.render('start');
});

app.get('/usrlogin', (req, res) => {
	res.render('usrlogin');
});

app.post('/usrlogin', (req, res) => {
	let { username, gender } = req.body;
	username = username.toLowerCase();
	res.redirect(`/${username}/make?gender=${gender}`);
});

app.get('/:id/make', (req, res) => {
	const { id: username } = req.params;
	const { gender } = req.query;
	const date = moment(new Date()).format('YYYY-MM-DD');
	res.render('make', { username, gender, date });
});

app.post('/make', async (req, res) => {
	const body = req.body;
	const username = body.username;
	console.log(body);

	const filter = { username };
	const update = body;

	let doc = await User.findOneAndUpdate(filter, update, {
		new: true,
		upsert: true,
	})
		.then(() => console.log('successfully Uploaded User QuestionSet'))
		.catch((e) => console.log(e));

	res.send({
		message: 'we received your cooked questions',
		redirect: `/${username}/make/share`,
	});
});

app.get('/:id/make/share', (req, res) => {
	const { id } = req.params;
	// res.send(req.path);
	res.render('share', { id });
});

app.get('/:id/validate', async (req, res) => {
	const { id } = req.params;
	const temp = await User.findOne({ username: id });
	if (temp == null) res.send({ userExists: false });
	else res.send({ userExists: true, redirect: `/${id}/play` });
});

app.get('/:id/play', async (req, res) => {
	const { id } = req.params;
	const temp = await User.findOne({ username: id });
	if (temp == null) res.render('expired', { id });
	else res.render('play', { id });
});

app.post('/:id/play', async (req, res) => {
	const { id } = req.params;
	console.log('found the user from the DB');

	const usr = await User.findOne({ username: id });

	const { clientName } = req.body;
	res.render('playscr', { quesArr: usr.cookedQs, clientName, id });
});

app.post('/:id/playscr', async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	const { clientName, score } = body;
	console.log('received answersheet');

	const filter = { clientName: body.clientName };
	const update = body;

	let doc = await Client.findOneAndUpdate(filter, update, {
		new: true,
		upsert: true,
	})
		.then(() => console.log('successfully saved'))
		.catch((e) => console.log(e));
	res.send({
		message: 'we received your response',
		redirect: `/${id}/score?clientName=${clientName}&scr=${score}`,
	});
});

app.get('/:id/score', (req, res) => {
	const { id } = req.params;
	const { clientName } = req.query;
	const { scr: score } = req.query;
	res.render('scoreDisp', {
		userName: id,
		clientName,
		score: score,
	});
});

app.get('/:id/scoresheet', async (req, res) => {
	const { id } = req.params;
	const { clientName } = req.query;

	const client = await Client.findOne({ clientName }, (err, obj) => {
		if (err) throw err;
		// else
		//     console.log(obj);
	})
		.clone()
		.catch((err) => console.log(err));

	const user = await User.findOne({ username: id }, (err, obj) => {
		if (err) throw err;
		// else
		//     console.log(obj);
	})
		.clone()
		.catch((err) => console.log(err));

	res.render('scoreSheet', {
		userName: id,
		clientName,
		quesSheet_objs_arr: user.cookedQs,
		answerSheet: client.answerSheet,
		score: client.score,
	});
});

app.get('/:id/leaderboard', (req, res) => {
	res.render('allClientResponses');
});

app.get('/dev-info', (req, res) => {
	res.render('dev-info');
});

app.get('/instructions', (req, res) => {
	res.render('instructions');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
