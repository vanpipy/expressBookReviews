const express = require('express');
const jwt = require('jsonwebtoken');
const {deleteBook, updateBook} = require('./booksdb.js');
const findBook = require("./booksdb.js").findBook;
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const user = users.filter((user) => {
        return user.username === username
    })
    return user && user.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let user = users.filter((user) => {
        return user.username === username
    })
    user = user[0]
    return user && (user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: 'Error logging in'
        })
    }
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({
            data: password
        }, 'access', {
            expiresIn: 60 * 60
        })
        req.session.authorization = { accessToken, username }
        return res.status(200).send('User successfully logged in')
    } else {
        return res.status(208).json({
            message: 'Invalid Login. Check username and password'
        })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { user } = req
    const { isbn } = req.params
    const { message } = req.body
    if (!message) {
        return res.status(401).json({
            message: 'The message is required'
        })
    }
    const book = findBook((book) => {
        return book.isbn === isbn
    })
    if (book && book[0]) {
        const newBook = updateBook((book) => {
            return book.isbn === isbn
        }, {
            reviews: {
                ...book[0].reviews,
                [user.username]: {
                    message,
                    updateDate: new Date().toString()
                }
            }
        })
        return res.status(200).json({
            message: `book ${isbn} update`,
            book: newBook
        })
    } else {
        return res.status(404).json({
            message: `Cannot find the book has isbn ${isbn}`
        })
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { user } = req
    const { isbn } = req.params
    const book = findBook((book) => {
        return book.isbn === isbn
    })
    if (book && book[0]) {
        delete book[0].reviews[user.username]
        const newBook = updateBook((book) => {
            return book.isbn === isbn
        }, book[0])
        return res.status(200).json({
            message: `Book ${isbn} has been deleted`,
            book: newBook
        })
    } else {
        return res.status(404).json({
            message: `Cannot find the book has isbn ${isbn}`
        })
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
