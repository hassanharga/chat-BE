let joi = require("joi");
let httpStatus = require("http-status-codes");
let User = require("../models/userModel");
module.exports = {
  async createUser(req, res) {
    console.log(req.body);
    let schema = joi.object().keys({
      username: joi
        .string()
        .min(5)
        .max(10)
        .required(),
      email: joi
        .string()
        .email()
        .required(),
      password: joi
        .string()
        .min(5)
        .max(10)
        .required() /*.regex(/^[a-zA-Z0-9]{3,30}$/)*/
    });
    joi.validate(req.body, schema, (err, value) => {
      if (err && err.details) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: err.details });
      }
    });
    let userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "Email already exists" });
    }
  }
};
