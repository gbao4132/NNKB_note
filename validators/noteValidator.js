const { body } = require('express-validator');
const handleValidationErrors = require('../utils/validationHandler');
const db = require('../models'); // Import db

// Sửa lại validation cho 'Tạo Ghi chú'
const createNoteValidation = [
    body('title')
        .isLength({ min: 1 })
        .withMessage('Tiêu đề không được để trống.')
        .trim(),
    body('content')
        .optional()
        .isString()
        .withMessage('Nội dung phải là chuỗi hợp lệ.'),
    
    // --- THÊM QUY TẮC MỚI ---
    body('folderId')
        .notEmpty().withMessage('folderId là bắt buộc.')
        .isInt().withMessage('folderId phải là một con số.')
    ,handleValidationErrors
];

// --- XÓA HOÀN TOÀN 'shareNoteValidation' ---
// const shareNoteValidation = [ ... ]; // <-- XÓA BỎ KHỐI NÀY

module.exports = {
    createNoteValidation
    // Không export 'shareNoteValidation' nữa
};