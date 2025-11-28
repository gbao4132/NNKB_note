const { body, validationResult } = require('express-validator');
// Import hàm xử lý lỗi từ file utils mới
const handleValidationErrors = require('../utils/validationHandler'); 

const registerValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ.').trim().escape(),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự.'),
    body('fullName').notEmpty().withMessage('Họ tên không được để trống.').trim().escape(),
    // Gắn middleware xử lý lỗi vào cuối mảng
    handleValidationErrors 
];

const loginValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ.').trim().escape(),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống.'),
    // Gắn middleware xử lý lỗi vào cuối mảng
    handleValidationErrors 
];

module.exports = {
    registerValidation,
    loginValidation,
    // KHÔNG cần export handleValidationErrors ở đây nữa
};