const mongoose = require('mongoose');
const Categories = require('./category');


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String},
    price: {type: Number, required: true},
    description: {type: String},
    category: {type:mongoose.Schema.Types.ObjectId, ref:'Categories'},
},{
    usePushEach: true
});

productSchema.index({ 'name': 1});

productSchema.statics.getList = function getList (skip, limit, filter, populateOptions) {
    return this.find(filter).populate('category', null, populateOptions).skip(skip).limit(limit)
}

productSchema.statics.getProduct = function getProduct (filter) {
    return this.findOne(filter).populate('category');
}

const Products = mongoose.model('Products', productSchema);
module.exports = Products;
