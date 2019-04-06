let mongoose = require("mongoose");
userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String }
});
 mongoose.model("users",userSchema);