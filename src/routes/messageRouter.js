const express = require("express");
const { getVerifyWebhook, postWebhook, getMessage } = require("../controller/messageController");
const messageRouter = express.Router();

messageRouter.get('/', getMessage);
messageRouter.get('/webhook', getVerifyWebhook);
messageRouter.post('/webhook', postWebhook);

module.exports = messageRouter;