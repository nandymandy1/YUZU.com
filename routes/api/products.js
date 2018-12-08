const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// Get all the products and sorted in ascending order
router.get('/', (req, res, next) => {
    Product
        .sort({ created_at: -1 })
        .find()
        .then(products => {
            return res.json({ products: products, success: true })
        })
        .catch(err => {
            return res.json({ msg: "Unable to fetch the products", err: true });
        });
});

// Get product by Product Id
router.post('/id', (req, res, next) => {
    id = req.body.id;
    Product
        .find({ _id: id })
        .then(product => {
            return res.json({ product: product, success: true })
        })
        .catch(err => {
            return res.json({ msg: "Unable to fetch the product details", err: true });
        });
});

// Get all products by matching names
router.post('/name', (req, res, next) => {
    name = req.body.name;
    Product
        .find({ name: { $eq: name } })
        .then(products => {
            return res.json({ products: products, success: true })
        })
        .catch(err => {
            return res.json({ msg: "Unable to fetch the products", err: true });
        });
});

router.post('/add', (req, res, next) => {

});

module.exports = router;