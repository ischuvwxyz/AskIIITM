const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
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

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect User or Password', 401));
  }
  createSendToken(user, 200, res);
});

// protect middleware : to protect routes only for logged in users
exports.protect = catchAsync(async (req, res, next) => {
  // get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('Login to access the page'), 401);
  }

  // verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // check if users still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exists', 401)
    );
  }
  // check if user change password after token issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please Login again.', 401)
    );
  } //issuedAt : iat
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to do this action`, 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocal}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    // await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      resetURL,
      message: 'Token send to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was error in sending email. Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3) Update changePasswordAt property for the user
  this.passwordChangedAt = Date.now();

  // 4) Log the user in, send JWT
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user form collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  )
    return next(new AppError('Invalid Credentials', 401));

  // 3) If so , update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4) Log user in send JWT
  createSendToken(user, 200, res);
});
