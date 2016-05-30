var Users,Transactions,Objects,Feedbacks;
exports.configure =function(){
  var mongoose = require('mongoose');
  Users = mongoose.model("User");
  Transactions = mongoose.model("Transaction");
  Objects = mongoose.model("Object");
  Feedbacks = mongoose.model("Feedback");
}