let express = require('express');
let router = express.Router();
let userCtrl = require("../controllers/users");
let AuthHelper = require('../Helpers/authHelper');

router.get('/users', AuthHelper.authenticate, userCtrl.getAllUsers);
router.get('/user/:id', AuthHelper.authenticate, userCtrl.getByUserId);
router.get('/username/:username', AuthHelper.authenticate, userCtrl.getByUsername);
router.post('/user/view-profile', AuthHelper.authenticate, userCtrl.profileView);


module.exports = router;
