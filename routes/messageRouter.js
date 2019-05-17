let express = require('express');
let router = express.Router();
let messageCtrl = require("../controllers/message");
let AuthHelper = require('../Helpers/authHelper');

router.post('/chat-message/:sender_Id/:receiver_Id', AuthHelper.authenticate, messageCtrl.sengMessage);

module.exports = router;
