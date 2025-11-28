const db = require('../models'); // Import models

class FolderService {

    /**
     * Tạo một thư mục mới cho người dùng
     * @param {number} userId - ID của người dùng (lấy từ token)
     * @param {object} folderData - Dữ liệu thư mục (ví dụ: { name: 'Tên thư mục' })
     * @returns {Promise<object>} Thư mục vừa được tạo
     */
    static async createFolder(userId, folderData) {
        try {
            const { name } = folderData;
            
            if (!name) {
                throw new Error("Tên thư mục là bắt buộc.");
            }

            const newFolder = await db.Folder.create({
                name: name,
                userId: userId // Gán thư mục này cho người dùng đang đăng nhập
            });

            return newFolder;
        } catch (error) {
            console.error("Lỗi tại FolderService.createFolder:", error);
            throw error;
        }
    }

    /**
     * Lấy tất cả thư mục của một người dùng
     * @param {number} userId - ID của người dùng
     * @returns {Promise<Array>} Danh sách các thư mục
     */
    static async getFoldersByUser(userId) {
        try {
            const folders = await db.Folder.findAll({
                where: { userId: userId },
                order: [['name', 'ASC']] // Sắp xếp theo tên A-Z
            });
            return folders;
        } catch (error) {
            console.error("Lỗi tại FolderService.getFoldersByUser:", error);
            throw error;
        }
    }
}

module.exports = FolderService;