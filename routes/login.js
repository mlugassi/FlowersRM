const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var md5 = require('md5');

router.get('/', async (req, res) => {
  //     if (req.session.userId === undefined) {
  //         req.session.referer = req.get('Referer');
  //         if (req.session.referer === undefined)
  //             req.session.referer = '/';
  //         res.render("login", {title: "Login", problem: req.session.badLogin});
  //     }
  //     else
  res.redirect('/');
});
router.get('/logout', async (req, res) => {
  res.cookie("userName", req.cookies.userName, { maxAge: 0 });
  res.redirect('/');
});

router.post('/', function (req, res) {
  (async () => {
    name = req.body.uname;
    pass = req.body.psw;
    salt = req.body.salt;

    //Check UserName And Password
    try {
      user = await User.findOne({ userName: name }).exec();
    } catch (err) {
      //debug(`Login error: ${err}`);
      //session.badLogin = "Login error";
      //res.redirect(req.session.referer);
      return;
    }
    if (user === null) {
      console.log("Login no user: " + name);
      res.status(200).json('{"status":"fail"}');
      // session.badLogin = `User '${req.body.uname}' doesn't exist`;
      // res.redirect(req.session.referer);
      return;
    }
    if (md5(user.password + salt) !== pass) {
      console.log(user.password);
      console.log('Worng Password');
      res.status(200).json('{"status":"fail"}');
      // session.badLogin = `Wrong password for '${req.body.uname}'`;
      // res.redirect(req.session.referer);
      return;
    }
    console.log("login Success to: " + user.userName);
    //debug(`Logged to: ${user.username}`);
    // delete session.badLogin;
    // //session.userId = user.id;
    // session.userName = user.userName;
    // session.admin = user.role;
    // session.userName = user.firstName;
    res.cookie("userName", user.userName, { maxAge: 5 * 60 * 1000 });
    res.status(200).json('{"status":"success","page":"partials/catalog.ejs" }');
    //session.count = 0;
    //res.redirect(req.session.referer);
  })();

});


// router.post('/', async (req, res) => {
//     var session = req.session;
//     let user;
// 	let salt = req.body.salt;

//     try {
//         user = await User.findOne({username: req.body.user}).exec();
//     } catch (err) {
//         debug(`Login error: ${err}`);
//         session.badLogin = "Login error";
//         res.redirect(req.session.referer);
//         return;
//     }
//     if (user === null) {
//         debug(`Login no user: ${req.body.user}`);
//         session.badLogin = `User '${req.body.user}' doesn't exist`;
//         res.redirect(req.session.referer);
//         return;
//     }
//     if (md5(user.password + salt) !== req.body.password) {
// 		debug(`final_password: ${md5(user.password + salt)}`);
//         debug(`Login wrong password: ${req.body.password}/${user.password}`);
//         session.badLogin = `Wrong password for '${req.body.user}'`;
//         res.redirect(req.session.referer);
//         return;
//     }
//     debug(`Logged to: ${user.username}`);
//     delete session.badLogin;
//     session.userId = user.id;
//     session.userName = user.username;
//     session.admin = user.admin;
//     session.userName = user.name;
//     session.count = 0;
//     res.redirect(req.session.referer);
// });

module.exports = router;
