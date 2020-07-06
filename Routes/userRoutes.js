const router = require('express').Router();

const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getUsers);

router.route('/:id').get(userController.getUserById);

module.exports = router;
