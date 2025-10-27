const AuthService = require('../services/authService');
const NoteService = require('../services/noteService');

const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization (Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token, ủy quyền bị từ chối.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn.' });
    }

    // Gắn userId vào request để Controller sử dụng
    req.userId = decoded.userId;
    next();
};

const checkOwnership = async (req, res, next) => {
    const noteId = req.params.id;
    const userId = req.userId; // userId đã được gắn bởi verifyToken

    const isOwner = await NoteService.checkOwnership(noteId, userId);

    if (!isOwner) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập hoặc chỉnh sửa ghi chú này.' });
    }

    next();
};

module.exports = {
    verifyToken,
    checkOwnership
};