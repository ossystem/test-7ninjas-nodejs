const mongoose = require('mongoose');
const crypto = require('crypto');

const usersSeed = require('./user_seed');
const productSeed = require('./product_seed');
const categorySeed = require('./category_seed');
const Users = require('../models/user');
const Products = require('../models/product');
const Categories = require('../models/category');

const uri = "mongodb://localhost:27017/test_project_db";
mongoose.connect(uri, { useNewUrlParser: true });

const runSeed = async () => {
    let index = 0;
    const setOfIdCategories = [];

    for (category of categorySeed) {
        const newCategory = new Categories(category);
        setOfIdCategories.push(newCategory._id)
        await newCategory.save();  
    }
    console.info('categories created ....');

    for (user of usersSeed) {
        const password = crypto.pbkdf2Sync(user.password, 'salt', 100000, 512, 'sha512').toString('hex');
        const newUser = new Users({...user, password});
        await newUser.save();
    }
    console.info('users created ....');
    
    for (product of productSeed) {
        product.category = mongoose.Types.ObjectId(setOfIdCategories[index]); //mock
        const newProduct = new Products(product);
        await newProduct.save();
        index++;
    }
    console.info('categories created ....');

    process.exit(0);
};

runSeed();