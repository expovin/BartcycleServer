var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var passportLocalMongoose = require('passport-local-mongoose');


var Feedback = new Schema ({
  title: {
    type : String,
    require : true
  },
  description : {
    type : String,
    require : true
  },
  rank : {
    type : Number,
    min : 1,
    max : 5,
    require : true,
    default : 5
  }
    }, {
    timestamps: true
});


Feedback.methods.getAvgRank = function () {
     return (5);
};


module.exports = mongoose.model('Feedback', Feedback);