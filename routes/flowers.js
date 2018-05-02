const express = require('express');
const router = express.Router();
const Flowers = require('../model')("Flower");
const User = require('../model')("User");
var fs = require("fs");

router.post('/catalog', function (req, res) {
  var name = req.body.uname;
  User.findOne({ userName: name, active: true }, 'userName', function (err, user) {
    if (err) throw err;
    if (user != null) {
      Flowers.find({}, function (err, Flowers) {
        if (err) throw err;
        res.status(200).render('partials/catalog', { flowers: Flowers });
      });
    }
  });
});

// manage flowers
router.get('/manage', function (req, res) {
  Flowers.find({}, function (err, flowers) {
    (async () => {
      var name = req.cookies.userName;
      var role = ' ';
      if (typeof req.cookies.userName !== 'undefined') {
        role = (await User.findOne({ userName: req.cookies.userName }).select('role').exec()).role;
      }
      switch (role) {
        case "provider":
          res.render('manage_flowers', { flowers: flowers });
          break;
        default:
          res.render('page_not_found');
      }
    })();
  });
});
router.post('/Details', function (req, res) {
  var name = req.body.flower;
  Flowers.findOne({ flower: name }, function (err, result) {
    if (err) throw err;
    if (result != null)
      res.status(200).json(JSON.stringify(result));
  });
});

router.post('/add', function (req, res) {

  Flowers.findOne({ flower: req.body.flower }, function (err, result) {
    if (err) throw err;
    if (result != null)
      res.status(200).json('{"error":"Flower Alredy Exist" }');
    else {
      var flower = {};
      flower.flower = req.body.flower;
      flower.color = req.body.color;
      flower.picture = req.body.picture;
      flower.cost = req.body.cost;
      Flowers.create(flower, function (err, flower) {
        if (err) throw err;
        console.log('flower created:' + flower);
      });
    }
  });
});

router.post('/addPicture', (req, res) => {
  console.log("I'm in the addPicture!!");
  let fbytes = req.headers["content-length"];
  let fname = req.headers["x_filename"];
  if (fname.toLowerCase().startsWith("http")) {
    newfile = fs.createWriteStream("public\\images\\"+ fname.substring(fname.lastIndexOf("/")+ 1));
    http.get(fname, function (response) {
      response.pipe(newfile);
    });
  }
  else
  {
    newfile = fs.createWriteStream("public\\images\\" + fname);
    req.pipe(newfile);
  }
	req.on('end', function(stuff) {
    res.end("uploaded");
	newfile.end();
   });
});

module.exports = router;