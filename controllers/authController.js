const db = require('../models');
const AuthService = require('../services/authService');

class AuthController {
    // Xử lý POST /api/auth/register
    static async register(req, res) {
        const { email, password, fullName } = req.body;
        try {
            // 1. Kiểm tra User đã tồn tại
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: 'Email đã được đăng ký.' });
            }

            // 2. Mã hóa mật khẩu
            const hashedPassword = await AuthService.hashPassword(password);

            // 3. Tạo User trong DB
            const newUser = await db.User.create({
                email,
                password: hashedPassword,
                fullName
            });

            // 4. Tạo token và phản hồi
            const token = AuthService.generateToken(newUser.id);
            
            return res.status(201).json({ 
                message: 'Đăng ký thành công.',
                user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName },
                token 
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server trong quá trình đăng ký.' });
        }
    }

    // Xử lý POST /api/auth/login
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            // 1. Tìm User
            const user = await db.User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
            }

            // 2. So sánh mật khẩu
            const isMatch = await AuthService.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
            }

            // 3. Tạo token
            const token = AuthService.generateToken(user.id);

            return res.status(200).json({
                message: 'Đăng nhập thành công.',
                user: { id: user.id, email: user.email, fullName: user.fullName },
                token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server trong quá trình đăng nhập.' });
        }
    }
    
    // Xử lý GET /api/auth/me (Sau khi verifyToken đã chạy)
    static async getCurrentUser(req, res) {
        try {
            const user = await db.User.findByPk(req.userId, { 
                attributes: ['id', 'email', 'fullName', 'createdAt'] // Không trả về password
            });

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại.' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng.' });
        }
    }

    // Logout không cần logic phức tạp (chỉ cần xóa token phía client), nhưng có thể thêm logic nếu dùng blacklist token
    static logout(req, res) {
        // Trong kiến trúc JWT Stateless, logout chỉ đơn giản là thông báo thành công
        return res.status(200).json({ message: 'Đăng xuất thành công (token cần được xóa khỏi client).' });
    }
}

module.exports = AuthController;