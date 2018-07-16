const router = require('express').Router();
const mongoose = require('mongoose');

const Products = require('./../models/product');
const Categories = require('./../models/category').model;
const helper = require('../helpers/helper');

router.get('/list', helper.verifyToken, async(req, res, next) => {
    const filter = req.query.productName ? { name: req.query.productName } : {};
    const populateOptions =  req.query.category ? {name: category} : {/*name: 'Category 1'*/};
    const { limit } = req.query || 0;
    const { skip } = req.query || 0;
    try {
        const products = [];
        const result = await Products.getList(0, 0, filter, populateOptions);
        result.forEach( product => {
            if (product.category) {
                const {name, image, price, description, category} = product
                products.push({name, image,price, description, category: category.name})
            }
        });
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send({
            success: true,
            data: products
        });
    } catch (err) {
        next(err);
    }
});

router.get('/', helper.verifyToken, async(req, res, next) => {
    if (!req.query.name) {
        return res.status(400).send({
            success: false,
            data: {}
        });
    }

    try {
        const filter = { name: req.query.name };
        const product = await Products.getProduct(filter);
        const {name, image, price, description, category} = product
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send({
            success: true,
            data: {name, image, price, description, category: category.name}
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;