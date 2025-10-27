const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/noteController');
const { verifyToken, checkOwnership } = require('../middlewares/authMiddleware');
// Giả định bạn có validator riêng cho ghi chú (chưa code ở trên)
const { createNoteValidation } = require('../validators/noteValidator'); 

// Route Tạo Ghi chú (Cần đăng nhập và validation)
// Sử dụng createNoteValidation nếu bạn đã tạo, nếu chưa thì dùng tạm [body('title').notEmpty(), ...]
router.post('/', verifyToken, NoteController.createNote); 

// Route Lấy tất cả Ghi chú (Cần đăng nhập)
router.get('/', verifyToken, NoteController.getAllNotes);

// ... Các route khác (update, delete, share) sẽ cần verifyToken và checkOwnership

module.exports = router;