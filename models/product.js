const mongoose = require('mongoose');
const Category = require('./category');


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String},
    price: {type: Number, required: true},
    description: {type: String},
    category: {type:mongoose.Schema.Types.ObjectId, ref:'Category'},
},{
    usePushEach: true
});


productSchema.index({ 'name': 1});

const Products = mongoose.model('Product', productSchema);
module.exports = Products;
