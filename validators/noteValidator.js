const { body } = require('express-validator');
const { handleValidationErrors } = require('./authValidator'); // Import từ file đã tạo

const createNoteValidation = [
    // Kiểm tra tiêu đề: không được trống và dài ít nhất 3 ký tự
    body('title').isLength({ min: 3 }).withMessage('Tiêu đề phải dài ít nhất 3 ký tự.').trim().escape(),
    // Nội dung là tùy chọn, nhưng nếu có thì phải là chuỗi
    body('content').optional().isString().withMessage('Nội dung phải là chuỗi hợp lệ.'),
    handleValidationErrors
];

const shareNoteValidation = [
    // Kiểm tra targetUserId: phải là số nguyên dương (ID người dùng)
    body('targetUserId').isInt({ gt: 0 }).withMessage('ID người dùng chia sẻ phải là số nguyên dương.'),
    // Kiểm tra quyền: phải là 'read' hoặc 'edit'
    body('permission').isIn(['read', 'edit']).withMessage('Quyền không hợp lệ. Phải là "read" hoặc "edit".'),
    handleValidationErrors
];

module.exports = {
    createNoteValidation,
    shareNoteValidation
};