const router = require('express').Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {promisify} = require('util');

const Orders = require('./../models/order');
const Users = require('./../models/user');
const Products = require('./../models/product');
const helper = require('../helpers/helper');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/make', helper.verifyToken, urlencodedParser, async(req, res, next) => {
    const { userName, productName, qty } = req.body;
    if ( !userName ) {
        return next('user not found');
    }
    if ( !productName ) {
        return next('product not found');
    }
    if ( !qty ) {
        return next('quantity not found');
    }
    try {
        const userPromise = Users.findOne({name:userName}).exec();
        const productPromise = Products.findOne({name:productName}).exec();

        const user = await userPromise;
        const product = await productPromise;

        const newOrder = new Orders({
            user: user['_id'],
            product: product['_id'],
            qty,
            createdAt: Date.now() 
        })
        await newOrder.save();
        helper.sendMailToCustomer(product.name, product.price, user.email, user.name);
        res.send({message:'order saved'});

    } catch (err) {
        next(err);
    }
});

module.exports = router;