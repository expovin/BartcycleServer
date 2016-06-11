var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Objs = require('../models/objects');
var Users = require('../models/user');
var MakeTransaction = require('../app_controllers/makeTransaction');

var passport = require('passport');
var Verify    = require('./verify');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET users listing. */

router.route('/')
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    Users.findById(req.decoded._id)
    .populate('objectsId')
    .exec(function (err, objs) {
      if (err) throw err;
      console.log("Obj : "+objs.objectsId);
      res.json(objs.objectsId);
    });
})


router.route('/publish')
.post(Verify.verifyOrdinaryUser, function(req, res, next){
  req.body.userId = req.decoded._id;

    Users.findById(req.decoded._id)
//    .populate('objectsId')
    .exec(function (err, objs) {
        if (err) throw err;
        var location =  {"zip" :objs.address.zip, "country":objs.address.country, "city":objs.address.city};
        req.body["location"] = location;

        Objs.create(req.body, function (err, obj){
          if (err) throw err;
          var Objid = obj._id;

          // Update the user info
          Users.findByIdAndUpdate(
              req.decoded._id,             // This is the logged in's userId 
              {$push: {"objectsId": Objid}},
              {safe: true, upsert: true},
              function(err, model) {
                  res.json({code:'200', message:'Object created '});
              });
        });
    });

});


router.route('/update/:objd')
.put(Verify.verifyOrdinaryUser, function(req, res, next){
	Objs.findByIdAndUpdate(
	    req.params.objd,
	    req.body,
	    {new: true},
	    function(err, model) {
	        console.log(err);
	        res.json(model);
	    });
});

router.route('/delete/:objd')
.delete(Verify.verifyOrdinaryUser, function(req, res, next){

    Objs.find({ _id:req.params.objd }).remove().exec();

});


router.route('/get/:objd')
.put(Verify.verifyOrdinaryUser,function(req, res, netx){
  
  // 1 Operation : Chech the buyer credit
  // Get the Object Price 

  Objs.findById(req.params.objd).exec(function(err, objs){
    MakeTransaction(err, objs, req, res);
  });

})

.get(function(req, res, next){
    Objs.findById(req.params.objd)
    .populate('userId')
    .exec(function (err, objs) {
      if (err) throw err;
      res.json(objs);
    });
});

/*	FIND SECTION
*/
//Find By Category
router.route('/category/:catId')
.get(function(req, res, next) {
  Objs.find({'category' : req.params.catId, 'state':'Published'})
  .exec(function (err, obj) {
  	if (err) throw err;
  	res.json(obj);
  });
});


//Find By Location
router.route('/location/zip/:zip')
.get(function(req, res, next) {
  Objs.find({'location.zip' : req.params.zip, 'state':'Published'})
  .exec(function (err, obj) {
  	if (err) throw err;
  	res.json(obj);
  });
});

router.route('/location/city/:city')
.get(function(req, res, next) {
	console.log(req.params.city);
  Objs.find({'location.city' : req.params.city, 'state':'Published'})
  .exec(function (err, obj) {
  	if (err) throw err;
  	res.json(obj);
  });
});


// Find by keyWord
router.route('/kw/:kw')
.get(function(req, res, next) {
	console.log(req.params.kw);
  Objs.find({'description' :  '/^'+req.params.kw+'/', 'state':'Published'})
  .exec(function (err, obj) {
  	if (err) throw err;
  	res.json(obj);
  });
});

module.exports = router;
