const mongoose = require("mongoose");

const ACCOUNT_NAME = "kal"; //PUT MONGODB USERNAME HERE
const PASS = "ram"; //PUT MONGODB PASSWORD HERE
const database_name = "quizdb";

const uri1 = `mongodb+srv://${ACCOUNT_NAME}:${PASS}@cluster0.p7xal.mongodb.net/${database_name}?retryWrites=true&w=majority`;

mongoose
  .connect(uri1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(database_name + " is open!");
  })
  .catch((err) => {
    console.log("ERROR CONNECTING");
    console.log(err);
  });

mongoose
  .connect(uri1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("userDB OPEN!!!");
  })
  .catch((err) => {
    console.log("ERROR CONNECTING");
    console.log(err);
  });
