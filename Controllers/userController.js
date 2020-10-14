const Quest = require('../Models/questModel');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.createUser = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'failure',
    message: `try /api/v1/user/signup`
  });
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.voteQuestion = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const question = await Quest.findById(req.params.questionId);
  if (question) {
    if (req.body.type === 'upvote') {
      question.upVote += 1;
      user.upVoted.push(question._id);
    } else if (req.body.type === 'downvote') {
      question.downVote += 1;
      user.downVoted.push(question._id);
    }
  }
  // eslint-disable-next-line no-unused-expressions
  question.save() && user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success'
  });
});

// exports.updateMe = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.user.id, {
//     name:
//   });
// });
