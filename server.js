const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const User = require("./models/user"); // model of users, who are saved into DB

// URL to DB and connection
const URI = "mongodb+srv://dbUser:dbUser@cluster0.aiodd.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(process.env.MONGODB_URI || URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => app.listen(process.env.PORT || 3000)) // after succesful connection to DB starts server on port localhost:5000
    .catch(error => console.log(error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS, PUT'
    );
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("HELLO JAKUB");
});

app.get("/login", (req, res) => {
    // get query parameters
    const requestUserName = req.query.userName;
    const requestPassword = req.query.password;

    // filter all user and if server finds the correct one it will send a response
    User.findOne({ userName: requestUserName, password: requestPassword })
        .then((result) => {
            res.json({ user: result });
        })
        .catch((error) => {
            console.log(error);
            res.json({ user: null }); // if the user data wasnt rigth, then server will send null to the client
        });
});

app.post("/signup", async (req, res) => {
    const userName = req.body.userName;
    // if user exists, then server will return null
    try {
        const userExists = await User.find({ userName });

        if (userExists.length === 0) { // this means, that user with this user name doesn't exists
            const user = new User(req.body); // get data about new user
            user.save()
                .then(() => res.json({ user })) // after succesful save returns data about user
                .catch(error => console.log(error)); // print error into console
        } else { // user with entered user name exists, so server return null
            res.json({ user: null });
        }
    } catch (error) {
        console.log(error);
    }
});

app.put("/myfavorite", (req, res) => {
    // dostanem potrebne udaje z body
    const userName = req.body.userName;
    const restaurantDetail = req.body.restaurantDetail;

    // najdem pouzivatela, ktoremu chcem pridat restauraciu do oblubenych
    User.findOne({ userName: userName })
        .then(result => {
            result.favoriteRestaurants.unshift(restaurantDetail); // novu restauraciu pridam na zaciatok Array listu
            result.save()
                .then(result => res.json({ user: result }))// server vrati uz updatnuteho pouzivatela
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
});

app.delete("/myfavorite", (req, res) => {
    const { userName } = req.body;
    const { restaurantId } = req.body;

    // najdem pouzivatela, ktory chce odobrat restauraciu zo svojho oblubeneho listu
    User.findOne({ userName: userName })
        .then(result => {
            // vytvorim novy array tym, ze prefiltrujem cely stary a ulozim donho iba restauracie, ktorzch id sa nezhoduje
            result.favoriteRestaurants = result.favoriteRestaurants.filter((restaurant) => {
                if (restaurant.id !== restaurantId)
                    return restaurant;
            });
            // nasledne ulozim upravene data o pouzivatelovi a ako odpoved vratim jeho nove data
            result.save()
                .then(result => res.json({ user: result }))
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
});
