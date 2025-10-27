const db = require('../models');

class NoteService {
    // Tạo ghi chú mới
    static async createNote(userId, { title, content }) {
        return db.Note.create({
            userId: userId,
            title: title,
            content: content
        });
    }

    // Lấy tất cả ghi chú của người dùng (bao gồm cả được chia sẻ)
    static async getNotesByUser(userId) {
        // Lấy ghi chú thuộc sở hữu của người dùng
        const ownedNotes = await db.Note.findAll({
            where: { userId: userId },
            order: [['updatedAt', 'DESC']]
        });
        
        // Lấy ghi chú được chia sẻ với người dùng
        const sharedNotes = await db.SharedNote.findAll({
            where: { sharedWithUserId: userId },
            include: [{ model: db.Note, as: 'note' }],
        });

        // Kết hợp và định dạng lại dữ liệu
        const notes = [
            ...ownedNotes.map(n => ({ ...n.toJSON(), type: 'owned' })),
            ...sharedNotes.map(s => ({ 
                ...s.note.toJSON(), 
                permission: s.permission, 
                sharedWith: s.sharedWithUserId,
                type: 'shared' 
            }))
        ];

        return notes;
    }

    // Kiểm tra quyền sở hữu
    static async checkOwnership(noteId, userId) {
        const note = await db.Note.findOne({ where: { id: noteId } });
        if (!note) return null;
        return note.userId === userId;
    }
    
    // ... [updateNote, deleteNote, shareNote sẽ được thêm sau]
}

module.exports = NoteService;