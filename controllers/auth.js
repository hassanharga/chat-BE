let Joi = require("joi");
let httpStatus = require("http-status-codes");
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require("../config/config");
let User = require("../models/userModel");
module.exports = {
  async createUser(req, res) {
    //console.log(req.body);
    let schema = Joi.object().keys({  //validating schema
      username: Joi.string().min(5).max(10).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(10).required() /*.regex(/^[a-zA-Z0-9]{3,30}$/)*/
    });
    // Joi.validate(req.body,schema,(err,value)=>{
    //   if (err && err.details) {

    //       return res
    //         .status(httpStatus.BAD_REQUEST)
    //         .json({ msg: err.details });
    //     }
    //     console.log(value);
    // })
    let { error, value } = Joi.validate(req.body, schema); // add  schema validation 
    if (error && error.details) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: error.details });
    }
    let Email = await User.findOne({ email: req.body.email }); //checking if the email is exists
    if (Email) {
      return res.status(httpStatus.CONFLICT).json({ message: 'Email is already exists' });
    }
    let userName = await User.findOne({ username: req.body.username }); //checking if the username is exists
    if (userName) {
      return res.status(httpStatus.CONFLICT).json({ message: 'Username is already exists' });

    }
    return bcrypt.hash(value.password, 10, (err, hash) => {   //encrypting the password
      if (err) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'error hasing password' });
      }
      let body = {
        username: value.username,
        email: value.email,
        password: hash
      }
      User.create(body).then(user => {
        let token = jwt.sign({ data: user }, config.secret);
        res.cookie("token", token);
        res.status(httpStatus.CREATED).json({ message: "user created successfully", user, token });
      }).catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "error creating user" });
      })
    })
  },
  async loginUser(req, res) {
    console.log(req.body);
    if (!req.body.user || !req.body.pass) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'no empty fields allowed' });
    }
    await User.findOne({ username: req.body.user })
      .then(user => {
        if (!user) {
          res.status(httpStatus.NOT_FOUND).json({ message: 'username not found' });
        }
        else {
          bcrypt.compare(req.body.pass, user.password)
            .then(result => {
              if (!result) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'password is incorrect' });
              }
              else {
                let token = jwt.sign({ data: user }, config.secret)
                res.cookie("token", token);
                res.status(httpStatus.OK).json({ message: 'Login sucessful', user, token });
              }
            })
            .catch(error => {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error finding user' });
            })
        }

      })
      .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error occured' });
      })
  }
};
