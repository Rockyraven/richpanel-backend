const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const messageRouter = require('./routes/messageRouter');
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use('/', messageRouter);

app.get("/", (req, res) => {
  res.send("hello world")
})


console.log(process.env.PORT)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
