let User = require('../models/userModel');

let httpStatus = require('http-status-codes');

module.exports = {
    followUser(req, res) {
        let followUser = async () => {
            await User.update(
                {
                    _id: req.user._id,
                    'following.userFollowed': { $ne: req.body.userFollowed }
                },
                {
                    $push:
                    {
                        following: {
                            userFollowed: req.body.userFollowed
                        }
                    }
                }
            )

            await User.update(
                {
                    _id: req.body.userFollowed,
                    'followers.follower': { $ne: req.user._id }
                },
                {
                    $push:
                    {
                        followers: {
                            follower: req.user._id
                        },
                        notifications: {
                            senderId: req.user._id,
                            message: `${req.user.username} is now following you`,
                            created: new Date()
                        }
                    }
                }
            )
        };
        followUser().then(() => {
            res.status(httpStatus.OK).json({ message: 'follownig user now' });
        }
        ).catch(() => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error follownig user' });
        });
    },

    unfollowUser(req, res) {
        // console.log(req.body);
        let unfollowUser = async () => {
            await User.update(
                {
                    _id: req.user._id,
                },
                {
                    $pull:
                    {
                        following: {
                            userFollowed: req.body.userFollowed
                        }
                    }
                }
            )

            await User.update(
                {
                    _id: req.body.userFollowed,
                },
                {
                    $pull:
                    {
                        followers: {
                            follower: req.user._id
                        }
                    }
                }
            )
        };
        unfollowUser().then(() => {
            res.status(httpStatus.OK).json({ message: 'unfollownig user now' });
        }
        ).catch(() => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error unfollownig user' });
        });
    },

    async markNotification(req,res) {
        console.log(req.body);
        if(!req.body.deletedValue) {
            await User.updateOne(
                {
                    _id: req.user._id,
                    'notifications._id': req.body.id
                },
                {
                    $set: {
                        'notifications.$.read': true
                    }
                }
                ).then(()=> {
                     res.status(httpStatus.OK).json({ message: 'notification marked as read' });
                }).catch(()=>{
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error marking notification' });
                })
        } else {
            await User.updateOne(
                {
                    _id: req.user._id,
                    'notifications._id': req.body.id
                },
                {
                    $pull: {
                        notifications: {_id: req.body.id}
                    }
                }
            )
            .then(()=> {
                res.status(httpStatus.OK).json({ message: 'notification Deleted' });
           }).catch(()=>{
               res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error marking notification' });
           })
        }
    },

    async markAllNotification(req,res) {
        await User.update(
            {
                _id: req.user._id,
            },
            {
                $set: {
                    'notifications.$[elem].read': true
                }
            },
            {arrayFilters: [{'elem.read': false}], multi: true}
            ).then(()=> {
                 res.status(httpStatus.OK).json({ message: 'all notifications marked as read' });
            }).catch(()=>{
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error marking notifications' });
            })
    }
}