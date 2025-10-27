const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const db = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Test kết nối DB và khởi động server
db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Kết nối đến database thành công.');
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối database. Kiểm tra cấu hình và PostgreSQL server:', err.message);
        process.exit(1); // Thoát nếu không kết nối được DB
    });