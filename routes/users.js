var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Users = require('../models/user');
var Objs = require('../models/objects');

/* GET users listing. */
router.route('/')
.get(function(req, res, next) {
  res.send('respond with a resource');
});

// Add a new user to the DB in the registration process
router.route('/register')
.post(function(req, res, next){
    Users.create(req.body, function (err, user){
    	if (err) throw err;
    	var id = user._id;
    	console.log(user);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });    	
        res.end('Added the user with id: ' + id);
    });

});


router.route('/:uid')
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
.get(function(req, res, next){
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
