const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
  console.log(req.session.passport.user + ' is logging out');
  req.session.regenerate(err => {
    console.log('logged out');
    res.redirect('/');
  });
});

// router.post('/',
//   passport.authenticate('local', 
//   { successRedirect: '/',
//                                    failureRedirect: '/',
//                                    failureFlash: false })
// );

router.post('/', function (req, res, next) {
  passport.authenticate('local',{successRedirect: '/'}, function (err, user, info) {
    console.log("I'm here!");
    if (err)
      return next(err);//res.status(200).json({ "status": "fail", "massege": info.massege });
    if (!user)
      return res.status(200).json({ "status": "fail", "message": info.message });
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.status(200).json({ "status": "success" });
      });
  })(req, res, next);
});

module.exports = router;
