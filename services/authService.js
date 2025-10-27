const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đảm bảo bạn đã cài đặt dotenv và file .env có JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const SALT_ROUNDS = 10;

class AuthService {
    // Mã hóa mật khẩu
    static async hashPassword(password) {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    // So sánh mật khẩu với hash
    static async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    // Tạo JWT token
    static generateToken(userId) {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
    }

    // Xác minh và giải mã JWT token
    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null; // Token không hợp lệ hoặc hết hạn
        }
    }
}

module.exports = AuthService;