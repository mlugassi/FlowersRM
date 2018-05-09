const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var md5 = require('md5');

router.get('/', async (req, res) => {
  if (req.session.userId === undefined) {
    req.session.referer = req.get('Referer');
    if (req.session.referer === undefined)
      req.session.referer = '/';
    res.render("index", { "uname": "", "role": "", "flowers": "" });
  }
  else
    res.redirect('/');
});

router.get('/logout', async (req, res) => {
  console.log(req.session.userName + ' is logging out');
  req.session.regenerate(err => {
      console.log('logged out');
      res.redirect('/');
  });
});

router.post('/', function (req, res) {
  (async () => {
    var session = req.session;
    var name = req.body.uname;
    var pass = req.body.psw;
    var salt = req.body.salt;

    //Check UserName And Password
    try {
      user = await User.findOne({ userName: name }).exec();
    } catch (err) {
      console.log("Login error: " +err);
      session.badLogin = "Login error";
      res.redirect(req.session.referer);
      return;
    }
    if (user === null) {
      console.log("Login no user: " + name);
      res.status(200).json('{"status":"fail"}');
      session.badLogin = "User " + req.body.uname + " doesn't exist";
      res.redirect(req.session.referer);
      return;
    }
    if (md5(user.password + salt) !== pass) {
      console.log(user.password);
      console.log('Worng Password');
      res.status(200).json('{"status":"fail"}');
      session.badLogin = "Wrong password for " + req.body.uname;
      res.redirect(req.session.referer);
      return;
    }
    console.log("login Success to: " + user.userName);
    delete session.badLogin;
    session.userId = user.userName;
    session.userName = user.userName;
    session.admin = user.role;

    //res.cookie("userName", user.userName, { maxAge: 5 * 60 * 1000 });
    res.status(200).json('{"status":"success"}').redirect(req.session.referer);
  })()
});

module.exports = router;
