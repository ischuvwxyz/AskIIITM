const Quest = require('../Models/questModel');
const User = require('../Models/userModel');
const Answer = require('../Models/answerModel');
const AppError = require('../utils/AppError');
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
