var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Users = require('../models/user');
var Objs = require('../models/objects');

var passport = require('passport');
var Verify    = require('./verify');

/* GET users listing. */
router.route('/')
.get(function(req, res, next) {
  res.send('respond with a resource');
});


router.route('/register')
.post(function(req, res) {

	// New User
	var usr = new Users(
	{
		username : req.body.username,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		vt : req.body.vt,
		address : {
			street : req.body.address.street,
			zip : req.body.address.zip,
			city : req.body.address.city,
			country : req.body.address.country
		}
	});

    Users.register(usr, req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }

        console.log(user);     
        user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        });
    });
    });
})

router.route('/whoami')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    res.json({fullName :req.decoded._doc.firstname+" "+req.decoded._doc.lastname});
});

router.route('/login')
.post(function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
    	console.log("Sono in not user "+user);
      return res.status(401).json({
        err: info
      });
    }
    console.log("Sono fuori da err");
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        console.log("Sono in login");
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});


router.route('/:uid/details')
// Gett all user details
.get( function (req, res,next){
    Users.findById(req.params.uid)
    .exec(function (err, user) {
    	if (err) throw err;
    	console.log(user);
    	res.json(user);
    });
})

.put(function(req, res, next){
	// Modify user details
	Users.findByIdAndUpdate(
	    req.params.uid,
	    req.body,
	    {new: true},
	    function(err, model) {
	        console.log(err);
	        res.json(model);
	    });
});

router.route('/:uid/objects')
// Return all objects from a specific user
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    Users.findById(req.params.uid)
    .populate('objectsId')
    .exec(function (err, objs) {
    	if (err) throw err;
    	console.log("Obj : "+objs);
    	res.json(objs);
    });
})

.post(function(req, res, next){   	
        // Put the reference in the user detail
    req.body["userId"]=req.params.uid;
    console.log(req.body);
    Objs.create(req.body, function (err, obj){
    	if (err) throw err;
    	var Objid = obj._id;

		Users.findByIdAndUpdate(
		    req.params.uid,
		    {$push: {"objectsId": Objid}},
		    {safe: true, upsert: true},
		    function(err, model) {
		        console.log(err);
		        res.json(model);
		    });
    });
});


router.route('/:uid/feedbacks')
.get(function(req, res, next){
    Users.findById(req.params.uid)
    .exec(function (err, objs) {
    	if (err) throw err;
    	console.log("Obj : "+objs.objectsId);
    	res.json(objs.feedbacksIN);
    });
})

.put(function(req, res, next){   	
        // Put the reference in the user detail
	Users.findByIdAndUpdate(
	    req.params.uid,
	    {$push: {"feedbacksIN": req.body}},
	    {safe: true, upsert: true},
	    function(err, model) {
	        console.log(err);
	        res.json(model);
	    });


});




module.exports = router;
