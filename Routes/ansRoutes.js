const router = require('express').Router();
const ansController = require('../Controllers/ansController');
const authController = require('../Controllers/authController');

router
  .route('/answer/:questionId')
  .post(authController.protect, ansController.addAnswer);

module.exports = router;
