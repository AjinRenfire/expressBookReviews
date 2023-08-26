const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    let username = req.query.username;
    let password = req.query.password;

    if (!username || !password) {
        return res.send("Username or password invalid");
    }

    if (isValid(username)) {
        res.send("username and/or password are not provided.");
    }

    try {
        users.push({ username: username, password: password });
        res.send("User registed successfully");
    } catch (e) {
        return res.status(500).json({ message: "Some server error occured" });
    }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    await res.status(200).send(books);
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    let isbnCode = req.params.isbn;
    if (isbnCode) {
        await res.send(books[isbnCode]);
    }
    await res.status(400).send("Give a valid ISBN ");

    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    let bookObj = {};

    Object.keys(books).forEach((id) => {
        if (books[id].author === req.params.author) {
            bookObj = books[id];
        }
    });

    if (bookObj) {
        await res.send(bookObj);
    }
    return await res.status(400).json({ message: "Give a vaild author name" });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    let bookObj = {};

    Object.keys(books).forEach((id) => {
        if (books[id].title === req.params.title) {
            bookObj = books[id];
        }
    });

    if (bookObj) {
        await res.send(bookObj);
    }
    return await res.status(400).json({ message: "Give a vaild author name" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    let isbnCode = req.params.isbn;
    if (isbnCode) {
        res.send(books[isbnCode].reviews);
    }
    res.status(400).send("Give a valid ISBN ");
});

module.exports.general = public_users;
