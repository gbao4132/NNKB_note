const FolderService = require('../services/folderService');

class FolderController {

    // POST /api/folders - Tạo thư mục
    static async createFolder(req, res) {
        const userId = req.userId; // Lấy từ middleware verifyToken
        const { name } = req.body; // Lấy tên thư mục từ body

        try {
            const newFolder = await FolderService.createFolder(userId, { name });
            return res.status(201).json(newFolder);
        
        } catch (error) {
            if (error.message.includes("bắt buộc")) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Lỗi server khi tạo thư mục.' });
        }
    }

    // GET /api/folders - Lấy tất cả thư mục
    static async getAllFolders(req, res) {
        const userId = req.userId; // Lấy từ middleware verifyToken

        try {
            const folders = await FolderService.getFoldersByUser(userId);
            return res.status(200).json(folders);

        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server khi lấy danh sách thư mục.' });
        }
    }
}

module.exports = FolderController;