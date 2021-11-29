const port = 3000;
const moment = require("moment");
console.log();

const questions = [
  "favourite color",
  "favourite animal as pet",
  "favourite smartphone brand",
  "favourite season",
  "favourite TV serial",
  "my most delicious food",
  "tea or coffee?",
];

const answers = [
  ["orange", "pink", "yellow", "blue"],
  ["cat", "rat", "bat", "ant"],
  ["chinese", "samsung", "iPhone", "oneplus"],
  ["spring", "summer", "winter", "autumn"],
  ["Crime Patrol", "CID", "Cartoon", "Saas Bahu Beti"],
  ["Aloo paratha", "South Indian", "Pizza", "Chinese"],
  ["Bolo Zuba Kesari", "cappuchino", "BRU Gold", "Taj Mahal"],
];

const userMap = new Map();
const answerMap = new Map();

// -----------------------------set a sample QUestionSheet
userMap.set("abhisek", [
  {
    question: "test 1",
    option_a: "1redA",
    option_b: "1pinkB",
    option_c: "1blueC",
    option_d: "1orangeD",
    correctAns: "option_b",
  },
  {
    question: "test 2",
    option_a: "2redA",
    option_b: "2pinkB",
    option_c: "2blueC",
    option_d: "2orangeD",
    correctAns: "option_a",
  },
  {
    question: "test_3",
    option_a: "3redA",
    option_b: "3pinkB",
    option_c: "3blueC",
    option_d: "3orangeD",
    correctAns: "option_b",
  },
  {
    question: "test_4",
    option_a: "4redA",
    option_b: "4pinkB",
    option_c: "4blueC",
    option_d: "4orangeD",
    correctAns: "option_a",
  },
  {
    question: "test_5",
    option_a: "5redA",
    option_b: "5pinkB",
    option_c: "5blueC",
    option_d: "5orangeD",
    correctAns: "option_b",
  },
]);

//--------------------------set a sample ANSWERSHEET
answerMap.set("roku", {
  answerSheet: {
    0: "option_c",
    1: "option_a",
    2: "option_c",
    3: "option_a",
    4: "option_b",
  },
  clientName: "roku",
  username: "abhisek",
  score: 4,
});
// -----------------------------------------------------

// DB PART
require("./db/connect");
const User = require("./models/user");
const Client = require("./models/client");

//routing part

const express = require("express");
const app = express();
const path = require("path");

//all static work
app.use(express.static("public"));
// app.use('/css', express.static(__dirname + '/public/css'));
app.use(express.static("public/css"));
app.use(express.static("public/wow"));
app.use(express.static("public/assets"));
app.use("/scripts", express.static(__dirname + "/public/scripts"));
app.use("/img", express.static(__dirname + "/public/img"));

//ejs and REST part
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//url handler

app.get("", (req, res) => {
  res.render("index");
});

app.get("/new_client_or_user", (req, res) => {
  res.render("new_client_or_user");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let { username, gender } = req.body;
  username = username.toLowerCase();
  res.redirect(`/${username}/cook?gender=${gender}`);
});

app.get("/:id/cook", (req, res) => {
  const { id: username } = req.params;
  const { gender } = req.query;
  const date = moment(new Date()).format("YYYY-MM-DD");
  res.render("cook", { username, gender, date });
});

app.post("/cooked", async (req, res) => {
  const body = req.body;
  const username = body.username;
  console.log(body);

  const filter = { username };
  const update = body;

  let doc = await User.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
  })
    .then(() => console.log("successfully Uploaded User QuestionSet"))
    .catch((e) => console.log(e));

  res.send({
    message: "we received your cooked questions",
    redirect: `/${username}/cooked/share`,
  });
});

app.get("/:id/cooked/share", (req, res) => {
  const { id } = req.params;
  // res.send(req.path);
  res.render("share", { id });
});

app.get("/:id/validate", async (req, res) => {
  const { id } = req.params;
  const temp = await User.findOne({ username: id });
  if (temp == null) res.send({ userExists: false });
  else res.send({ userExists: true, redirect: `/${id}/play` });
});

app.get("/:id/play", (req, res) => {
  const { id } = req.params;
  res.render("play", { id });
});

app.post("/:id/play", async (req, res) => {
  const { id } = req.params;
  console.log("found the user from the DB");

  //-----------------------> begin updating the usermap
  const temp = await User.findOne({ username: id });
  userMap.set(id, temp.cookedQs);
  //-----------------------> end updating usermap

  const { clientName } = req.body;
  res.render("playscreen", { quesArr: temp.cookedQs, clientName, id });
});

app.post("/:id/playscreen", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { clientName, score } = body;
  console.log("received answersheet");

  const filter = { clientName: body.clientName };
  const update = body;

  let doc = await Client.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
  })
    .then(() => console.log("successfully saved"))
    .catch((e) => console.log(e));
  res.send({
    message: "we received your response",
    redirect: `/${id}/score?clientName=${clientName}&scr=${score}`,
  });
});

app.get("/:id/score", (req, res) => {
  const { id } = req.params;
  const { clientName } = req.query;
  const { scr: score } = req.query;
  res.render("scoreDisp", {
    userName: id,
    clientName,
    score: score,
  });
});

app.get("/:id/scoresheet", async (req, res) => {
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

  res.render("scoreSheet", {
    userName: id,
    clientName,
    quesSheet_objs_arr: user.cookedQs,
    answerSheet: client.answerSheet,
    score: client.score,
  });
});

app.get("/:id/leaderboard", (req, res) => {
  res.render("allClientResponses");
});

app.get("/dev-info", (req, res) => {
  res.render("dev-info");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
