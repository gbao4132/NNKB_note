const NoteService = require('../services/noteService');
// (Chúng ta không cần db ở đây nữa)

class NoteController {

    /**
     * POST /api/notes
     * Tạo Ghi chú (Body cần { title, content, folderId })
     */
    static async createNote(req, res) {
        const { title, content, folderId } = req.body;
        const userId = req.userId; // Lấy từ verifyToken

        try {
            const note = await NoteService.createNote(userId, { title, content, folderId });
            return res.status(201).json(note);
        
        } catch (error) {
            // Lỗi 400 (Bad Request) nếu folderId không hợp lệ
            if (error.message.includes("Không tìm thấy thư mục")) {
                return res.status(400).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi tạo ghi chú.' });
        }
    }
    
    /**
     * GET /api/notes?folderId=1
     * Lấy tất cả Ghi chú (theo thư mục)
     */
    static async getAllNotes(req, res) {
        const userId = req.userId;
        const { folderId } = req.query; // Lấy folderId từ query string

        if (!folderId) {
            return res.status(400).json({ message: 'Vui lòng cung cấp folderId.' });
        }

        try {
            const notes = await NoteService.getNotesByFolder(userId, Number(folderId));
            return res.status(200).json(notes);
        
        } catch (error) {
            // Lỗi 404 (Not Found) nếu không có quyền xem folder
            if (error.message.includes("Không tìm thấy thư mục")) {
                return res.status(404).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi lấy danh sách ghi chú.' });
        }
    }
    
    /**
     * GET /api/notes/:id
     * Lấy chi tiết 1 ghi chú
     */
    static async getNoteById(req, res) {
        const noteId = req.params.id;
        const userId = req.userId;

        try {
            const note = await NoteService.getNoteById(userId, noteId);
            return res.status(200).json(note);
        
        } catch (error) {
            // Lỗi 404 nếu không tìm thấy hoặc không có quyền
            if (error.message.includes("Không tìm thấy") || error.message.includes("không có quyền")) {
                return res.status(404).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server.' });
        }
    }
    
    /**
     * PUT /api/notes/:id
     * Cập nhật ghi chú
     */
    static async updateNote(req, res) {
        const noteId = req.params.id;
        const userId = req.userId;
        const { title, content } = req.body; // Chỉ cho phép sửa title/content

        try {
            await NoteService.updateNote(userId, noteId, { title, content });
            return res.status(200).json({ message: 'Cập nhật ghi chú thành công.' });
        
        } catch (error) {
            // Lỗi 404 nếu không tìm thấy hoặc không có quyền
            if (error.message.includes("Không tìm thấy") || error.message.includes("không có quyền")) {
                return res.status(404).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi cập nhật.' });
        }
    }

    /**
     * DELETE /api/notes/:id
     * Xóa ghi chú
     */
    static async deleteNote(req, res) {
        const noteId = req.params.id;
        const userId = req.userId;

        try {
            await NoteService.deleteNote(userId, noteId);
            return res.status(204).send(); // 204 No Content
        
        } catch (error) {
            // Lỗi 404 nếu không tìm thấy hoặc không có quyền
            if (error.message.includes("Không tìm thấy") || error.message.includes("không có quyền")) {
                return res.status(404).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi xóa.' });
        }
    }
    
    // --- TOÀN BỘ CONTROLLER 'shareNote' VÀ 'unshareNote' ĐÃ BỊ XÓA ---
}

module.exports = NoteController;