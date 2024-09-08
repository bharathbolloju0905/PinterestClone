var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const EXsession = require("express-session");
var indexRouter = require('./routes/index');
const flash = require("connect-flash")
const passport = require('passport');
const usermodel = require("./models/user")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(EXsession({
  resave: false,
  saveUninitialized: false,
  secret: "Hare Krishna"
}))
app.use(flash()) ;
app.use(passport.initialize()),
  app.use(passport.session())
passport.serializeUser(usermodel.serializeUser())
passport.deserializeUser(usermodel.deserializeUser())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


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

module.exports = app;
