const router = require('express').Router();

const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

router.post('/user/signup', authController.signUp);
router.post('/user/login', authController.login);

router.post('/user/forgotPassword', authController.forgotPassword);
router.post('/user/resetPassword/:token', authController.resetPassword);
router.patch(
  '/user/updatePassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/user/')
  .get(userController.getUsers)
  .post(userController.createUser);

router.route('user/:id').get(userController.getUserById);

router
  .route('/user/votequestion/:questionId')
  .post(authController.protect, userController.voteQuestion);
module.exports = router;
