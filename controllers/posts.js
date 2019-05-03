let Joi = require("Joi");
let httpStatus = require("http-status-codes");
let postSchema = require('../models/postModel');
let User = require("../models/userModel");

module.exports = {
    addPost(req, res) {
        let schema = Joi.object().keys({  //validating schema
            post: Joi.string().required()
        });
        let { error } = Joi.validate(req.body, schema); // add  schema validation 
        if (error && error.details) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ msg: error.details });
        }
        let body = {
            user: req.user._id,
            username: req.user.username,
            post: req.body.post,
            created: new Date()
        }
        postSchema.create(body).then(async (post) => {
            await User.update(
                {
                    _id: req.user._id
                },
                {
                    $push: {
                        posts: {
                            postId: post._id
                        }
                    }
                }
            );
            return res.status(httpStatus.OK).json({ message: 'Post Created', post });
        }).catch(err => {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Creating Post' });
        });
    },
    async getAllPosts(req, res) {
        try {
            const posts = await postSchema.find({user: req.user._id}).populate('user').sort({ created: -1 });
            // console.log(posts);
            return res.status(httpStatus.OK).json({ message: 'all posts', posts });
        } catch (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Fetching Posts' });
        }
    }
}