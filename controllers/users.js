let User = require('../models/userModel');
let moment = require('moment');
let httpStatus = require('http-status-codes');
let joi = require('joi');
let bcrypt = require('bcryptjs');

module.exports = {
    async getAllUsers(req, res) {
        await User.find({}).populate('posts.postId').populate('following.userFollowed').populate('followers.follower').populate('chatList.receiverId').populate('chatList.msgId').populate('notifications.senderId')
            .then(users => {
                res.status(httpStatus.OK).json({ message: "all users", users });
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error While getting Users", err });
            });
    },

    async getByUserId(req, res) {
        // let id = req.params.id;
        await User.findOne({ _id: req.params.id }).populate('posts.postId').populate('following.userFollowed').populate('followers.follower').populate('chatList.receiverId').populate('chatList.msgId').populate('notifications.senderId')
            .then(user => {
                res.status(httpStatus.OK).json({ message: "user by userId", user });
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error While getting Users", err });
            });
    },

    async getByUsername(req, res) {
        console.log(req.params.username);
        // let username = req.params.username;
        await User.findOne({ username: req.params.username }).populate('posts.postId').populate('following.userFollowed').populate('followers.follower').populate('chatList.receiverId').populate('chatList.msgId').populate('notifications.senderId')
            .then(user => {
                res.status(httpStatus.OK).json({ message: "user by username", user });
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error While getting Users", err });
            });
    },

    async profileView(req, res) {
        const dateValue = moment().format('YYYY-MM-DD');
        await User.update({
            _id: req.body.id,
            'notifications.date': { $ne: dateValue },
            'notifications.senderId': { $ne: req.user._id }
        }, {
                $push: {
                    notifications: {
                        senderId: req.user._id,
                        message: `${req.user.username} viewed your profile`,
                        created: new Date(),
                        date: dateValue,
                        viewProfile: true
                    }
                }
            }).then(user => {
                res.status(httpStatus.OK).json({ message: "notification sent" });
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "notification error"});
            });
        // console.log(req.body);
    },

    async changePassword(req,res) {
        const schema = joi.object().keys({
            cpassword: joi.string().required(),
            newPassword: joi.string().min(5).required(),
            confirmPassword: joi.string().min(5).optional(),
        });
        const {err, value} = joi.validate(req.body, schema);
        if (err && err.details) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: error.details });  
        }
        // console.log(value);
        const user = await User.findOne({_id: req.user._id});
        return bcrypt.compare(value.cpassword, user.password)
            .then(async result => {
                if (!result) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'current password is incorrect' });
                }
                const newpassword = await User.EncrypytPassword(req.body.newPassword);
                await User.update({_id: req.user._id}, {password: newpassword})
                .then(user => {
                    res.status(httpStatus.OK).json({ message: "password Updated" });
                }).catch(err => {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "error updating password"});
                });
                // console.log(newpassword);
                // else {
                //     let token = jwt.sign({ data: user }, config.secret)
                //     res.cookie("token", token);
                //     res.status(httpStatus.OK).json({ message: 'Login sucessful', user, token });
                // }
            })
            .catch(error => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error finding user' });
            })
        // console.log(req.body);
    }

}