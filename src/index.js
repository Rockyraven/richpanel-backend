const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const messageRouter = require('./routes/messageRouter');
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use('/', messageRouter);

app.get("/", (req, res) => {
  res.send("hello world")
})


console.log(process.env.PORT, "with port number working")

mongoose
  .connect(
   process.env.MONGO_URL
  )
  .then(() => {
    console.log("database connected ");
  })
  .catch((error) => {
    console.log(error);
  });



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
