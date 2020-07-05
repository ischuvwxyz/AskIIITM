const mongoose = require('mongoose');
const validator = require('validator');

// User Schema

const userSchema = mongoose.model({
  name: {
    type: String,
    required: [true, 'A name must be required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: [true, 'Exists Already'],
    required: [true, 'Please provide Email'],
    validate: [validator.isEmail, 'Please provide correct email']
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
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

const Users = mongoose.Schema('Users', userSchema);

module.exports = Users;
