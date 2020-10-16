const Quest = require('../Models/questModel');
const User = require('../Models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getQuestions = catchAsync(async (req, res, next) => {
  const quests = await Quest.find();
  if (!quests) return next(new AppError('No questions found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      questions: quests
    }
  });
});

exports.getQuestionById = catchAsync(async (req, res, next) => {
  const quest = await Quest.findById(req.params.id);

  if (!quest) return next(new AppError('No question found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      question: quest
    }
  });
});

exports.getQuestionByUserId = catchAsync(async (req, res, next) => {
  const quests = await Quest.findOne({ user: req.params.userId });

  if (!quests) return next(new AppError('No questions found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      questions: quests
    }
  });
});

exports.addQuestion = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const user = await User.findById(req.user.id);
  const quest = await Quest.create(req.body);
  if (quest) {
    user.questions.push(quest._id);
    user.markModified('questions');
    user.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: 'success',
    data: {
      question: quest
    }
  });
});

exports.findRecentQuestion = catchAsync(async(req, res, next) => {
  const questions = await Quest.find({createdAt: {$gt: Date.now() - 24 * 60 * 60 * 1000 * 10}});
  res.status(200).json({
    status: "success",
    questions
  })
});
