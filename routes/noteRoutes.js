const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/noteController');
const {verifyToken} = require('../middlewares/authMiddleware.js');
const { createNoteValidation } = require('../validators/noteValidator'); 

// POST /api/notes: Tạo Ghi chú
router.post('/', 
    verifyToken, 
    ...createNoteValidation, 
    NoteController.createNote
);

// GET /api/notes: Lấy tất cả Ghi chú (theo ?folderId=)
router.get('/', 
    verifyToken, 
    NoteController.getAllNotes
);

// --- TRASH ROUTES ---

// GET /api/notes/trashed: Lấy ghi chú trong thùng rác
router.get('/trashed',
    verifyToken,
    NoteController.getTrashedNotes
);

// POST /api/notes/:id/restore: Khôi phục ghi chú
router.post('/:id/restore',
    verifyToken,
    NoteController.restoreNote
);

// DELETE /api/notes/:id/permanent: Xóa ghi chú vĩnh viễn
router.delete('/:id/permanent',
    verifyToken,
    NoteController.deleteNotePermanently
);

// GET /api/notes/:id: Lấy chi tiết 1 ghi chú
router.get('/:id', 
    verifyToken, 
    NoteController.getNoteById
);

// PUT /api/notes/:id: Cập nhật ghi chú
router.put('/:id', 
    verifyToken, 
    NoteController.updateNote
);

// DELETE /api/notes/:id: Xóa ghi chú
router.delete('/:id', 
    verifyToken, 
    NoteController.deleteNote
);

// --- TOÀN BỘ CÁC ROUTE "SHARE" ĐÃ BỊ XÓA ---

module.exports = router;