let mongoose = require("mongoose");
userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String }
});
 module.exports=mongoose.model("users",userSchema);