
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for customer routes
app.use(
    '/customer',
    session({
        secret: 'fingerprint_customer',
        resave: true,
        saveUninitialized: true
    })
);

// Authentication middleware for protected routes
app.use('/customer/auth/*', function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. Please log in first.'
        });
    }

    // Accept either "Bearer TOKEN" or the token by itself
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, 'access');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }
});

// Server port
const PORT = 5000;

// Routes
app.use('/customer', customer_routes);
app.use('/', genl_routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
