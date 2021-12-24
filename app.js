const port = process.env.PORT || 3000;

const moment = require("moment");

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
  res.render("home");
});

app.get("/start", (req, res) => {
  res.render("start");
});

app.get("/usrlogin", (req, res) => {
  res.render("usrlogin");
});

app.post("/usrlogin", (req, res) => {
  let { username, gender, avatarCode } = req.body;
  console.log(avatarCode);
  username = username.toLowerCase();
  res.redirect(`/${username}/make?gender=${gender}&avc=${avatarCode}`);
});

app.get("/:id/make", (req, res) => {
  const { id: username } = req.params;
  const { gender } = req.query;
  const { avc: avatarCode } = req.query;
  const date = moment(new Date()).format("YYYY-MM-DD");
  res.render("make", { username, gender, date, avatarCode });
});

app.post("/make", async (req, res) => {
  const body = req.body;
  const username = body.username;
  const avatarCode = body.avatarCode;
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
    redirect: `/${username}/make/share?avc=${avatarCode}`,
  });
});

app.get("/:id/make/share", (req, res) => {
  const { id } = req.params;
  const { avc } = req.query;
  // res.send(req.path);
  res.render("share", { id, avc });
});

app.get("/:id/validate", async (req, res) => {
  const { id } = req.params;
  const temp = await User.findOne({ username: id });
  if (temp == null) res.send({ userExists: false });
  else
    res.send({
      userExists: true,
      redirect: `/${id}/play`,
      avatarCode: temp.avatarCode,
    });
});

app.get("/:id/play", async (req, res) => {
  const { id } = req.params;
  const temp = await User.findOne({ username: id });
  if (temp == null) res.render("expired", { id });
  else res.render("play", { id, avatarCode: temp.avatarCode, });
});

app.post("/:id/play", async (req, res) => {
  const { id } = req.params;
  console.log("found the user from the DB");

  const usr = await User.findOne({ username: id });

  const { clientName, avatarCode } = req.body;
  res.render("playscr", { quesArr: usr.cookedQs, clientName, id, avatarCode });
});

app.post("/:id/playscr", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { clientName, score, avatarCode, max } = body;
  console.log("received answersheet");
  console.log(body);
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
    redirect: `/${id}/score?clientName=${clientName}&scr=${score}&avc=${avatarCode}&max=${max}`,
  });
});

app.get("/:id/score", (req, res) => {
  const { id } = req.params;
  const { clientName } = req.query;
  const { scr: score } = req.query;
  const { max } = req.query;
  const { avc: avatarCode } = req.query;
  res.render("scoreDisp", {
    userName: id,
    clientName,
    score: score,
    avatarCode,
    max
  });
});

app.get("/:id/response/:clientName", async (req, res) => {
  const { id } = req.params;
  const { clientName } = req.params;

  const client = await Client.findOne({ clientName }, (err, obj) => {
    if (err) throw err;
  })
    .clone()
    .catch((err) => console.log(err));

  const user = await User.findOne({ username: id }, (err, obj) => {
    if (err) throw err;
  })
    .clone()
    .catch((err) => console.log(err));

  res.render("responseDetails", {
    userName: id,
    clientName,
    quesSheet_objs_arr: user.cookedQs,
    answerSheet: client.answerSheet,
    score: client.score,
    gender: user.gender,
    clientAvatarCode: client.avatarCode,
    userAvatarCode: user.avatarCode,
  });
});

app.get("/:username/response/", async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }, (err, obj) => {
    if (err) throw err;
  })
    .clone()
    .catch((err) => console.log(err));

  const clients = await Client.find({ username }, (err, obj) => {
    if (err) throw err;
  })
    .clone()
    .catch((err) => console.log(err));
  console.log([...clients]);

  res.render("response", {
    clients: [...clients],
    clientCount: clients.length,
    username,
    userAvatarCode: user.avatarCode,
  });
});

app.get("/devInfo", (req, res) => {
  res.render("devInfo");
});

app.get("/instructions", (req, res) => {
  res.render("instructions");
});

app.get("/t&c", (req, res) => {
  res.render("t&c");
});

app.get("/404", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
