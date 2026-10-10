
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();

const users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username === username && user.password === password
    );
};

// User login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: 'Invalid username or password.'
        });
    }

    const accessToken = jwt.sign(
        { username },
        'access',
        { expiresIn: '1h' }
    );

    return res.status(200).json({
        message: 'User successfully logged in.',
        accessToken
    });
});

// Add or update a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const username = req.user?.username;
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!username) {
        return res.status(401).json({
            message: 'User is not authenticated.'
        });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found.'
        });
    }

    if (typeof review !== 'string' || !review.trim()) {
        return res.status(400).json({
            message: 'A valid review is required.'
        });
    }

    book.reviews = book.reviews || {};
    book.reviews[username] = review.trim();

    return res.status(200).json({
        message: 'Review added successfully.',
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
