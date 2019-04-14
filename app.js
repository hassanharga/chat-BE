let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let mongoose = require("mongoose");
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let config = require('./config/config');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/authRouter');
let app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.dburl, { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT", "OPTOPNS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/chatapp', usersRouter);

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
let port = process.env.port || 8080;
app.listen(port, () => {
  console.log("server is listening at " + port);
});
module.exports = app;
