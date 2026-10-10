
const express = require('express');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists.'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered. You can now log in.'
    });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found.'
        });
    }

    return res.status(200).json(book);
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const matchingBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    if (matchingBooks.length === 0) {
        return res.status(404).json({
            message: 'No books found for this author.'
        });
    }

    return res.status(200).json(matchingBooks);
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const matchingBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    if (matchingBooks.length === 0) {
        return res.status(404).json({
            message: 'No books found with this title.'
        });
    }

    return res.status(200).json(matchingBooks);
});

// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found.'
        });
    }

    return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
