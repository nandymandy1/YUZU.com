const express = require('express');
const router = express.Router();
const passport_user = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const config = require('../../config/db');


// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to Register User' });
        } else {
            res.json({ success: true, msg: 'User Registeration is Successful' });
        }
    });
});

// Authenticate
router.post('/auth', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        usertype: user.usertype
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});



// Profile route
router.get('/profile', passport_user.authenticate('jwt-user', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});


// Validate
router.get('/validate', (req, res, next) => {
    res.send('Validate');
});




module.exports = router;