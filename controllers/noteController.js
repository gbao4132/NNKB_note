const NoteService = require('../services/noteService');
const { handleValidationErrors } = require('../validators/authValidator'); // Dùng chung lỗi

class NoteController {
    // Xử lý POST /api/notes
    static async createNote(req, res) {
        //  kiểm tra lỗi
        const validationError = handleValidationErrors(req, res, () => {});
        if (validationError) return validationError;

        const { title, content } = req.body;
        const userId = req.userId; // userId từ AuthMiddleware

        try {
            const newNote = await NoteService.createNote(userId, { title, content });
            return res.status(201).json({
                message: 'Tạo ghi chú thành công.',
                note: newNote
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi tạo ghi chú.' });
        }
    }

    // Xử lý GET /api/notes
    static async getAllNotes(req, res) {
        const userId = req.userId;
        try {
            const notes = await NoteService.getNotesByUser(userId);
            return res.status(200).json(notes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi lấy danh sách ghi chú.' });
        }
    }

    //[chưa có getNoteById, updateNote, deleteNote, shareNote]
}

module.exports = NoteController;