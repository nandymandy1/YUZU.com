const express = require('express');
const router = express.Router();
const passport_admin = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const config = require('../../config/db');


// Admin Users Routes
router.post('/register', (req, res, next) => {
    let newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        usertype: 'admin'
    });

    Admin.addAdmin(newAdmin, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to Register Admin' });
        } else {
            res.json({ success: true, msg: 'Admin Registeration is Successful' });
        }
    });
});

// Admin Authenticate
router.post('/auth', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.getAdminByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        if (user.usertype != 'admin') {
            return res.json({ success: false, msg: 'This is only of the admin authentication' });
        }

        Admin.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 304800 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    admin: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        type: user.usertype
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

// Get Protected Route
router.get('/profile', passport_admin.authenticate('jwt-admin', { session: false }), (req, res, next) => {
    res.json({ admin: req.user });
});

module.exports = router;