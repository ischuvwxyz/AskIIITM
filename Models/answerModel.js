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

answerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'question',
    select: 'question -user'
  });
  next();
});

module.exports = mongoose.model('Answer', answerSchema);
