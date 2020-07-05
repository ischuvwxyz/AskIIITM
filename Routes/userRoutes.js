const router = require('express').Router();

const userController = require('../Controllers/userController');

router.route('/').get(userController.getUsers).post(userController.createUser);

router.route('/:id').get(userController.getUserById);

module.exports = router;
