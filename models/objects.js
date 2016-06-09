var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Objects = new Schema({
    title: {
      type : String,
      required : true
    },
    description: {
      type : String,
      required : true 
    },
    vt : {
      type: Number,
      min : 1,
      required: true
    },
    category : {
      type: String,
      required: true
    },
    userId : [{
      type: Schema.Types.ObjectId,
      ref : 'User',
      required: true
    }],
    state : {
      type : String,
      required : true
    },
    picFile : {
      type : String,
      required : false
    },
    location:   {
        zip : {
          type : Number,
          require : true
        },
        city : {
          type : String,
          require : true
        },
        country : {
          type : String,
          require : true
        }
    },
    img : {
      data : Buffer,
      contentType : String
    }
  }, {
      timestamps : true
    });


var Objs = mongoose.model('Objects', Objects);
module.exports = Objs;