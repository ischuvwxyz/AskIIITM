const router = require('express').Router();

const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

router.route('/').get(userController.getUsers).post(userController.createUser);

router.route('/:id').get(userController.getUserById);

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

module.exports = router;
