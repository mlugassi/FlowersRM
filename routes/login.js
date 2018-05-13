const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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
  passport.authenticate('local', function (err, user, info) {
    console.log("I'm here!");
    if (err)
      return next(err);//res.status(200).json({ "status": "fail", "massege": info.massege });
    else if (!user)
    {
      console.log(info);
      return res.status(200).json({ "status": "fail", "message": info.message });
    }
    else {
      //req.session.passport.user = user.userName;
      console.log(req.session);
      console.log(req.session.passport);

      return res.status(200).json({ "status": "success" });
    }
  })(req, res, next);
});

module.exports = router;
