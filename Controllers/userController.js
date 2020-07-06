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
    message: `try /api/v1/users/signup`
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
