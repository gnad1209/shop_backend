const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    message: {
        type: String,
    }
});


const Message = mongoose.model("Message", messagesSchema);


module.exports = Message;