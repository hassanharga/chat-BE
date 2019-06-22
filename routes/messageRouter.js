let express = require('express');
let router = express.Router();
let messageCtrl = require("../controllers/message");
let AuthHelper = require('../Helpers/authHelper');

router.get('/chat-message/:sender_Id/:receiver_Id', AuthHelper.authenticate, messageCtrl.getAllMessages);
router.get('/receiver-messages/:sender/:receiver', AuthHelper.authenticate, messageCtrl.markReceiverMessages);
router.get('/mark-all-messages/', AuthHelper.authenticate, messageCtrl.markAllMessages);
router.post('/chat-message/:sender_Id/:receiver_Id', AuthHelper.authenticate, messageCtrl.sengMessage);

module.exports = router;
