const { validationResult } = require('express-validator');

// Hàm xử lý lỗi validation chung (middleware)
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Trả về lỗi 400 Bad Request nếu validation thất bại
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = handleValidationErrors; // Export trực tiếp hàm này
