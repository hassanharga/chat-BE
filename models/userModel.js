let mongoose = require("mongoose");
userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  posts: [
    {
      postId: {type: mongoose.Schema.Types.ObjectId, ref : 'posts'},
    }
  ],
  following: [
    {userFollowed: {type: mongoose.Schema.Types.ObjectId, ref : 'users'}}
  ],
  followers: [
    {follower: {type: mongoose.Schema.Types.ObjectId, ref : 'users'}}
  ],
  notifications: [
    {
      senderId: {type: mongoose.Schema.Types.ObjectId, ref : 'users'},
      message: {type: String},
      viewProfile: {type: Boolean, default: false},
      created: {type: Date, default: Date.now()},
      read: {type: Boolean, default: false},
      date: {type: String, default: ''}
    }
  ],
  chatList: [
    {
      receiverId: {type: mongoose.Schema.Types.ObjectId, ref : 'users'},
      msgId: {type: mongoose.Schema.Types.ObjectId, ref : 'message'},
    }
  ]
});
 module.exports=mongoose.model("users",userSchema);