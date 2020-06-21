const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;

dotenv.config();
mongoose.connect("mongodb://localhost:27017/twitterDB", {useNewUrlParser: true, useUnifiedTopology: true})

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const User = require('./models/user');
const Tweet = require('./models/tweet');

app.post("/users/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (!err) {
          const newUser = new User({
              username: req.body.username,
              password: hash
          })
          newUser.save().then(() => {
            res.status(200).json({
              "userId": newUser._id,
              "username": newUser.username
            })
          })
        } else {
           res.status(500).json({
             "error": err.message
           });
        }
    })
})

app.post("/users/login", (req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
         if (user) {
            bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
                if (isMatch) {
                    res.status(200).json({
                      "found": isMatch,
                      "username": user.username,
                      "userId": user._id
                    })
                } else {
                  res.status(500).json({
                    "found": isMatch
                  })
                }
            })
          } else {
            res.status(500).json({
              "error": "User not found"
            });
          }
    })
})

app.post("/tweets", (req, res) => {
    const username = req.body.username;
    const tweetContent = req.body.tweet;

    const newTweet = new Tweet({
        authorUsername: username,
        content: tweetContent,
        createdAt: new Date().toString()
    })

    newTweet.save().then(res.status(200).json({"message": "Success"}));
})


app.get("/tweets", (req, res) => {
  Tweet.find({}, (err, tweets) => {
      if (!err) {
        res.status(200).json(tweets);
      } else {
        res.status(500).json({
          "error": err.message
        })
      }
  })
})

app.get("/tweets/:username", (req, res) => {
    const username = req.params.username;
    Tweet.find({authorUsername: username}, (err, tweets) => {
        if (!err) {
            res.status(200).json(tweets);
        } else {
            res.status(500).json({
              "error": err.message
            })
        }
    })
})


const port = process.env.PORT;
app.listen(port, function() {
  console.log(`Server is running on port ${port}`);
})
