const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
let secret = "SUPERSECRET";
app.use(express.json());

app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    let authHeader = req.headers["authorization"];
    let token = authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, secret, (err) => {
        if (err) {
            res.send("You're not authorized");
        }
    });
    next();
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
