const express = require('express');
const {queryBooksAsync} = require('./booksdb.js');
const findBook = require("./booksdb.js").findBook;
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body
    if (username && password) {
        if (isValid(username)) {
            return res.status(401).json({
                message: 'User already existed'
            })
        } else {
            users.push({ username, password })
            return res
                .status(200)
                .json({
                    message: 'User successfully registred. Now you can login'
                });
        }
    }
    return res.status(401).json({
        message: 'Unable to create user'
    })
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const books = await queryBooksAsync()
    return res
        .status(200)
        .json({ books })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params
    const book = await queryBooksAsync((book) => {
        return book.isbn === isbn
    })
    if (book) {
        return res.status(200).json({ book })
    }
    return res.status(404).json({
        message: `Cannot find the book has isbn ${isbn}`
    })
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params
    const book = await queryBooksAsync((book) => {
        return book.author === author
    })
    if (book) {
        return res.status(200).json({ book })
    }
    return res.status(404).json({
        message: `Cannot find the book has author ${author}`
    })
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params
    const book = await queryBooksAsync((book) => {
        return book.title === title
    })
    if (book) {
        return res.status(200).json({ book })
    }
    return res.status(404).json({
        message: `Cannot find the book has title ${title}`
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params
    const book = findBook((book) => {
        return book.isbn === isbn
    })
    if (book && book.length) {
        const { reviews } = book[0]
        return res.status(200).json({ reviews })
    }
    return res.status(404).json({
        message: `Cannot find the book has the review of isbn ${isbn}`
    })
});

module.exports.general = public_users;
