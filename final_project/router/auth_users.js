const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
//I know it should be as env variable but ..... I am lazy
let secret = "SUPERSECRET";

const isValid = (username) => {
    if (users !== []) {
        for (const user of users) {
            if (user.username === username) return true;
        }
    }

    return false;
};

const authenticatedUser = (username, password) => {
    if (users !== []) {
        for (const user of users) {
            if (user.username === username || user.password === password)
                return true;
        }
    }

    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    let username = req.query.username;
    let password = req.query.password;

    if (authenticatedUser(username, password)) {
        let token = jwt.sign(username, secret);
        res.json({ msg: "logged in ", token: token });
    }
    return res.status(401).json({ message: "some error occured" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader.split(" ")[1];

    let isbn = req.params.isbn;
    let review = req.query.review;

    let user = jwt.verify(token, secret); // get the decoded msg

    //this automatically add if new or updates if it already exists
    books[isbn].reviews[user] = review;

    return res.status(200).json({ message: "Review added", books });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader.split(" ")[1];

    let isbn = req.params.isbn;
    let review = req.query.review;

    let user = jwt.verify(token, secret); // get the decoded msg
    delete books[isbn].reviews[user];

    return res.status(200).json({ message: "Review deleted", books });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
