const db = require('../models');
const { Op } = require('sequelize');

const verifyNoteOwnership = async (userId, noteId) => {
    const note = await db.Note.findByPk(noteId, {
        include: {
            model: db.Folder,
            as: 'folder',
            attributes: ['userId']
        }
    });
    if (!note) throw new Error('Không tìm thấy ghi chú.');
    if (note.folder.userId !== userId) throw new Error('Bạn không có quyền truy cập ghi chú này.');
    return note;
};

class NoteService {
    static async createNote(userId, noteData) {
        const { title, content, folderId } = noteData;
        const folder = await db.Folder.findOne({ where: { id: folderId, userId: userId } });
        if (!folder) throw new Error('Không tìm thấy thư mục hoặc bạn không có quyền ghi vào thư mục này.');
        const newNote = await db.Note.create({ title, content, folderId });
        return newNote;
    }

    static async getNotesByFolder(userId, folderId) {
        const folder = await db.Folder.findOne({ where: { id: folderId, userId: userId } });
        if (!folder) throw new Error('Không tìm thấy thư mục hoặc bạn không có quyền xem.');
        
        // --- SỬA LẠI HÀM NÀY ---
        const notes = await db.Note.findAll({
            where: { folderId: folderId },
            include: { // <-- THÊM VÀO: Lấy kèm thông tin Folder
                model: db.Folder,
                as: 'folder',
                attributes: ['name'] // Chỉ lấy tên thư mục
            },
            order: [['updatedAt', 'DESC']]
        });
        return notes;
    }
    
    static async getNoteById(userId, noteId) {
        const note = await verifyNoteOwnership(userId, noteId);
        // Tải lại note để lấy kèm tên thư mục (cho chắc chắn)
        const fullNote = await db.Note.findByPk(note.id, {
            include: { model: db.Folder, as: 'folder', attributes: ['name'] }
        });
        return fullNote;
    }

    static async updateNote(userId, noteId, updateData) {
        await verifyNoteOwnership(userId, noteId);
        const [updatedRows] = await db.Note.update(updateData, { where: { id: noteId } });
        if (updatedRows === 0) throw new Error('Cập nhật thất bại.');
        return true;
    }

    static async deleteNote(userId, noteId) {
        await verifyNoteOwnership(userId, noteId);
        const deletedRows = await db.Note.destroy({ where: { id: noteId } });
        if (deletedRows === 0) throw new Error('Xóa thất bại.');
        return true;
    }
}

module.exports = NoteService;