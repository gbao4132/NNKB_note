// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
// 1. Import thêm 'Link'
import { useNavigate, Link } from 'react-router-dom'; 

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError(null); 

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email: email,
                password: password
            });

            const token = response.data.token;
            localStorage.setItem('authToken', token);

            // Chuyển hướng đến trang /notes
            navigate('/notes'); 

        } catch (err) {
            if (err.response) {
                // Hiển thị lỗi từ server (ví dụ: "Sai mật khẩu")
                setError(err.response.data.message);
            } else {
                setError('Không thể kết nối đến máy chủ.');
            }
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
            
            {/* Hiển thị lỗi (nếu có) */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* 2. Thêm Link đến trang Đăng ký */}
            <p>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
        </div>
    );
}

export default LoginPage;