var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Transaction = new Schema({
    objectsId : {
      type: Schema.Types.ObjectId,
      ref : 'Objs',
      required:true
    },
    sellerId : {
      type: Schema.Types.ObjectId,
      ref : 'User',
      required:true
    },
    buyerId : {
      type: Schema.Types.ObjectId,
      ref : 'User',
      required:true
    },
    feedbackBuyerId : {
      type: Schema.Types.ObjectId,
      ref : 'Feedback'
    },
    feedbackSellerId: {
      type: Schema.Types.ObjectId,
      ref : 'Feedback'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', Transaction);