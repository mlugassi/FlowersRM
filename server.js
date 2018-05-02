// server.js
// load the things we need
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
var path = require('path');

let index = require('./routes/index');
let users = require('./routes/users');
let login = require('./routes/login');    // it will be our controller for logging in/out
let flowers = require('./routes/flowers');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'images', 'flower.ico')));
app.use('/users', users);
app.use('/login', login); // register login controller
app.use('/flowers', flowers);
app.use('/', index);

app.use(function (req, res, next) {
  if (req.cookie.userName) {
    console.log("coockes is exist");
  }
  else {
    console.log("coockes is not exist");
  }
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(80);
console.log('80 is the magic port');