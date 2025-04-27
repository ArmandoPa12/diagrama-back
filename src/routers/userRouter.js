const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidator } = require('../middleware/validators/userValidator');
const { validateRequest } = require('../middleware/validateRequest');


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/register', createUserValidator, validateRequest, userController.createUser);
router.post('/login', userController.loginUser);


module.exports = router;