const router = require('express').Router();
const questController = require('../Controllers/questController');
const authController = require('../Controllers/authController');

router.route('/quest/').get(questController.getQuestions);

router
  .route('/quest/addQuestion')
  .post(authController.protect, questController.addQuestion);

router.route('/quest/:id').get(questController.getQuestionById);
router.route('/quest').get(questController.findRecentQuestion);
router.route('/quest/?userId').get(questController.getQuestionByUserId);

module.exports = router;
