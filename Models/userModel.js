const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// User Schema

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be required']
    },
    email: {
      type: String,
      lowercase: true,
      unique: [true, 'Exists Already'],
      required: [true, 'Please provide Email'],
      validate: [validator.isEmail, 'Please provide correct email']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      required: [true, 'Please enter a password']
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validator: {
        validate: function (el) {
          return el === this.password;
        },
        message: 'Password not matching'
      }
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStmamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStmamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
