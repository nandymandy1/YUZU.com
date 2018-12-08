const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

const passport_admin = require('passport');

// Get all the products and sorted in ascending order
router.get('/', (req, res, next) => {
    Product
        .find()
        .sort({ created_at: -1 })
        .limit(10)
        .then(products => {
            return res.json({ products: products, success: true })
        })
        .catch(err => {
            return res.json({ msg: "Unable to fetch the products", err: true });
        });
});

// Get product by Product Id
router.get('/:id', (req, res, next) => {
    id = req.params.id;
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
router.post('/search', (req, res, next) => {
    query = req.body.query;
    // Query Builder need to be updated
    /*
        Search for Partial Text
        .find({ $text: { $search: query } })
    */

    Product
        .find({ $or: [{ name: { $regex: new RegExp(query), "$options": "i" } }, { category: { $regex: new RegExp(query), "$options": "i" } }, { description: { $regex: new RegExp(query), "$options": "i" } }] })
        .then(product => {
            return res.json({ products: product, success: true })
        })
        .catch(err => {
            return res.json({ msg: "Unable to fetch the products", err: true });
        });
});

// To be only accessed by Admin
// Add a Product
router.post('/add', passport_admin.authenticate('jwt-admin', { session: false }), (req, res, next) => {
    let newProduct = new Product({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        instock: req.body.quantity
    });

    newProduct
        .save()
        .then(product => {
            return res.json({ msg: "Product Added Successfully.", product: product, success: true });
        })
        .catch(err => {
            return res.json({ msg: "Unable to add the product.", err: true });
        });
});

// Remove a product
router.delete('/:id', passport_admin.authenticate('jwt-admin', { session: false }), (req, res, next) => {
    id = req.params.id;
    Product.find({ _id: id })
        .remove()
        .then(product => {
            return res.json({ msg: "Product Deleted Successfully.", product: product, success: true });
        })
        .catch(err => {
            return res.json({ msg: "Unable to add the product.", err: true });
        });
});

// Edit a product
router.put('/:id', passport_admin.authenticate('jwt-admin', { session: false }), (req, res, next) => {
    id = req.params.id;
    product = Product.find({ _id: id })
    product.name = req.body.name;
    product.category = req.body.category;
    product.description = req.body.description;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.save()
        .then(product => {
            return res.json({ msg: "Product Details Successfully Updated.", product: product, success: true });
        })
        .catch(err => {
            return res.json({ msg: "Unable to add the product.", err: true });
        });
});



module.exports = router;