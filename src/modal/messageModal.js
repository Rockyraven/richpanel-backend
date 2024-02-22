const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    }
    
}, {timestamps: true}) 

module.exports = mongoose.model("Message", MessageSchema)