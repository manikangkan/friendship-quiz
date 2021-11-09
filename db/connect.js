const mongoose = require("mongoose");

const ACCOUNT_NAME = "kal"; //PUT MONGODB USERNAME HERE
const PASS = "lalu"; //PUT MONGODB PASSWORD HERE

const uri1 = `mongodb+srv://${ACCOUNT_NAME}:${PASS}@cluster0.p7xal.mongodb.net/quizdb?retryWrites=true&w=majority`;

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
