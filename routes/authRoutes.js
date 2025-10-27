const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route Đăng ký (Register)
router.post('/register', registerValidation, AuthController.register);

// Route Đăng nhập (Login)
router.post('/login', loginValidation, AuthController.login);

// Route Lấy thông tin người dùng hiện tại (Cần đăng nhập)
router.get('/me', verifyToken, AuthController.getCurrentUser);

// Route Đăng xuất
router.post('/logout', AuthController.logout);

module.exports = router;