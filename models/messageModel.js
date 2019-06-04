let mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
   
    conversationId: {type: mongoose.Schema.Types.ObjectId, ref: "conversation"},
    sender: {type: String},
    receiver: {type: String},
    message: [
        {
            senderId: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
            receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
            senderName:{type: String},
            receiverName: {type: String},
            body: {type: String, default: ''},
            isRead : {type: Boolean, default: false},
            creadtedAt: {type:Date, default: Date.now()}
        }
    ]
      
});

module.exports = mongoose.model("message",messageSchema);