let express = require("express");
let router = express.Router();

let postCtrl = require('../controllers/posts');
let AuthHelper = require('../Helpers/authHelper');


router.get('/posts', AuthHelper.authenticate, postCtrl.getAllPosts);
router.get('/post/:id', AuthHelper.authenticate, postCtrl.getPost);


router.post('/post/add-post', AuthHelper.authenticate, postCtrl.addPost);
router.post('/post/add-like', AuthHelper.authenticate, postCtrl.addLike);
router.post('/post/add-comment', AuthHelper.authenticate, postCtrl.addComment);

module.exports = router;