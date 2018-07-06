const mongoose = require('mongoose');
const Product = require('./product');
const User = required('./user');


const orderSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    product: {type:mongoose.Schema.Types.ObjectId, ref:'Product'},
},{
    usePushEach: true
});


const Order = mongoose.model('Product', orderSchema);
module.exports = Order;
