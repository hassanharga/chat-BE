let Message = require('../models/messageModel');
let Conversation = require('../models/conversationModel');
let User = require('../models/userModel');

let httpStatus = require('http-status-codes');


module.exports = {
    async getAllMessages(req, res) {
        const { sender_Id, receiver_Id } = req.params;
        // console.log(sender_Id, receiver_Id);
        const conversation = await Conversation.findOne({
            $or: [
                {
                    $and: [{'participants.senderId': sender_Id},{'participants.receiverId': receiver_Id}]
                },
                {
                    $and: [{'participants.senderId': receiver_Id},{'participants.receiverId': sender_Id}]
                },
            ]
        }).select('_id')

        // console.log(conversation);
        if (conversation) {
            const messages = await Message.findOne({conversationId: conversation._id});
            res.status(httpStatus.OK).json({message : 'all messages', messages});
        } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'couldnot get all messages'});
        }
    },
    sengMessage(req, res) {
        // console.log(req.user._id);
        const { sender_Id, receiver_Id } = req.params;
        // console.log(sender_Id, receiver_Id);
        Conversation.find({
            $or: [
                { participants: { $elemMatch: { senderId: sender_Id, receiverId: receiver_Id } } },
                { participants: { $elemMatch: { senderId: receiver_Id, receiverId: sender_Id } } }
            ]
        },
            async (err, result) => {
                if (result.length > 0) {
                    // console.log(result);
                    await Message.update({
                        conversationId: result[0]._id
                    },
                    {
                        $push: {
                            message: {
                                senderId: req.user._id,
                                receiverId: req.params.receiver_Id,
                                senderName: req.user.username,
                                receiverName: req.body.receiverName,
                                body: req.body.message,
                            }
                        }
                    }
                    ).then(() => {
                        res.status(httpStatus.OK).json({ message: 'message sent sucessfully', })
                    })
                    .catch(() => {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'message not sent', })
                    })

                } else {
                    const newConversation = new Conversation();
                    newConversation.participants.push({
                        senderId: req.user._id,
                        receiverId: req.params.receiver_Id
                    })
                    const saveConversation = await newConversation.save();
                    // console.log(saveConversation);
                    const newMessage = new Message();
                    newMessage.conversationId = saveConversation._id;
                    newMessage.sender = req.user.username;
                    newMessage.receiver = req.body.receiverName
                    newMessage.message.push({
                        senderId: req.user._id,
                        receiverId: req.params.receiver_Id,
                        senderName: req.user.username,
                        receiverName: req.body.receiverName,
                        body: req.body.message,
                    });

                    await newMessage.save()
                        .then(() => {
                            res.status(httpStatus.OK).json({ message: 'message sent', })
                        })
                        .catch(() => {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'message not sent', })
                        })

                    await User.update({
                        _id: req.user._id
                    },
                        {
                            $push: {
                                chatList: {
                                    $each: [
                                        {
                                            receiverId: req.params.receiver_Id,
                                            msgId: newMessage._id
                                        }
                                    ],
                                    position: 0
                                }
                            }
                        });

                    await User.update({
                        _id: req.params.receiver_Id
                    },
                        {
                            $push: {
                                chatList: {
                                    $each: [
                                        {
                                            receiverId: req.user._id,
                                            msgId: newMessage._id
                                        }
                                    ],
                                    position: 0
                                }
                            }
                        });
                }
            })
    }
}