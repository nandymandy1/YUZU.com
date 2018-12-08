const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport_admin = require('passport');
const passport_user = require('passport');
const path = require('path');
const app = express();

const db = require('./config/db').database;

// Database Connection
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Database Connected Successfully');
    })
    .catch((err) => {
        console.log("Unable to connect with the database", err);
    });

// PORT
const port = process.env.PORT || 5000;

app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Bodyparser middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport_user.initialize());
app.use(passport_user.session());
app.use(passport_admin.initialize());
app.use(passport_admin.session());
// Defining the middleware of the application //

// index route
app.get('/', (req, res) => {
    res.send("Hello world");
});

require('./config/user_passport')(passport_user);
require('./config/admin_passport')(passport_admin);


// User Routes
const userRoutes = require('./routes/api/user');
app.use('/api/user', userRoutes);


// Admin Routes
const adminRoutes = require('./routes/api/admin');
app.use('/api/admin', adminRoutes);


// Products Route
const productRoutes = require('./routes/api/products');
app.use('/api/product', productRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
// Routes goes above it //

// Simple Listener for the port
app.listen(port, () => {
    console.log("Server stared on port: " + port);
});
