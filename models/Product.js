const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        requierd: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    instock: {
        type: Number,
        required: true
    }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);

// Search Product by Id
module.exports.getProductById = function (id, callback) {
    Product.findById(id, callback);
}

// finding by Product Name
module.exports.getProductByName = function (name, callback) {
    const query = { name: name }
    Product.findOne(query, callback);
}

// Create the Product
module.exports.addProduct = function (newProduct, callback) {
    newProduct.save();
}