const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  author: String,
  content: String,
  title: String
});

module.exports = mongoose.model('Post', schema);
