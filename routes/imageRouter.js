let express = require('express');
let router = express.Router();
let imageCtrl = require("../controllers/images");
let AuthHelper = require('../Helpers/authHelper');

router.post('/upload-image', AuthHelper.authenticate, imageCtrl.uploadImage);
router.get('/set-default/:imgVersion/:imgId', AuthHelper.authenticate, imageCtrl.setDefaultImage);

module.exports = router;
