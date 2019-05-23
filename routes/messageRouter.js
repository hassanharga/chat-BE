let express = require('express');
let router = express.Router();
let messageCtrl = require("../controllers/message");
let AuthHelper = require('../Helpers/authHelper');

router.get('/chat-message/:sender_Id/:receiver_Id', AuthHelper.authenticate, messageCtrl.getAllMessages);
router.post('/chat-message/:sender_Id/:receiver_Id', AuthHelper.authenticate, messageCtrl.sengMessage);

module.exports = router;
