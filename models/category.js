const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {type:String, required: true}
},{
    usePushEach: true
});

const Categories = mongoose.model('category', categorySchema);
module.exports = Categories;
