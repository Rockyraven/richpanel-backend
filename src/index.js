const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const messageRouter = require("./routes/messageRouter");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
var cors = require('cors')
const messageModel = require("./modal/messageModal");
require("dotenv").config();
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(cors())

app.use(bodyParser.json());
app.use("/", messageRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

console.log(process.env.PORT, "with port number working");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("database connected ");
  })
  .catch((error) => {
    console.log(error);
  });

io.on("connection", (socket) => {
  console.log("A client connected");

  // Send messages to client whenever there's a new message
  socket.on("newMessage", async () => {
    try {
      const messages = await messageModel.find(); // Fetch messages from the database
      io.emit("messages", messages); // Emit messages to all connected clients
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});