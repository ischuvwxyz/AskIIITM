const router = require('express').Router();
const questController = require('../Controllers/questController');
const authController = require('../Controllers/authController');

router.route('/').get(questController.getQuestions);

router
  .route('/addQuestion')
  .post(authController.protect, questController.addQuestion);

router.route('/:id').get(questController.getQuestionById);
router.route('/?userId').get(questController.getQuestionByUserId);

module.exports = router;
