let mongoose = require("mongoose");

let conversationSchema = mongoose.Schema({
    participants: [
        {
            senderId: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
            receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "users"}
        }
    ]
});

module.exports = mongoose.model("conversation",conversationSchema);