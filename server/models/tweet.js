const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    authorUsername: String,
    content: String,
    createdAt: String
})

const Tweet = new mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
