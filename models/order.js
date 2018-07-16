const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const Products = require('./product');
const User = require('./user');


const orderSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    product: {type:mongoose.Schema.Types.ObjectId, ref:'Products'},
    qty: {type: Number},
    createdAt: mongoose.Schema.Types.Long
},{
    usePushEach: true
});

orderSchema.statics.createOrdersSet = function createOrdersSet () {
    const yesterday = Date.now()- 24*60*60*1000;
    return this.find().populate('product').where('createdAt').gt(yesterday).lt(Date.now());
};

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;
