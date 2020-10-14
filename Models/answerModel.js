const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quest'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  answer: String
});

module.exports = mongoose.model('Answer', answerSchema);
