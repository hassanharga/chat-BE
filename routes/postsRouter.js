let express = require("express");
let router = express.Router();

let postCtrl = require('../controllers/posts');
let AuthHelper = require('../Helpers/authHelper');


router.post('/posts/add-post', AuthHelper.authenticate, postCtrl.addPost);

module.exports = router;