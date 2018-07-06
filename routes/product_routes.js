const router = require('express').Router();
const mongoose = require('mongoose');

const Products = require('./../models/product');
const Categories = require('./../models/category');
const helper = require('../helpers/helper');

router.get('/list', helper.verifyToken, async(req, res, next) => {
    const { limit } = req.query || 0;
    const { skip } = req.query || 0;
    //const products = await Product.getAllProductList(skip, limit);
    Products.find().exec((err, data)=>{
        res.send(data);
    });
});

module.exports = router;