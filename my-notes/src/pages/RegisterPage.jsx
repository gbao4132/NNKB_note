// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css'; // Import CSS để tạo giao diện

function RegisterPage() {
    // 1. THÊM STATE CHO HỌ TÊN
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Sử dụng biến môi trường cho URL của API
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

            // 2. GỬI KÈM 'fullName' TRONG REQUEST
            await axios.post(`${API_URL}/api/auth/register`, {
                fullName: fullName,
                email: email,
                password: password
            });

            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');

        } catch (err) {
            // Cập nhật logic catch lỗi để hiển thị lỗi validation
            if (err.response && err.response.data) {
                if (err.response.data.errors && err.response.data.errors.length > 0) {
                    // Lỗi từ validator (giống như lỗi bạn vừa thấy)
                    setError(err.response.data.errors[0].msg);
                } else if (err.response.data.message) {
                    // Lỗi từ controller (ví dụ: "Email đã tồn tại")
                    setError(err.response.data.message);
                } else {
                    setError('Lỗi khi đăng ký.');
                }
            } else {
                setError('Không thể kết nối đến máy chủ.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Đăng ký tài khoản mới</h2>
                <form onSubmit={handleRegister} className="auth-form">
                    
                    {/* 3. THÊM Ô INPUT CHO HỌ TÊN */}
                    <div className="input-group">
                        <label htmlFor="fullName">Họ và Tên:</label>
                        <input 
                            id="fullName"
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                            id="email"
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input 
                            id="password"
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>
                
                {error && <p className="error-message">{error}</p>}

                <p className="redirect-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;