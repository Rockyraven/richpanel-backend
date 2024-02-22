require("dotenv").config();
const request = require("request")

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
	let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log("webhook message" ,webhook_event);
            console.log("webhook message" ,webhook_event.message.text);


            // Get the sender PSID
            let sender_psid = webhook_event.sender;
            console.log('Sender PSID: ' + sender_psid.id);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}


// Handles messages events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": { "text": response }
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function firstTrait(nlp, name) {
    return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

function handleMessage(sender_psid, message) {
    //handle message for react, like press like button
    // id like button: sticker_id 369239263222822

    if( message && message.attachments && message.attachments[0].payload){
        callSendAPI(sender_psid, "Thank you for watching my video !!!");
        callSendAPIWithTemplate(sender_psid);
        return;
    }

    let entitiesArr = [ "wit$greetings", "wit$thanks", "wit$bye" ];
    let entityChosen = "";
    entitiesArr.forEach((name) => {
        let entity = firstTrait(message.nlp, name);
        if (entity && entity.confidence > 0.8) {
            entityChosen = name;
        }
    });

    if(entityChosen === ""){
        //default
        callSendAPI(sender_psid,`The bot is needed more trainings rocky, try to say "thanks a lot" or "hi" to the bot` );
    }else{
       if(entityChosen === "wit$greetings"){
           //send greetings message
           callSendAPI(sender_psid,`Hi there! This bot is created by Hary Pham. Watch more videos on HaryPhamDev Channel!`);
       }
       if(entityChosen === "wit$thanks"){
           //send thanks message
           callSendAPI(sender_psid,`You 're welcome!`);
       }
        if(entityChosen === "wit$bye"){
            //send bye message
            callSendAPI(sender_psid,'bye-bye!');
        }
    }
}

let callSendAPIWithTemplate = (sender_psid) => {
    // document fb message template
    // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
    let body = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Want to build sth awesome?",
                            "image_url": "https://www.nexmo.com/wp-content/uploads/2018/10/build-bot-messages-api-768x384.png",
                            "subtitle": "Watch more videos on my youtube channel ^^",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://bit.ly/subscribe-haryphamdev",
                                    "title": "Watch now"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    };

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": body
    }, (err, res, body) => {
        if (!err) {
            // console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

// Sends response messages via the Send API
// function callSendAPI(sender_psid, response) {
  
// }


module.exports = {getMessage, getVerifyWebhook, postWebhook};

// curl -X GET "localhost:5000/webhook?hub.verify_token=ItIsRandomVariable&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"