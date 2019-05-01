let jwt = require('jsonwebtoken');
let httpStatus = require('http-status-codes');
let config = require('../config/config');

module.exports = {
    authenticate (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(httpStatus.UNAUTHORIZED).json({msg : 'You are unauthorized'});
    }
    console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
      return res.status(httpStatus.FORBIDDEN).json({msg : 'No token are found'});
    } else {
        let data = jwt.verify(token,config.secret);
        if (data) {
          req.user = data.data;
          next();
        } else {
          return res.status(401).json({
            msg: 'Invalid token'
          });
        }
    }
    
    // if (req.headers && req.headers.authorization) {
    //   console.log(req.headers);
    //   let parts = req.headers.authorization.split(' ');
    //   if (parts.length == 2) {
    //     let scheme = parts[0],
    //       credentials = parts[1];
    //     if (/^Bearer$/i.test(scheme)) {
    //       token = credentials;
    //     }
    //   } else {
    //     return res.status(401).json({
    //       msg: 'Format is Authorization: Bearer [token]'
    //     });
    //   }
    // } else {
    //   return res.status(401).json({
    //     msg: 'No authorization header was found'
    //   });
    // }
  
    // let data = jwt.verify(token,config.secret);
    // if (data) {
    //   req.user = data.data;
    //   next();
    // } else {
    //   return res.status(401).json({
    //     msg: 'Invalid token'
    //   });
    // }
  }
}