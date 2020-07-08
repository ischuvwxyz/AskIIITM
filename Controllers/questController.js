const Quest = require('../Models/questModel');
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
  const quest = await Quest.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      question: quest
    }
  });
});
