const { body, validationResult } = require('express-validator');

// Middleware xử lý lỗi validation chung
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ.').trim().escape(),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự.'),
    body('fullName').notEmpty().withMessage('Họ tên không được để trống.').trim().escape(),
    handleValidationErrors
];

const loginValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ.').trim().escape(),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống.'),
    handleValidationErrors
];

module.exports = {
    registerValidation,
    loginValidation,
    handleValidationErrors // Dùng chung cho các file validator khác
};