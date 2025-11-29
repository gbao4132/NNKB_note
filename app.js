require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const folderRoutes = require('./routes/folderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CẤU HÌNH CORS (MỞ RỘNG)
app.use(cors({
    origin: '*', // Cho phép Vercel, Localhost, hay bất cứ đâu gọi vào
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các method cho phép
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);

// Test kết nối DB và khởi động server
db.sequelize.sync() 
    .then(() => {
        console.log('Khởi tạo database thành công!!.');
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Lỗi khi đồng bộ database:', err.message);
        process.exit(1);
    });