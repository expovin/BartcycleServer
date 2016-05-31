/*  makeTransaction
	This madule perform all checks and operations before make any transaction. The check made are:
	- RETRIVING -
	  1 - Retrive user details
	  2 - Retrive Seller details
	  3 - Retrive Buyer Details
	- CHECKING - 
	  4 - Check if the object status is Published
	  5 - Check if buyer credit match the object price
	- PERFORM -
	  6 - Change the Object's status to selling
	  7 - Pass the VT from buyer to seller by the Object's price
	  8 - Create a new transaction with all details
	  9 - Change the Object's status to sold
*/

/**** GLOBAL VARIABLE ****/
var Users = require('../models/user');
var Objs = require('../models/objects');
var Trans = require('../models/transaction');

var request,
	response,
	good,
	buyer,
	seller;

var isError = false;
/********************************/

function errorHandling(errCode)
{
	switch (errCode)
	{
		case 100:
	        //response.writeHead(400, { 'Content-Type': 'text/plain' });    	
	        response.json({code:"100", message:"Buyer not Found"});
			break;

		case 200:
			response.json({code:"200", message:"You don't have enought VT, you can't buy it!"});
			break;

		case 300:
			response.json({code:"300", message:"Error to modify Object status to Selling. Transaction stopped"});
			break;		

		case 400:
			response.json({code:"400", message:"Error decrementing buyer amount"});
			break;	

		case 450:
			response.json({code:"450", message:"Error incrementing seller amount"});
			break;	

		case 500:
			response.json({code:"500", message:"Error creating a transaction"});
			break;		

		case 600:
			response.json({code:"600", message:"Error to modify Object status to SOLD"});
			break;

		default:
	}
	isError = true;

}

function changeObjectStatus(err, trs)
{
	if (err) 
	{
	    errorHandling(500);
	    return;
	}

	// Transaction ended. Let's change the Object's status to sold.
	var conditions = {"_id": good._id, "state" :"Selling"};
	Objs.findOneAndUpdate(conditions, {$set:{state:"Sold"}}, function(err, obj){
		if (err) 
		{
		    errorHandling(600);
		    return;
		}

		// Transaction ended correctly. Return the Reansaction details
		response.json(trs);

	});

}

function CreateNewTransaction(err, user)
{
	if (err) 
	{
	    errorHandling(450);
	    return;
	}

	seller = user;

	var newTransaction = 
	{
		"objectsId" : good._id,
		"sellerId" : seller._id,
		"buyerId" : buyer._id
	};

    Trans.create(newTransaction, changeObjectStatus);

}

function IncrementSellerAmount(err, user)
{
	if (err) 
	{
	    errorHandling(400);
	    return;
	}

	// Let's increment Seller amount
	Users.findByIdAndUpdate(good.userId, {$inc: { vt: good.vt} }, {new: true}, CreateNewTransaction);
}

/*	This Function handle the Object status change from Published to Selling and manage the Transaction start process
*/
function handleObjectStatus_DecrementBuyerCredit(err, obj){
	if (err) 
	{
	    errorHandling(300);
	    return;
	}	

	if(obj == null)
	{
	    errorHandling(300);
	    return;
	}
	// Startus to Selling. Start the transaction
	// Let's decrement the Buyer amount by the Object's price
	Users.findByIdAndUpdate(buyer._id, {$inc: { vt: -good.vt} }, {new: true}, IncrementSellerAmount);
	
}

/********************************/
function handleBuyerDetails (err, user){

	// Error User not Found
	if (err) 
	{
	    errorHandling(100);
	    return;
	}		

	// Save Buyer details as Global variable
	buyer = user;						

	// Check whether the Buyer has enought VT to buy the Good
	if(buyer.vt < good.vt)
	{
	    errorHandling(200);
	    return;
	}	

	// Buyer has enought VT to buy the good, let's check if the Object 
	// is in the Published status and modify it in selling if the status is still Published
	var conditions = {"_id": good._id, "state" :"Published"};
	Objs.findOneAndUpdate(conditions, {$set:{state:"Selling"}}, handleObjectStatus_DecrementBuyerCredit);


	if(!isError){
		console.log("Errore "+isError);
//		response.json(buyer);
	}

}


/*  This is the functino's Entry point. This function receive the request, response 
	Retrived Object and error. Save all params as Global and start the checking process
*/

module.exports =  function handleGetObject(err, obj, req, res) {
	if (err){
        res.writeHead(400, { 'Content-Type': 'text/plain' });    	
        res.end('Error Object not found: ' + err);
	}
	else{
		request = req;
		response = res;
		good = obj;
		// Retrive the Buyer details
		Users.findById(req.body.uid).exec(handleBuyerDetails);
	}
}

/********************************/