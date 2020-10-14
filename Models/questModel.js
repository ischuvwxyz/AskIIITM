const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'You forgot to ask a question']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Question must belong to a user']
    },
    upVote: { type: Number, default: 0 },
    downVote: { type: Number, default: 0 }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

questionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email -_id'
  });
  next();
});

const Quest = mongoose.model('Quest', questionSchema);

module.exports = Quest;
