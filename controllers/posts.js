let Joi = require("joi");
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
            const posts = await postSchema.find()
                .populate('user')
                .sort({ created: -1 }); //{ user: req.user._id }
            const topPosts = await postSchema.find({ totalLikes: { $gte: 2 } })
                .populate('user')
                .sort({ created: -1 });
            // console.log(posts);
            return res.status(httpStatus.OK).json({ message: 'all posts', posts, topPosts });
        } catch (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Fetching Posts' });
        }
    },

    async addLike(req, res) {
        const postId = req.body._id;
        await postSchema.update(
            {
                _id: postId,
                'likes.username': { $ne: req.user.username }
            },
            {
                $push: {
                    likes: {
                        username: req.user.username
                    }
                },
                $inc: {
                    totalLikes: 1
                }
            }
        )
            .then(() => {
                res.status(httpStatus.OK).json({ message: 'you liked the post' });
            })
            .catch(err => {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Adding Like To The Post' });
            });
    },

    async addComment(req, res) {
        // console.log(req.body);
        const postId = req.body.postId;
        await postSchema.update(
            {
                _id: postId
            },
            {
                $push: {
                    comments: {
                        userId: req.user._id,
                        username: req.user.username,
                        comment: req.body.comment,
                        createdAt: new Date()
                    }
                }
            }
        )
            .then(() => {
                res.status(httpStatus.OK).json({ message: 'you commented on the post' });
            })
            .catch(err => {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Adding comment To The Post' });
            });
    },

    async getPost(req, res) {
        await postSchema.findOne({ _id: req.params.id })
            .populate('user')
            .populate('comments.userId')
            .then(post => {
                res.status(httpStatus.OK).json({ message: 'post found', post });
            })
            .catch(err => {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'post not found' });
            });
    }
}