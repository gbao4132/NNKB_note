require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes'); // Bạn đã có dòng này
const folderRoutes = require('./routes/folderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- BẠN SẼ THAY THẾ ĐOẠN CŨ BẰNG ĐOẠN NÀY ---
// URL của frontend sau khi deploy (bạn sẽ có ở Bước 4)
const frontendURL = "https://your-frontend-site.vercel.app"; 

const corsOptions = {
  origin: [frontendURL, 'http://localhost:5173'], // Cho phép cả local và production
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);

// Test kết nối DB và khởi động server
db.sequelize.sync() 
    .then(() => {
        console.log('Khởi tạo database thành công!!.');

        // Khởi động server CHỈ SAU KHI sync thành công
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Lỗi khi đồng bộ database:', err.message);
        process.exit(1);
    });