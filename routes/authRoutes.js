const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', registerValidation, AuthController.register);

router.post('/login', loginValidation, AuthController.login);

router.get('/me', verifyToken, AuthController.getCurrentUser);

router.post('/logout', AuthController.logout);

module.exports = router;