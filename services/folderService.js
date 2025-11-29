// services/folderService.js
const db = require('../models');

class FolderService {
    static async getFolders(userId) {
        return await db.Folder.findAll({
            where: { userId },
            order: [['createdAt', 'ASC']]
        });
    }

    static async createFolder(userId, name) {
        return await db.Folder.create({ name, userId });
    }

    static async updateFolder(userId, folderId, newName) {
        const folder = await db.Folder.findOne({ where: { id: folderId, userId } });
        if (!folder) {
            throw new Error('Không tìm thấy thư mục hoặc bạn không có quyền sửa.');
        }
        folder.name = newName;
        await folder.save();
        return folder;
    }
}

module.exports = FolderService;