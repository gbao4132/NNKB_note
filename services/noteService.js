const db = require('../models');
const { Op } = require('sequelize');

// Helper function remains the same, it should find notes regardless of status
// so that we can restore or permanently delete them.
const verifyNoteOwnership = async (userId, noteId) => {
    const note = await db.Note.findByPk(noteId, {
        include: {
            model: db.Folder,
            as: 'folder',
            attributes: ['userId']
        }
    });
    if (!note) throw new Error('Không tìm thấy ghi chú.');
    // SỬA LỖI: Kiểm tra sự tồn tại của note.folder trước khi truy cập
    if (!note.folder || note.folder.userId !== userId) throw new Error('Bạn không có quyền truy cập ghi chú này.');
    return note;
};

class NoteService {
    static async createNote(userId, noteData) {
        const { title, content, folderId, tags } = noteData;
        const folder = await db.Folder.findOne({ where: { id: folderId, userId: userId } }); // SỬA LỖI: Đảm bảo userId được sử dụng
        if (!folder) throw new Error('Không tìm thấy thư mục hoặc bạn không có quyền ghi vào thư mục này.');
        // Status defaults to 'active' from the model, so no change needed here.
        const newNote = await db.Note.create({ title, content, folderId, tags });
        return newNote;
    }

    static async getNotesByFolder(userId, folderId) {
        const folder = await db.Folder.findOne({ where: { id: folderId, userId: userId } });
        if (!folder) throw new Error('Không tìm thấy thư mục hoặc bạn không có quyền xem.');
        
        const notes = await db.Note.findAll({
            where: {
                folderId: folderId,
                status: 'active' // Only get active notes
            },
            include: {
                model: db.Folder,
                as: 'folder',
                attributes: ['name']
            },
            order: [['updatedAt', 'DESC']]
        });
        return notes;
    }
    
    static async getNoteById(userId, noteId) {
        const note = await verifyNoteOwnership(userId, noteId);
        // Ensure we don't return a trashed note through this standard getter
        if (note.status === 'trashed') {
            throw new Error('Không tìm thấy ghi chú.');
        }
        // Tải lại note để lấy kèm tên thư mục (cho chắc chắn)
        const fullNote = await db.Note.findByPk(note.id, {
            include: { model: db.Folder, as: 'folder', attributes: ['name'] }
        });
        return fullNote;
    }

    static async updateNote(userId, noteId, updateData) {
        const note = await verifyNoteOwnership(userId, noteId);
        if (note.status === 'trashed') {
            throw new Error('Không thể chỉnh sửa ghi chú trong thùng rác.');
        }
        const [updatedRows] = await db.Note.update(updateData, { where: { id: noteId } });
        if (updatedRows === 0) throw new Error('Cập nhật thất bại.');
        return true;
    }

    // SOFT DELETE: Change status to 'trashed'
    static async deleteNote(userId, noteId) {
        await verifyNoteOwnership(userId, noteId);
        const [updatedRows] = await db.Note.update({ status: 'trashed' }, { where: { id: noteId } });
        if (updatedRows === 0) throw new Error('Xóa mềm thất bại.');
        return true;
    }

    // --- NEW METHODS FOR TRASH ---

    static async getTrashedNotes(userId) {
        const notes = await db.Note.findAll({
            where: {
                status: 'trashed'
            },
            include: [{
                model: db.Folder,
                as: 'folder',
                where: { userId: userId },
                attributes: [] // We only need the folder to filter by userId
            }],
            order: [['updatedAt', 'DESC']]
        });
        return notes;
    }

    static async restoreNote(userId, noteId) {
        await verifyNoteOwnership(userId, noteId);
        const [updatedRows] = await db.Note.update({ status: 'active' }, { where: { id: noteId } });
        if (updatedRows === 0) throw new Error('Khôi phục thất bại.');
        return true;
    }

    static async deleteNotePermanently(userId, noteId) {
        await verifyNoteOwnership(userId, noteId);
        const deletedRows = await db.Note.destroy({ where: { id: noteId } });
        if (deletedRows === 0) throw new Error('Xóa vĩnh viễn thất bại.');
        return true;
    }
}

module.exports = NoteService;