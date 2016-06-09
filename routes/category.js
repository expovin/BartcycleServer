var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Cat = require('../models/categories');


var passport = require('passport');
var Verify    = require('./verify');

/* GET users listing. */

router.route('/')
.get(function(req, res, next){
    Cat.find({}, function(err, cat){
      if(err) throw err;
       res.json(cat);
    });
});



module.exports = router;
