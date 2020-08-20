const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser"); // required for reading data inside request body

const User = require("./models/user"); // model of users, who are saved into DB

const app = express();

// URL to DB and connection
const URI = "mongodb+srv://dbUser:dbUser@cluster0.aiodd.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(5000)) // after succesful connection to DB starts server on port localhost:5000
    .catch(error => console.log(error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get("/login", (req, res) => {
    // get query parameters
    const requestUserName = req.query.userName;
    const requestPassword = req.query.password;

    // filter all user and if server finds the correct one it will send a response
    User.findOne({ userName: requestUserName, password: requestPassword })
        .then((result) => {
            res.json({ user: {
                    requestUserName,
                    requestPassword,
                } });
        })
        .catch((error) => {
            res.status(404).json({ user: null }); // if the user data wasnt rigth, then server will send null to the client
        });
});

app.post("/signup", (req, res) => {
    const user = new User(req.body); // get data about new user

    // save new user into DB
    user.save()
        .then(result => res.json({ user })) // after succesful save returns data about user
        .catch(error => console.log(error)); // print error into console
});