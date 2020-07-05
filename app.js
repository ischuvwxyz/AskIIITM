const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

const userRouter = require('./Routes/userRoutes');

// Body parser, reading body into req.body
app.use(express.json({ limit: '10kb' }));

// Form data parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests for the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, try again after an hour'
});

app.use('/api', limiter);

app.use('/api/v1/users', userRouter);

module.exports = app;
