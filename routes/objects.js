var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Objs = require('../models/objects');
var Users = require('../models/user');

/* GET users listing. */

router.route('/')
.get(function(req, res, next) {
  res.send('respond with a resource');
});



router.route('/publish')
.post(function(req, res, next){
    Objs.create(req.body, function (err, obj){
    	if (err) throw err;
    	var id = obj._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });    	
        res.end('Added the object with id: ' + id);
    });
});

router.route('/:objd/get')
.put(function(req, res, netx){
	
	// 1 Operation : Chech the buyer credit
	// Get the Object Price	
	Objs.findById(req.params.objd)
	.exec(function (err, objs) {
	    if (err) throw err;
	    console.log("Object cost : "+objs.vt);
	    // Get the Buyer amount
		Users.findById(req.body.uid)
		.exec(function (err, user) {
		    if (err) throw err;
		    console.log("User Credit : "+user);
		    if(user.vt >= objs.vt){
		    	// In this case Buyer has enought VT to buy Item
		    	// Let's move VT from Buyer to Seller
		    	// Increment Seller account
				Users.findByIdAndUpdate(
				    objs.userId,
				    {$inc: { vt: objs.vt} },
				    {new: true},
				    function(err, model) {
				    	// Decrement buyer Account
						Users.findByIdAndUpdate(
						     user._id,
						    {$inc: { vt: -objs.vt} },
						    {new: true},
						    function(err, model) {
						    	// Change Object's status to selling
						    	objs.status ="selling"
						    	res.json(objs);
						    });	
				    });		    					    
		    }
		    else{
		        res.writeHead(406, { 'Content-Type': 'text/plain' });    	
		        res.end('You do not have enought vt to buy this item ');
		    }
		});	
	});
});


router.route('/publish/:objd')
.put(function(req, res, next){
	Objs.findByIdAndUpdate(
	    req.params.objd,
	    req.body,
	    {new: true},
	    function(err, model) {
	        console.log(err);
	        res.json(model);
	    });
});


/*	FIND SECTION
*/
//Find By Category
router.route('/category/:catId')
.get(function(req, res, next) {
  Objs.find({category : req.params.catId})
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
  Objs.find({'location.city' : req.params.city})
  .exec(function (err, obj) {
  	if (err) throw err;
  	res.json(obj);
  });
});


// Find by keyWord
router.route('/kw/:kw')
.get(function(req, res, next) {
	console.log(req.params.kw);
  Objs.find({'description' :  '/^'+req.params.kw+'/'})
  .exec(function (err, obj) {
  	if (err) throw err;
  	res.json(obj);
  });
});

module.exports = router;
