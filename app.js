const db = require('./models/index');
const session = require('express-session');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

var userRouter = require('./routes/user');
var signinRouter = require('./routes/signin'); // site home
var signupRouter = require('./routes/signup');
var logoutRouter = require('./routes/logout');
var displayRouter = require('./routes/displayFarmers'); // admin home
var insertRouter = require('./routes/insertFarmer');
var editRouter = require('./routes/editFarmer');
var deleteRouter = require('./routes/deleteFarmer');
// API
var fetchRouter = require('./routes/fetch');
// var apiDisplayRouter = require('./routes/API/displayAll');
// var apiRouter = require('./routes/API/search');

var app = express();

// sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 60000,
    secure: false
  }
}));

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(cookieParser());
app.use(session(sess));
app.use(session({
  // generate a custom session id for new sessions
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// autoload ? fs module
app.use('/', signinRouter);
app.use('/user', userRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/displayFarmers', displayRouter);
app.use('/insertFarmer', insertRouter);
app.use('/editFarmer', editRouter);
app.use('/deleteFarmer', deleteRouter);
// API
app.use('/fetch', fetchRouter);
// app.use('/API/displayAll', apiDisplayRouter);
// app.use('/API/search', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
