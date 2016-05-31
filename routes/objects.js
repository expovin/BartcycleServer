var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Objs = require('../models/objects');
var MakeTransaction = require('../app_controllers/makeTransaction');

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

	Objs.findById(req.params.objd).exec(function(err, objs){
		MakeTransaction(err, objs, req, res);
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
