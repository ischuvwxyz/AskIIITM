// const Quest = require('../Models/questModel');
// const User = require('../Models/userModel');
// const AppError = require('../utils/AppError');
const Answer = require('../Models/answerModel');
const catchAsync = require('../utils/catchAsync');

exports.addAnswer = catchAsync(async (req, res, next) => {
  req.body.question = req.params.questionId;
  req.body.user = req.user.id;
  const doc = await Answer.create(req.body);
  res.status(200).json({
    status: 'success',
    doc
  });
});

exports.getUserAnswers = catchAsync(async (req, res, next) => {
  const answers = await Answer.find({ user: req.user.id });
  res.status(200).json({
    status: 'success',
    answers
  });
});

exports.getAnswerForQues = catchAsync(async (req, res, next) => {
  const answers = await Answer.find({ question: req.params.questionId });
  res.status(200).json({
    status: 'success',
    answers
  });
});

exports.getMostUpvotedAnswerForQues = catchAsync(async (req, res, next) => {
  const x = await Answer.find({ question: req.params.questionId });
  const scores = x.map(el => el.upVote);
  // commpare score which one have greatest
  // calculate the index of that score
  // find the answer for that particular index
  res.status(200).json({
    status: 'success',
    answers
  });
});
