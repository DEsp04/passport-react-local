const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
// const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();
const User = require("./user")


const app = express();

let MONGODB_URI = process.env.PROD_MONGODB || process.env.MONGODB_URI || process.env.DB_Cluster_URL;

mongoose.connect( MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
  () => {
  console.log("Mongoose is connected")
}
)


//Middleware
app.use(express.json(true));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(session({
  secret: "secretcode",
  resave: true,
  saveUninitialized: true,
}));

app.use(cookieParser("secretcode"))

//Routes
app.post("/login", (req, res) => {
  console.log(req.body)
})
app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      const newUser = new User({
        username: req.body.username,
        password:  hashedPassword,
      });
      await newUser.save();
      res.send("User Created")
    }
  })
})
app.post("/user", (req, res) => {
  console.log(req.body)
})


//start server
app.listen(4000, () => {
  console.log("server has started")
})



//video: 22:10