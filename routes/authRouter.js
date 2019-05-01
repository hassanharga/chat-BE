let express = require("express");
let router = express.Router();

let authCtrl = require('../controllers/auth');

router.post('/register', authCtrl.createUser);
router.post('/login', authCtrl.loginUser);

module.exports = router;