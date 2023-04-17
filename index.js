const express = require("express");
const app = express();
const { User, Post } = require("./db");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    res.send(
      "<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>"
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashPw = await bcrypt.hash(password, 5);
    const newUser = await User.create({ username, password: hashPw });
    res.status(200).send(`successfully created user ${newUser.username}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).send(`no user ${username} found in database`);
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      res.status(401).send(`incorrect username or password`);
    } else {
      res.status(200).send(`successfully logged in user ${user.username}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /me
// TODO - use the username and password to authenticate the user. If the password matches, send back the associated data created in the last bonus step.
app.get("/me", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Post,
        },
      ],
    });
    if (!user) {
      res.status(401).send(`no user ${username} found in database`);
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      res.status(401).send(`incorrect username or password`);
    } else {
      res.status(200).send(user.posts);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
