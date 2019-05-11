let express = require('express');
let router = express.Router();
let friendCtrl = require("../controllers/friends");
let AuthHelper = require('../Helpers/authHelper');

router.post('/follow-user', AuthHelper.authenticate, friendCtrl.followUser);
router.post('/unfollow-user', AuthHelper.authenticate, friendCtrl.unfollowUser);
router.post('/mark', AuthHelper.authenticate, friendCtrl.markNotification);
router.post('/mark-all', AuthHelper.authenticate, friendCtrl.markAllNotification);


module.exports = router;
