let mongoose = require("mongoose");
userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  posts: [
    {
      postId: {type: mongoose.Schema.Types.ObjectId, ref : 'posts'},
    }
  ]
});
 module.exports=mongoose.model("users",userSchema);