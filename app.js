let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let mongoose = require("mongoose");
let cookieParser = require('cookie-parser');
// let logger = require('morgan');
let config = require('./config/config');
let indexRouter = require('./routes/index');
let authRouter = require('./routes/authRouter');
let userRouter = require('./routes/userRouter');
let postsRouter = require('./routes/postsRouter');
let friendsRouter = require('./routes/friendsRouter');
let messageRouter = require('./routes/messageRouter');
let imageRouter = require('./routes/imageRouter');
let _ = require('lodash');
let app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.dburl, { useNewUrlParser: true });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
let server = require('http').createServer(app);
let io = require('socket.io').listen(server); 

const {User} = require('./Helpers/userClass');
 
require('./socket/streams')(io,User, _);
require('./socket/private')(io);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT", "OPTOPNS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });
// app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true , limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.send('welcome');
});
app.use('/api/chatapp', authRouter);
app.use('/api/chatapp', postsRouter);
app.use('/api/chatapp', userRouter);
app.use('/api/chatapp', friendsRouter);
app.use('/api/chatapp', messageRouter);
app.use('/api/chatapp', imageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
let port = process.env.port || 3000;
server.listen(process.env.PORT || 8080, () => {
  console.log("server is listening  ");
});
module.exports = app;
