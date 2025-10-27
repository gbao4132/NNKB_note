const { body } = require('express-validator');
const { handleValidationErrors } = require('./authValidator'); 

const createNoteValidation = [
    body('title').isLength({ min: 3 }).withMessage('Tiêu đề phải dài ít nhất 3 ký tự.').trim().escape(),
    body('content').optional().isString().withMessage('Nội dung phải là chuỗi hợp lệ.'),
    handleValidationErrors
];

const shareNoteValidation = [
    body('targetUserId').isInt({ gt: 0 }).withMessage('ID người dùng chia sẻ phải là số nguyên dương.'),
    body('permission').isIn(['read', 'edit']).withMessage('Quyền không hợp lệ. Phải là "read" hoặc "edit".'),
    handleValidationErrors
];

module.exports = {
    createNoteValidation,
    shareNoteValidation
};