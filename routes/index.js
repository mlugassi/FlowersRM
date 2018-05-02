const express = require('express');
const router = express.Router();
const User = require('../model')("User");
const Flowers = require('../model')("Flower");

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mlugassi@g.jct.ac.il',
    pass: '3398088Ml'
  }
});

var mailOptions = {
  from: 'DONTREPLAY@RMflowers.com',
  subject: 'Reset Password',
};

router.use(function (req, res, next) {
  if (req.cookies.userName) {
    res.cookie("userName" , req.cookies.userName, {maxAge  : 5*60*1000});
  }
  next();
});
// use res.render to load up an ejs view file of index page
router.get('/', function (req, res) {
  (async () => {
    var name = req.cookies.userName;
    var role = "";
    var flowers = "";
    if (typeof name === 'undefined')
      res.render("index", { "uname": "", "role": "", "flowers": "" });
    else {
      var user = await User.findOne({ userName: name, active: true }).exec();
      if (user != null) {
        role = user.role;
        flowers = await Flowers.find({}).exec();
      }
      else name = "";
      res.render("index", { "uname": name, "role": role, "flowers": flowers });
    }
  })();
});

router.post('/resetPassword', function (req, res) {
  User.findOne({ email: req.body.email, active: true }, function (err, result) {
    if (err) throw err;
    if (result != null) {
      (async () => {
        result.uuid = create_UUID();
        result.reset = true;
        User.findOneAndUpdate({ userName: result.userName }, result, function (err, result) {
          if (err) throw err;
        })
        mailOptions.to = req.body.email;
        mailOptions.html = "<p>Hello" + result.userName + ",</p><a href = \"localhost/resetPassword/" + result.uuid + "\"> Click here for reset your password</a>";
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json('{"status":"OK" }');
          }
        });
      })();
    }
    else
      res.status(200).json('{"status":"Email dosn\'t exist" }');
  });

});

router.get('/resetPassword/:UUID', function (req, res) {
  User.findOne({ uuid: req.params.UUID, active: true }, function (err, result) {
    if (err) throw err;
    if (result != null) {
      (async () => {
        res.render('reset_password', { uuid: result.uuid });
      })();
    }
    else
      res.status(200).render('page_not_found');
  });

});

router.post('/doReset', function (req, res) {
  User.findOne({ reset: true, uuid: req.body.uuid, active: true }, function (err, result) {
    if (err) throw err;
    if (result != null) {
      (async () => {
        result.uuid = "";
        result.reset = false;
        result.password = req.body.pass;
        User.findOneAndUpdate({ userName: result.userName }, result, function (err, result) {
          if (err) throw err;
        })
        res.status(200).json('{"status":"OK"}');
      })();
    }
    else
      res.status(404);
  });

});
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
module.exports = router;