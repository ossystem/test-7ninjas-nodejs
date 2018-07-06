const mongoose = require('mongoose');
const crypto = require('crypto');

const usersSeed = require('./user_seed');
const productSeed = require('./product_seed');
const User = require('../models/user');
const Products = require('../models/product');
const Categories = require('../models/category');

const uri = "mongodb://localhost:27017/test_project_db";
mongoose.connect(uri, { useNewUrlParser: true });

for (user of usersSeed) {
    const password = crypto.pbkdf2Sync(user.password, 'salt', 100000, 512, 'sha512').toString('hex');
    console.log(password);
    const newUser = new User({...user, password});
    newUser.save();
}

for (product of productSeed) {
    product.category = mongoose.Types.ObjectId('5b3f43d6bdfbc32ae04c3874'); //mock
    const newProduct = new Product(product);
    newProduct.save();
}