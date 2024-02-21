require("dotenv").config();

const getMessage = (req, res) => {
    res.send("working fine");
}

const getVerifyWebhook = (req, res) => {
    let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
    console.log(VERIFY_TOKEN)
	console.log(VERIFY_TOKEN);
	let mode = req.query["hub.mode"];
	let token = req.query["hub.verify_token"];
	let challenge = req.query["hub.challenge"];
	console.log("verifuy" , mode, token);
	if (mode && token) {
		if (mode === "subscribe" && token === VERIFY_TOKEN) {
			console.log("WEBHOOK_VERIFIED");
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
}
const postWebhook = (req, res) => {
    res.send("working getVerifyWebhook fine");
}


// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}


module.exports = {getMessage, getVerifyWebhook, postWebhook};

// curl -X GET "localhost:5000/webhook?hub.verify_token=ItIsRandomVariable&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"