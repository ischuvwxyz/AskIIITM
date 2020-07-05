const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password)
    return next(new AppError('Please Provide Email and Password', 400));

  const user = User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError('Invald Cridentials', 401));
  createSendToken(user, 200, res);
});
