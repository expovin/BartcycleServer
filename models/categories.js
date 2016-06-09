var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var passportLocalMongoose = require('passport-local-mongoose');


var Category = new Schema ({
  name: {
    type : String,
    require : true
  },
  icon : {
    type : String,
    require : true
  }
    }, {
    timestamps: true
});



module.exports = mongoose.model('Category', Category);