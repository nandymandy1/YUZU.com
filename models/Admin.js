const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin Schema
const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        default: 'admin'
    }
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);

// Finging the admin from the database
// finding by id
module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

// finding admin by username
module.exports.getAdminByUsername = function (username, callback) {
    const query = { username: username }
    Admin.findOne(query, callback);

}

// Create admin and hash the password
module.exports.addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

// Compare the password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}